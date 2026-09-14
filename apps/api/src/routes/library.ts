import { and, avg, count, desc, eq, inArray, isNotNull } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index.js';
import { episodeProgress, LIBRARY_STATUSES, libraryEntry, MEDIA_TYPES } from '../db/schema.js';
import { currentUser, requireUser } from '../lib/session.js';

const titleParams = z.object({
  type: z.enum(MEDIA_TYPES),
  tmdbId: z.coerce.number().int().positive(),
});

const listQuery = z.object({
  status: z.enum([...LIBRARY_STATUSES, 'rated']).optional(),
  type: z.enum(MEDIA_TYPES).optional(),
});

const updateBody = z.object({
  // `undefined` keeps the current value, `null` clears it.
  status: z.enum(LIBRARY_STATUSES).nullable().optional(),
  rating: z.number().int().min(1).max(10).nullable().optional(),
  title: z.string().min(1).max(300),
  posterPath: z.string().max(200).nullable().optional(),
  releaseDate: z.string().max(20).nullable().optional(),
  genreIds: z.array(z.number().int().positive()).max(20).optional(),
});

const episodeBody = z.object({
  seasonNumber: z.number().int().min(0).max(1000),
  episodes: z.array(z.number().int().min(0).max(10000)).min(1).max(1000),
  watched: z.boolean(),
});

const serializeEntry = (entry: typeof libraryEntry.$inferSelect) => ({
  mediaType: entry.mediaType,
  tmdbId: entry.tmdbId,
  status: entry.status,
  rating: entry.rating,
  title: entry.title,
  posterPath: entry.posterPath,
  releaseDate: entry.releaseDate,
  genreIds: entry.genreIds,
  watchedAt: entry.watchedAt,
  updatedAt: entry.updatedAt,
});

export async function libraryRoutes(app: FastifyInstance) {
  /* Public community score ------------------------------------------- */

  app.get('/api/titles/:type/:tmdbId/stats', async (request, reply) => {
    const { type, tmdbId } = titleParams.parse(request.params);
    const [row] = await db
      .select({ average: avg(libraryEntry.rating), count: count(libraryEntry.rating) })
      .from(libraryEntry)
      .where(and(eq(libraryEntry.mediaType, type), eq(libraryEntry.tmdbId, tmdbId), isNotNull(libraryEntry.rating)));

    reply.header('Cache-Control', 'public, max-age=60');
    return { average: row?.average ? Number(Number(row.average).toFixed(1)) : null, count: row?.count ?? 0 };
  });

  /* Signed-in user's library ----------------------------------------- */

  app.register(async (me) => {
    me.addHook('preHandler', requireUser);

    me.get('/api/me/library', async (request) => {
      const user = currentUser(request);
      const { status, type } = listQuery.parse(request.query);

      const filters = [eq(libraryEntry.userId, user.id)];
      if (type) filters.push(eq(libraryEntry.mediaType, type));
      if (status === 'rated') filters.push(isNotNull(libraryEntry.rating));
      else if (status) filters.push(eq(libraryEntry.status, status));

      const entries = await db
        .select()
        .from(libraryEntry)
        .where(and(...filters))
        .orderBy(desc(libraryEntry.updatedAt))
        .limit(500);
      return { items: entries.map(serializeEntry) };
    });

    me.get('/api/me/library/summary', async (request) => {
      const user = currentUser(request);
      const rows = await db
        .select({
          status: libraryEntry.status,
          total: count(),
          rated: count(libraryEntry.rating),
        })
        .from(libraryEntry)
        .where(eq(libraryEntry.userId, user.id))
        .groupBy(libraryEntry.status);

      const counts = { watchlist: 0, watching: 0, watched: 0, rated: 0 };
      for (const row of rows) {
        if (row.status) counts[row.status] = row.total;
        counts.rated += row.rated;
      }
      return counts;
    });

    me.get('/api/me/library/:type/:tmdbId', async (request) => {
      const user = currentUser(request);
      const { type, tmdbId } = titleParams.parse(request.params);
      const [entry] = await db
        .select()
        .from(libraryEntry)
        .where(and(eq(libraryEntry.userId, user.id), eq(libraryEntry.mediaType, type), eq(libraryEntry.tmdbId, tmdbId)));
      return { entry: entry ? serializeEntry(entry) : null };
    });

    me.put('/api/me/library/:type/:tmdbId', async (request) => {
      const user = currentUser(request);
      const { type, tmdbId } = titleParams.parse(request.params);
      const body = updateBody.parse(request.body);

      const [existing] = await db
        .select()
        .from(libraryEntry)
        .where(and(eq(libraryEntry.userId, user.id), eq(libraryEntry.mediaType, type), eq(libraryEntry.tmdbId, tmdbId)));

      const status = body.status === undefined ? (existing?.status ?? null) : body.status;
      const rating = body.rating === undefined ? (existing?.rating ?? null) : body.rating;

      // Nothing left to remember about this title.
      if (status === null && rating === null) {
        if (existing) await db.delete(libraryEntry).where(eq(libraryEntry.id, existing.id));
        return { entry: null };
      }

      const values = {
        status,
        rating,
        title: body.title,
        posterPath: body.posterPath ?? existing?.posterPath ?? null,
        releaseDate: body.releaseDate ?? existing?.releaseDate ?? null,
        genreIds: body.genreIds ?? existing?.genreIds ?? [],
        watchedAt: status === 'watched' ? (existing?.status === 'watched' ? existing.watchedAt : new Date()) : null,
      };

      const [entry] = await db
        .insert(libraryEntry)
        .values({ userId: user.id, mediaType: type, tmdbId, ...values })
        .onConflictDoUpdate({
          target: [libraryEntry.userId, libraryEntry.mediaType, libraryEntry.tmdbId],
          set: { ...values, updatedAt: new Date() },
        })
        .returning();
      return { entry: serializeEntry(entry) };
    });

    /* Episode progress ------------------------------------------------ */

    me.get('/api/me/episodes/:tvId', async (request) => {
      const user = currentUser(request);
      const { tvId } = z.object({ tvId: z.coerce.number().int().positive() }).parse(request.params);
      const rows = await db
        .select({ seasonNumber: episodeProgress.seasonNumber, episodeNumber: episodeProgress.episodeNumber })
        .from(episodeProgress)
        .where(and(eq(episodeProgress.userId, user.id), eq(episodeProgress.tvId, tvId)));
      return { episodes: rows };
    });

    me.put('/api/me/episodes/:tvId', async (request) => {
      const user = currentUser(request);
      const { tvId } = z.object({ tvId: z.coerce.number().int().positive() }).parse(request.params);
      const { seasonNumber, episodes, watched } = episodeBody.parse(request.body);

      if (watched) {
        await db
          .insert(episodeProgress)
          .values(episodes.map((episodeNumber) => ({ userId: user.id, tvId, seasonNumber, episodeNumber })))
          .onConflictDoNothing();
      } else {
        await db
          .delete(episodeProgress)
          .where(
            and(
              eq(episodeProgress.userId, user.id),
              eq(episodeProgress.tvId, tvId),
              eq(episodeProgress.seasonNumber, seasonNumber),
              inArray(episodeProgress.episodeNumber, episodes),
            ),
          );
      }
      return { ok: true };
    });
  });
}
