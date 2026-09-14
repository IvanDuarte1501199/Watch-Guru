'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, type LibraryEntry, type LibraryStatus, type TitleInfo, type TitleStats } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { useLibraryIndex } from './LibraryIndexProvider';

const episodeKey = (season: number, episode: number) => `${season}:${episode}`;

interface TitleLibraryValue {
  info: TitleInfo;
  signedIn: boolean;
  ready: boolean;
  entry: LibraryEntry | null;
  stats: TitleStats | null;
  watchedEpisodes: Set<string>;
  setStatus: (status: LibraryStatus | null) => Promise<void>;
  setRating: (rating: number | null) => Promise<void>;
  setEpisodesWatched: (season: number, episodes: number[], watched: boolean) => Promise<void>;
  isEpisodeWatched: (season: number, episode: number) => boolean;
}

const TitleLibraryContext = createContext<TitleLibraryValue | null>(null);

/**
 * Per-title user state (list status, Guru rating, watched episodes) shared by
 * the actions bar and the seasons list. Detail pages are statically cached,
 * so everything user-specific loads here in the browser.
 */
export function TitleLibraryProvider({ info, children }: { info: TitleInfo; children: React.ReactNode }) {
  const { lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const index = useLibraryIndex();
  const signedIn = Boolean(session);

  const [entry, setEntry] = useState<LibraryEntry | null>(null);
  const [stats, setStats] = useState<TitleStats | null>(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<string>>(new Set());
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const { mediaType, tmdbId } = info;
  const userId = session?.user.id ?? null;

  useEffect(() => {
    api.titleStats(mediaType, tmdbId).then(setStats).catch(() => setStats(null));
  }, [mediaType, tmdbId]);

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;
    const loadKey = `${userId}:${mediaType}:${tmdbId}`;

    Promise.all([
      userId ? api.getEntry(mediaType, tmdbId) : Promise.resolve(null),
      userId && mediaType === 'tv' ? api.episodes(tmdbId) : Promise.resolve([]),
    ])
      .then(([loadedEntry, episodes]) => {
        if (cancelled) return;
        setEntry(loadedEntry);
        setWatchedEpisodes(new Set(episodes.map((episode) => episodeKey(episode.seasonNumber, episode.episodeNumber))));
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoadedFor(loadKey));

    return () => {
      cancelled = true;
    };
  }, [isPending, userId, mediaType, tmdbId]);

  const requireSignIn = useCallback(() => {
    if (signedIn) return true;
    router.push(routes.login(lang, pathname));
    return false;
  }, [signedIn, router, lang, pathname]);

  const update = useCallback(
    async (changes: { status?: LibraryStatus | null; rating?: number | null }) => {
      if (!requireSignIn()) return;
      const previous = entry;
      // Optimistic update so the buttons react instantly.
      setEntry((current) => ({
        ...(current ?? { ...info, status: null, rating: null, watchedAt: null, updatedAt: new Date().toISOString() }),
        ...changes,
      }));
      try {
        const saved = await api.updateEntry(info, changes);
        setEntry(saved);
        index?.replace(mediaType, tmdbId, saved);
        if (changes.rating !== undefined) api.titleStats(mediaType, tmdbId, true).then(setStats).catch(() => undefined);
      } catch {
        setEntry(previous);
      }
    },
    [entry, info, requireSignIn, mediaType, tmdbId, index],
  );

  const setEpisodesWatched = useCallback(
    async (season: number, episodes: number[], watched: boolean) => {
      if (!requireSignIn() || episodes.length === 0) return;
      const previous = watchedEpisodes;
      setWatchedEpisodes((current) => {
        const next = new Set(current);
        for (const episode of episodes) {
          if (watched) next.add(episodeKey(season, episode));
          else next.delete(episodeKey(season, episode));
        }
        return next;
      });
      try {
        await api.setEpisodes(tmdbId, season, episodes, watched);
        // Starting a show you hadn't listed moves it to "Watching".
        if (watched && !entry?.status) await update({ status: 'watching' });
      } catch {
        setWatchedEpisodes(previous);
      }
    },
    [requireSignIn, watchedEpisodes, tmdbId, entry, update],
  );

  const value = useMemo<TitleLibraryValue>(
    () => ({
      info,
      signedIn,
      ready: !isPending && loadedFor === `${userId}:${mediaType}:${tmdbId}`,
      entry,
      stats,
      watchedEpisodes,
      setStatus: (status) => update({ status }),
      setRating: (rating) => update({ rating }),
      setEpisodesWatched,
      isEpisodeWatched: (season, episode) => watchedEpisodes.has(episodeKey(season, episode)),
    }),
    [info, signedIn, isPending, loadedFor, userId, mediaType, tmdbId, entry, stats, watchedEpisodes, update, setEpisodesWatched],
  );

  return <TitleLibraryContext.Provider value={value}>{children}</TitleLibraryContext.Provider>;
}

export function useTitleLibrary(): TitleLibraryValue | null {
  return useContext(TitleLibraryContext);
}
