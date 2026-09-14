import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

/*
 * Deterministic stand-in for the TMDB API so tests run offline and without a key.
 * Discover pages return 20 titles whose ids encode kind and page, and whose
 * genres echo the first requested genre.
 */

const GENRES = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 878, name: 'Science Fiction' },
    { id: 27, name: 'Horror' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
  ],
};

export const PAGE_SIZE = 20;
export const TOTAL_PAGES = 10;

export interface FakeTmdb {
  url: string;
  requests: URL[];
  close: () => Promise<void>;
}

export async function startFakeTmdb(): Promise<FakeTmdb> {
  const requests: URL[] = [];

  const server: Server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://fake');
    requests.push(url);
    const send = (status: number, body: unknown) => {
      response.writeHead(status, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    };

    const genreMatch = /^\/genre\/(movie|tv)\/list$/.exec(url.pathname);
    if (genreMatch) return send(200, { genres: GENRES[genreMatch[1] as 'movie' | 'tv'] });

    const discoverMatch = /^\/discover\/(movie|tv)$/.exec(url.pathname);
    if (discoverMatch) {
      const kind = discoverMatch[1] as 'movie' | 'tv';
      const page = Number(url.searchParams.get('page') ?? 1);
      const firstGenre = Number((url.searchParams.get('with_genres') ?? '').split(/[|,]/)[0]) || GENRES[kind][0].id;
      const base = (kind === 'movie' ? 100_000 : 200_000) + (page - 1) * PAGE_SIZE;
      const results =
        page > TOTAL_PAGES
          ? []
          : Array.from({ length: PAGE_SIZE }, (_, i) => ({
              id: base + i,
              [kind === 'movie' ? 'title' : 'name']: `${kind} ${base + i}`,
              poster_path: `/poster-${base + i}.jpg`,
              backdrop_path: null,
              overview: 'A test title',
              [kind === 'movie' ? 'release_date' : 'first_air_date']: '2024-01-01',
              vote_average: 7.5,
              genre_ids: [firstGenre],
            }));
      return send(200, { page, results, total_pages: TOTAL_PAGES, total_results: TOTAL_PAGES * PAGE_SIZE });
    }

    send(404, { status_message: 'Not found' });
  });

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}
