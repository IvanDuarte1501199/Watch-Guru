'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, type LibraryEntry, type LibraryStatus, type TitleInfo } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import type { MediaKind } from '@/lib/tmdb/types';

export const libraryKey = (kind: MediaKind, id: number) => `${kind}:${id}`;

type Changes = { status?: LibraryStatus | null; rating?: number | null };

interface LibraryIndexValue {
  signedIn: boolean;
  loaded: boolean;
  entries: Map<string, LibraryEntry>;
  get: (kind: MediaKind, id: number) => LibraryEntry | null;
  /** Optimistically applies changes and saves them; resolves to the saved entry (null when removed). */
  update: (info: TitleInfo, changes: Changes) => Promise<LibraryEntry | null>;
  /** Keeps the index in sync with changes saved elsewhere (e.g. the detail page). */
  replace: (kind: MediaKind, id: number, entry: LibraryEntry | null) => void;
  refresh: () => Promise<void>;
}

const LibraryIndexContext = createContext<LibraryIndexValue | null>(null);

/**
 * The signed-in user's whole library (list statuses and ratings), loaded once
 * and shared by every poster's quick action and the My list page.
 */
export function LibraryIndexProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user.id ?? null;
  const [entries, setEntries] = useState<Map<string, LibraryEntry>>(new Map());
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const items = await api.library();
      setEntries(new Map(items.map((entry) => [libraryKey(entry.mediaType, entry.tmdbId), entry])));
      setLoadedFor(userId);
    } catch {
      // Keep whatever we had; quick actions still work and will retry on the next refresh.
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state updates happen after the async fetch resolves
    void refresh();
  }, [userId, refresh]);

  const replace = useCallback((kind: MediaKind, id: number, entry: LibraryEntry | null) => {
    setEntries((current) => {
      const next = new Map(current);
      if (entry) next.set(libraryKey(kind, id), entry);
      else next.delete(libraryKey(kind, id));
      return next;
    });
  }, []);

  const update = useCallback(
    async (info: TitleInfo, changes: Changes) => {
      const key = libraryKey(info.mediaType, info.tmdbId);
      const previous = entries.get(key) ?? null;
      const status = changes.status === undefined ? (previous?.status ?? null) : changes.status;
      const rating = changes.rating === undefined ? (previous?.rating ?? null) : changes.rating;

      replace(
        info.mediaType,
        info.tmdbId,
        status === null && rating === null
          ? null
          : {
              ...info,
              watchedAt: previous?.watchedAt ?? null,
              ...previous,
              status,
              rating,
              updatedAt: new Date().toISOString(),
            },
      );

      try {
        const saved = await api.updateEntry(info, changes);
        replace(info.mediaType, info.tmdbId, saved);
        return saved;
      } catch (error) {
        replace(info.mediaType, info.tmdbId, previous);
        throw error;
      }
    },
    [entries, replace],
  );

  const value = useMemo<LibraryIndexValue>(
    () => ({
      signedIn: Boolean(userId),
      loaded: Boolean(userId) && loadedFor === userId,
      entries: userId ? entries : new Map(),
      get: (kind, id) => (userId ? (entries.get(libraryKey(kind, id)) ?? null) : null),
      update,
      replace,
      refresh,
    }),
    [userId, loadedFor, entries, update, replace, refresh],
  );

  return <LibraryIndexContext.Provider value={value}>{children}</LibraryIndexContext.Provider>;
}

export function useLibraryIndex(): LibraryIndexValue | null {
  return useContext(LibraryIndexContext);
}
