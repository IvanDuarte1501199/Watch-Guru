import { randomInt } from 'node:crypto';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index.js';
import { MEDIA_TYPES, user, userList, userListItem } from '../db/schema.js';
import { currentUser, getSessionUser, requireUser } from '../lib/session.js';

const MAX_LISTS_PER_USER = 50;
const MAX_ITEMS_PER_LIST = 500;
const ID_ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const newListId = () => Array.from({ length: 10 }, () => ID_ALPHABET[randomInt(ID_ALPHABET.length)]).join('');

const listIdParam = z.object({ id: z.string().regex(/^[A-Za-z0-9]{10}$/) });
const itemParams = listIdParam.extend({
  type: z.enum(MEDIA_TYPES),
  tmdbId: z.coerce.number().int().positive(),
});

const listBody = z.object({
  title: z.string().trim().min(1).max(80),
  description: z.string().trim().max(500).default(''),
  isPublic: z.boolean().default(true),
});

const itemBody = z.object({
  title: z.string().min(1).max(300),
  posterPath: z.string().max(200).nullable().optional(),
  releaseDate: z.string().max(20).nullable().optional(),
});

const containsQuery = z.object({
  contains: z
    .string()
    .regex(/^(movie|tv):\d+$/)
    .optional(),
});

const notFound = (reply: FastifyReply) => reply.status(404).send({ error: 'list_not_found' });

async function ownedList(listId: string, userId: string) {
  const [list] = await db
    .select()
    .from(userList)
    .where(and(eq(userList.id, listId), eq(userList.userId, userId)));
  return list ?? null;
}

async function listItems(listId: string) {
  return db
    .select({
      mediaType: userListItem.mediaType,
      tmdbId: userListItem.tmdbId,
      title: userListItem.title,
      posterPath: userListItem.posterPath,
      releaseDate: userListItem.releaseDate,
      addedAt: userListItem.addedAt,
    })
    .from(userListItem)
    .where(eq(userListItem.listId, listId))
    .orderBy(desc(userListItem.addedAt));
}

