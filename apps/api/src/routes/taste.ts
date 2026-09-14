import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index.js';
import { MEDIA_TYPES, tasteProfile } from '../db/schema.js';
import { pickForUser } from '../lib/recommendations.js';
import { currentUser, requireUser } from '../lib/session.js';

const genreList = z.array(z.number().int().positive()).max(40);

const tasteBody = z.object({
  likedGenres: genreList,
  dislikedGenres: genreList,
  providers: z.array(z.number().int().positive()).max(30),
  region: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .nullable(),
});

export async function tasteRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireUser);

  app.get('/api/me/taste', async (request) => {
    const user = currentUser(request);
    const [profile] = await db.select().from(tasteProfile).where(eq(tasteProfile.userId, user.id));
    return {
      taste: profile
        ? {
            likedGenres: profile.likedGenres,
            dislikedGenres: profile.dislikedGenres,
            providers: profile.providers,
            region: profile.region,
          }
        : null,
    };
  });

  app.put('/api/me/taste', async (request) => {
    const user = currentUser(request);
    const body = tasteBody.parse(request.body);
    const values = { ...body, dislikedGenres: body.dislikedGenres.filter((id) => !body.likedGenres.includes(id)) };

    await db
      .insert(tasteProfile)
      .values({ userId: user.id, ...values })
      .onConflictDoUpdate({ target: tasteProfile.userId, set: { ...values, updatedAt: new Date() } });
    return { taste: values };
  });

  app.get('/api/me/recommendations/random', async (request, reply) => {
    const user = currentUser(request);
    const { type } = z.object({ type: z.enum(MEDIA_TYPES) }).parse(request.query);
    const pick = await pickForUser(user.id, type);
    if (!pick) return reply.status(404).send({ error: 'no_recommendation' });
    return pick;
  });
}
