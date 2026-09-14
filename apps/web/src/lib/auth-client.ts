'use client';

import { createAuthClient } from 'better-auth/react';

/** Talks to the backend through the web app's `/api/auth` rewrite. */
export const authClient = createAuthClient();

export const useSession = authClient.useSession;
