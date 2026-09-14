import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { startFakeTmdb, type FakeTmdb } from './fake-tmdb.js';

export const WEB_URL = 'http://localhost:3000';

/**
 * Boots the API against the test database and a fake TMDB. Environment is set
 * before the app modules load, because they validate it at import time.
 */
export async function startTestApi() {
  const tmdb: FakeTmdb = await startFakeTmdb();

  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ?? 'postgres://watchguru:watchguru@localhost:5432/watchguru_test';
  process.env.WEB_URL = WEB_URL;
  process.env.BETTER_AUTH_SECRET = 'test-secret-that-is-long-enough-for-better-auth';
  process.env.TMDB_API_KEY = 'test';
  process.env.TMDB_BASE_URL = tmdb.url;

  const [{ buildApp }, { db }, { migrate }, { sql }] = await Promise.all([
    import('../src/app.js'),
    import('../src/db/index.js'),
    import('drizzle-orm/node-postgres/migrator'),
    import('drizzle-orm'),
  ]);

  await migrate(db, { migrationsFolder: fileURLToPath(new URL('../drizzle', import.meta.url)) });
  await db.execute(
    sql`TRUNCATE "user", session, account, verification, library_entry, episode_progress, taste_profile, match_room, match_participant, match_vote, user_list, user_list_item, availability_snapshot, notification CASCADE`,
  );

  const app = await buildApp({ logger: false });
  await app.listen({ port: 0, host: '127.0.0.1' });
  const { port } = app.server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    app,
    tmdb,
    baseUrl,
    wsUrl: `${baseUrl.replace('http', 'ws')}/api/match/ws`,
    close: async () => {
      await app.close();
      await tmdb.close();
    },
  };
}

export type TestApi = Awaited<ReturnType<typeof startTestApi>>;

/** Minimal cookie-keeping HTTP client, like a browser talking to the API. */
export function createClient(baseUrl: string) {
  const cookies = new Map<string, string>();

  async function request(method: string, path: string, body?: unknown) {
    const response = await fetch(baseUrl + path, {
      method,
      headers: {
        origin: WEB_URL,
        ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
        ...(cookies.size ? { cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join('; ') } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    for (const header of response.headers.getSetCookie()) {
      const [pair] = header.split(';');
      const [name, ...value] = pair.split('=');
      const joined = value.join('=');
      if (joined) cookies.set(name, joined);
      else cookies.delete(name);
    }
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }

  return {
    get: (path: string) => request('GET', path),
    post: (path: string, body?: unknown) => request('POST', path, body ?? {}),
    put: (path: string, body: unknown) => request('PUT', path, body),
    delete: (path: string) => request('DELETE', path),
    cookies,
  };
}
