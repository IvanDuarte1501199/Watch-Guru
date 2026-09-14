import type { Locale } from '@/lib/i18n/config';
import type { MediaSummary } from '@/lib/tmdb/types';
import { MediaCard } from './MediaCard';

export function MediaGrid({ items, lang }: { items: MediaSummary[]; lang: Locale }) {
  if (items.length === 0) return null;

  return (
    <ul className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:mb-12 xl:grid-cols-5">
      {items.map((item) => (
        <li key={`${item.media_type}-${item.id}`} className="animate-fade-in-up">
          <MediaCard item={item} lang={lang} />
        </li>
      ))}
    </ul>
  );
}
