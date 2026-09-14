import type { MediaKind } from './tmdb/types';

/* Browser client for the WatchGuru backend (proxied through next.config rewrites). */

export type LibraryStatus = 'watchlist' | 'watching' | 'watched';

export interface LibraryEntry {
  mediaType: MediaKind;
  tmdbId: number;
  status: LibraryStatus | null;
  rating: number | null;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  genreIds: number[];
  watchedAt: string | null;
  updatedAt: string;
}

export interface TitleInfo {
  mediaType: MediaKind;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  genreIds: number[];
}

export interface TitleStats {
  average: number | null;
  count: number;
}

export interface LibrarySummary {
  watchlist: number;
  watching: number;
  watched: number;
  rated: number;
}

export interface Taste {
  likedGenres: number[];
  dislikedGenres: number[];
  providers: number[];
  region: string | null;
}

export interface WatchedEpisode {
  seasonNumber: number;
  episodeNumber: number;
}

export interface UserListSummary {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  updatedAt: string;
  itemCount: number;
  posters: string[];
  hasTitle: boolean;
}

export interface ListItem {
  mediaType: MediaKind;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  addedAt: string;
}

export interface UserListDetail {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  ownerName: string;
  isOwner: boolean;
  updatedAt: string;
  items: ListItem[];
}

export interface AppNotification {
  id: number;
  type: 'available';
  mediaType: MediaKind;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  data: { region: string; providers: { id: number; name: string; logoPath: string | null }[] };
  readAt: string | null;
  createdAt: string;
}

export class ApiError extends Error {
  constructor(readonly status: number) {
    super(`Request failed with status ${status}`);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: init.body ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  });
  if (!response.ok) throw new ApiError(response.status);
  return (await response.json()) as T;
}

const put = <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) });

export const api = {
  /** Pass `fresh` right after rating, otherwise the browser may reuse its cached copy. */
  titleStats: (kind: MediaKind, id: number, fresh = false) =>
    request<TitleStats>(`/api/titles/${kind}/${id}/stats`, fresh ? { cache: 'no-store' } : {}),

  getEntry: (kind: MediaKind, id: number) =>
    request<{ entry: LibraryEntry | null }>(`/api/me/library/${kind}/${id}`).then((data) => data.entry),

  updateEntry: (
    info: TitleInfo,
    changes: { status?: LibraryStatus | null; rating?: number | null },
  ) =>
    put<{ entry: LibraryEntry | null }>(`/api/me/library/${info.mediaType}/${info.tmdbId}`, {
      title: info.title,
      posterPath: info.posterPath,
      releaseDate: info.releaseDate,
      genreIds: info.genreIds,
      ...changes,
    }).then((data) => data.entry),

  library: (status?: LibraryStatus | 'rated') =>
    request<{ items: LibraryEntry[] }>(`/api/me/library${status ? `?status=${status}` : ''}`, {
      cache: 'no-store',
    }).then((data) => data.items),

  librarySummary: () => request<LibrarySummary>('/api/me/library/summary'),

  episodes: (tvId: number) =>
    request<{ episodes: WatchedEpisode[] }>(`/api/me/episodes/${tvId}`).then((data) => data.episodes),

  setEpisodes: (tvId: number, seasonNumber: number, episodes: number[], watched: boolean) =>
    put<{ ok: true }>(`/api/me/episodes/${tvId}`, { seasonNumber, episodes, watched }),

  taste: () => request<{ taste: Taste | null }>('/api/me/taste').then((data) => data.taste),

  saveTaste: (taste: Taste) => put<{ taste: Taste }>('/api/me/taste', taste),

  lists: (contains?: TitleInfo) =>
    request<{ lists: UserListSummary[] }>(
      `/api/me/lists${contains ? `?contains=${contains.mediaType}:${contains.tmdbId}` : ''}`,
    ).then((data) => data.lists),

  createList: (input: { title: string; description?: string; isPublic?: boolean }) =>
    request<{ list: UserListSummary }>('/api/me/lists', { method: 'POST', body: JSON.stringify(input) }).then(
      (data) => data.list,
    ),

  updateList: (id: string, changes: { title?: string; description?: string; isPublic?: boolean }) =>
    put<{ list: UserListSummary }>(`/api/me/lists/${id}`, changes),

  deleteList: (id: string) => request<{ ok: true }>(`/api/me/lists/${id}`, { method: 'DELETE' }),

  addToList: (id: string, info: TitleInfo) =>
    put<{ ok: true }>(`/api/me/lists/${id}/items/${info.mediaType}/${info.tmdbId}`, {
      title: info.title,
      posterPath: info.posterPath,
      releaseDate: info.releaseDate,
    }),

  removeFromList: (id: string, kind: MediaKind, tmdbId: number) =>
    request<{ ok: true }>(`/api/me/lists/${id}/items/${kind}/${tmdbId}`, { method: 'DELETE' }),

  notifications: () => request<{ items: AppNotification[]; unread: number }>('/api/me/notifications', { cache: 'no-store' }),

  markNotificationsRead: () =>
    request<{ ok: true }>('/api/me/notifications/read', { method: 'POST', body: JSON.stringify({}) }),

  authConfig: () => request<{ emailPassword: boolean; google: boolean }>('/api/auth-config'),
};

/** Only allow same-site relative paths as post-login destinations. */
export function safeNextPath(value: string | null | undefined, fallback: string): string {
  return value && /^\/(?![/\\])/.test(value) && !value.includes('\\') ? value : fallback;
}
