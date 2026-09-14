import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import { auth } from '../auth.js';
import { googleAuthEnabled } from '../env.js';

export async function authRoutes(app: FastifyInstance) {
  // Better Auth speaks Web Request/Response; bridge Fastify's request to it.
  app.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const response = await auth.handler(
        new Request(url, {
          method: request.method,
          headers: fromNodeHeaders(request.headers),
          body: request.method === 'POST' && request.body !== undefined ? JSON.stringify(request.body) : undefined,
        }),
      );

      reply.status(response.status);
      response.headers.forEach((value, key) => {
        if (key !== 'set-cookie') reply.header(key, value);
      });
      const cookies = response.headers.getSetCookie();
      if (cookies.length > 0) reply.header('set-cookie', cookies);
      return reply.send(response.body ? await response.text() : null);
    },
  });

  /** Lets the web app know which sign-in methods to show. */
  app.get('/api/auth-config', async () => ({ emailPassword: true, google: googleAuthEnabled }));
}
