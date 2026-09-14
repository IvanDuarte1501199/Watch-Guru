import { and, count, desc, eq, isNull } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index.js';
import { notification } from '../db/schema.js';
import { markNotificationsRead } from '../lib/availability.js';
import { currentUser, requireUser } from '../lib/session.js';

export async function notificationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireUser);

  app.get('/api/me/notifications', async (request) => {
    const owner = currentUser(request);
    const [items, [{ unread }]] = await Promise.all([
      db
        .select({
          id: notification.id,
          type: notification.type,
          mediaType: notification.mediaType,
          tmdbId: notification.tmdbId,
          title: notification.title,
          posterPath: notification.posterPath,
          data: notification.data,
          readAt: notification.readAt,
          createdAt: notification.createdAt,
        })
        .from(notification)
        .where(eq(notification.userId, owner.id))
        .orderBy(desc(notification.createdAt))
        .limit(30),
      db
        .select({ unread: count() })
        .from(notification)
        .where(and(eq(notification.userId, owner.id), isNull(notification.readAt))),
    ]);
    return { items, unread };
  });

  app.post('/api/me/notifications/read', async (request) => {
    const owner = currentUser(request);
    const { ids } = z.object({ ids: z.array(z.number().int().positive()).max(100).optional() }).parse(request.body ?? {});
    await markNotificationsRead(owner.id, ids);
    return { ok: true };
  });
}
