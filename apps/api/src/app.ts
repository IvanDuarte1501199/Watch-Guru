import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import Fastify, { type FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { pool } from './db/index.js';
import { env } from './env.js';
import { authRoutes } from './routes/auth.js';
import { deleteExpiredRooms } from './match/service.js';
import { libraryRoutes } from './routes/library.js';
import { matchRoutes } from './routes/match.js';
import { tasteRoutes } from './routes/taste.js';

const HOUR_MS = 60 * 60 * 1000;

export async function buildApp({ logger = true }: { logger?: boolean } = {}) {
  const app = Fastify({
    logger,
    trustProxy: true,
  });

  // Some clients (e.g. sign-out) POST an empty body with a JSON content type.
  app.removeContentTypeParser('application/json');
  app.addContentTypeParser('application/json', { parseAs: 'string' }, (_request, body, done) => {
    if (!body) return done(null, undefined);
    try {
      done(null, JSON.parse(body as string));
    } catch (error) {
      (error as FastifyError).statusCode = 400;
      done(error as FastifyError);
    }
  });

  await app.register(cors, {
    origin: env.WEB_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Must be registered before any route so WebSocket upgrades are intercepted.
  await app.register(websocket, { options: { maxPayload: 16 * 1024 } });
  await app.register(rateLimit, { global: false });

  app.decorateRequest('user', null);

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: 'invalid_request', issues: error.issues });
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    request.log.error(error);
    return reply.status(500).send({ error: 'internal_error' });
  });

  app.get('/api/health', async () => {
    await pool.query('select 1');
    return { ok: true };
  });

  await app.register(authRoutes);
  await app.register(libraryRoutes);
  await app.register(tasteRoutes);
  await app.register(matchRoutes);

  const cleanup = setInterval(() => {
    deleteExpiredRooms().catch((error) => app.log.error(error, 'Failed to delete expired match rooms'));
  }, HOUR_MS);
  cleanup.unref();

  app.addHook('onClose', async () => {
    clearInterval(cleanup);
    await pool.end();
  });

  return app;
}