export async function listRoutes(app: FastifyInstance) {
  /* Public ------------------------------------------------------------ */

  /** A single list: public for everyone, private ones only for their owner. */
  app.get('/api/lists/:id', async (request, reply) => {
    const { id } = listIdParam.parse(request.params);
    const [row] = await db
      .select({ list: userList, ownerName: user.name })
      .from(userList)
      .innerJoin(user, eq(user.id, userList.userId))
      .where(eq(userList.id, id));
    if (!row) return notFound(reply);

    const viewer = await getSessionUser(request);
    const isOwner = viewer?.id === row.list.userId;
    if (!row.list.isPublic && !isOwner) return notFound(reply);

    reply.header('Cache-Control', row.list.isPublic ? 'public, max-age=60' : 'private, no-store');
    return {
      id: row.list.id,
      title: row.list.title,
      description: row.list.description,
      isPublic: row.list.isPublic,
      ownerName: row.ownerName,
      isOwner,
      updatedAt: row.list.updatedAt,
      items: await listItems(id),
    };
  });

  /** Recently updated public lists, for discovery and the sitemap. */
  app.get('/api/lists', async (request) => {
    const { limit } = z.object({ limit: z.coerce.number().int().min(1).max(100).default(20) }).parse(request.query);
    const rows = await db
      .select({
        id: userList.id,
        title: userList.title,
        ownerName: user.name,
        updatedAt: userList.updatedAt,
        itemCount: sql<number>`(select count(*)::int from ${userListItem} where ${userListItem.listId} = ${userList.id})`,
      })
      .from(userList)
      .innerJoin(user, eq(user.id, userList.userId))
      .where(eq(userList.isPublic, true))
      .orderBy(desc(userList.updatedAt))
      .limit(limit);
    return { lists: rows.filter((row) => row.itemCount > 0) };
  });

  /* Owner ------------------------------------------------------------- */

  app.register(async (me) => {
    me.addHook('preHandler', requireUser);

    me.get('/api/me/lists', async (request) => {
      const owner = currentUser(request);
      const { contains } = containsQuery.parse(request.query);
      const [containsType, containsId] = contains ? contains.split(':') : [];

      const rows = await db
        .select({
          id: userList.id,
          title: userList.title,
          description: userList.description,
          isPublic: userList.isPublic,
          updatedAt: userList.updatedAt,
          itemCount: count(userListItem.tmdbId),
          posters: sql<(string | null)[]>`(array_agg(${userListItem.posterPath} order by ${userListItem.addedAt} desc))[1:4]`,
          hasTitle: contains
            ? sql<boolean>`bool_or(${userListItem.mediaType} = ${containsType} and ${userListItem.tmdbId} = ${Number(containsId)})`
            : sql<boolean>`false`,
        })
        .from(userList)
        .leftJoin(userListItem, eq(userListItem.listId, userList.id))
        .where(eq(userList.userId, owner.id))
        .groupBy(userList.id)
        .orderBy(desc(userList.updatedAt));

      return {
        lists: rows.map((row) => ({
          ...row,
          hasTitle: Boolean(row.hasTitle),
          posters: (row.posters ?? []).filter((poster): poster is string => Boolean(poster)),
        })),
      };
    });

    me.post('/api/me/lists', async (request, reply) => {
      const owner = currentUser(request);
      const body = listBody.parse(request.body);

      const [{ total }] = await db.select({ total: count() }).from(userList).where(eq(userList.userId, owner.id));
      if (total >= MAX_LISTS_PER_USER) return reply.status(409).send({ error: 'too_many_lists' });

      const [list] = await db
        .insert(userList)
        .values({ id: newListId(), userId: owner.id, ...body })
        .returning();
      return reply.status(201).send({ list });
    });

    me.put('/api/me/lists/:id', async (request, reply) => {
      const owner = currentUser(request);
      const { id } = listIdParam.parse(request.params);
      const body = listBody.partial().parse(request.body);
      const [list] = await db
        .update(userList)
        .set({ ...body, updatedAt: new Date() })
        .where(and(eq(userList.id, id), eq(userList.userId, owner.id)))
        .returning();
      return list ? { list } : notFound(reply);
    });

    me.delete('/api/me/lists/:id', async (request, reply) => {
      const owner = currentUser(request);
      const { id } = listIdParam.parse(request.params);
      const deleted = await db
        .delete(userList)
        .where(and(eq(userList.id, id), eq(userList.userId, owner.id)))
        .returning({ id: userList.id });
      return deleted.length ? { ok: true } : notFound(reply);
    });

    me.put('/api/me/lists/:id/items/:type/:tmdbId', async (request, reply) => {
      const owner = currentUser(request);
      const { id, type, tmdbId } = itemParams.parse(request.params);
      const body = itemBody.parse(request.body);
      if (!(await ownedList(id, owner.id))) return notFound(reply);

      const [{ total }] = await db.select({ total: count() }).from(userListItem).where(eq(userListItem.listId, id));
      if (total >= MAX_ITEMS_PER_LIST) return reply.status(409).send({ error: 'list_full' });

      await db
        .insert(userListItem)
        .values({ listId: id, mediaType: type, tmdbId, title: body.title, posterPath: body.posterPath ?? null, releaseDate: body.releaseDate ?? null })
        .onConflictDoNothing();
      await db.update(userList).set({ updatedAt: new Date() }).where(eq(userList.id, id));
      return { ok: true };
    });

    me.delete('/api/me/lists/:id/items/:type/:tmdbId', async (request, reply) => {
      const owner = currentUser(request);
      const { id, type, tmdbId } = itemParams.parse(request.params);
      if (!(await ownedList(id, owner.id))) return notFound(reply);

      await db
        .delete(userListItem)
        .where(and(eq(userListItem.listId, id), eq(userListItem.mediaType, type), eq(userListItem.tmdbId, tmdbId)));
      await db.update(userList).set({ updatedAt: new Date() }).where(eq(userList.id, id));
      return { ok: true };
    });
  });
}
