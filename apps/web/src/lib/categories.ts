import type { Dictionary } from './i18n/get-dictionary';
import type { MediaKind } from './tmdb/types';

type DictionaryKey = keyof Dictionary;

const categoryTitles: Record<MediaKind, Record<string, DictionaryKey>> = {
  movie: {
    trending: 'trendingMovies',
    'now-playing': 'nowPlayingMovies',
    popular: 'popularMovies',
    'top-rated': 'topRatedMovies',
    upcoming: 'upcomingMovies',
  },
  tv: {
    trending: 'trendingTvShows',
    'airing-today': 'airingTodayTvShows',
    'on-the-air': 'onTheAirTvShows',
    popular: 'popularTvShows',
    'top-rated': 'topRatedTvShows',
  },
};

export function categoryTitle(kind: MediaKind, category: string, t: Dictionary): string {
  const key = categoryTitles[kind][category];
  return key ? t[key] : category;
}
