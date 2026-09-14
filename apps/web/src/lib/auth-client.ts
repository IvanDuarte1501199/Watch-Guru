'use client';

import { useSyncExternalStore } from 'react';
import { createAuthClient } from 'better-auth/react';

/** Talks to the backend through the web app's `/api/auth` rewrite. */
export const authClient = createAuthClient();

const noopSubscribe = () => () => {};

/**
 * Session hook that reports "pending" until hydration finishes. The session request can
 * resolve before React hydrates, and rendering it right away wouldn't match the server HTML.
 */
export function useSession(): ReturnType<typeof authClient.useSession> {
  const session = authClient.useSession();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return hydrated ? session : { ...session, data: null, isPending: true };
}
