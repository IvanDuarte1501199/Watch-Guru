import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { auth, type AuthUser } from '../auth.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: AuthUser | null;
  }
}

export async function getSessionUser(request: FastifyRequest): Promise<AuthUser | null> {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });
  return session?.user ?? null;
}

/** preHandler for routes that need a signed-in user. */
export async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  request.user = await getSessionUser(request);
  if (!request.user) {
    return reply.status(401).send({ error: 'unauthorized' });
  }
}

/** Only call from handlers guarded by `requireUser`. */
export function currentUser(request: FastifyRequest): AuthUser {
  if (!request.user) throw new Error('currentUser() used on a route without requireUser');
  return request.user;
}
