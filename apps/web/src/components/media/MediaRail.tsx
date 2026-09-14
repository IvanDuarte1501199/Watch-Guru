import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { MediaSummary } from '@/lib/tmdb/types';
import { Carousel } from '@/components/ui/Carousel';
import { MediaCard } from './MediaCard';

interface MediaRailProps {
  title: string;
  items: MediaSummary[];
  lang: Locale;
  href?: string;
  viewMoreLabel?: string;
}

export function MediaRail({ title, items, lang, href, viewMoreLabel }: MediaRailProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10 md:mb-16">
      <header className="flex items-center justify-between gap-4 pb-4">
        <h2 className="h2-guru">{title}</h2>
        {href && viewMoreLabel && (
          <Link
            href={href}
            className="shrink-0 text-xs font-semibold text-secondary/90 transition-colors duration-200 hover:text-secondary md:text-sm"
          >
            {viewMoreLabel} &rarr;
          </Link>
        )}
      </header>
      <Carousel label={title} itemClassName="w-[42%] sm:w-[30%] md:w-[23%] xl:w-[18.5%]">
        {items.map((item) => (
          <MediaCard key={`${item.media_type}-${item.id}`} item={item} lang={lang} />
        ))}
      </Carousel>
    </section>
  );
}
