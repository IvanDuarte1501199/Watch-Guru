import Link from 'next/link';
import { guideHeading, listGuides } from '@/lib/guides';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';

/** Hand-picked mix of guides linked from the home page, so crawlers reach them in one hop. */
const featured: { kind: 'movie' | 'tv'; genre?: number; provider?: string }[] = [
  { kind: 'movie', genre: 27, provider: 'netflix' },
  { kind: 'tv', provider: 'netflix' },
  { kind: 'movie', provider: 'disney-plus' },
  { kind: 'tv', genre: 18, provider: 'max' },
  { kind: 'movie', genre: 878 },
  { kind: 'movie', genre: 35, provider: 'prime-video' },
  { kind: 'tv', genre: 80 },
  { kind: 'tv', genre: 16, provider: 'netflix' },
];

export async function PopularGuides({ lang, t }: { lang: Locale; t: Dictionary }) {
  const guides = await listGuides(lang);
  const picks = featured
    .map((spec) =>
      guides.find(
        (guide) =>
          guide.kind === spec.kind &&
          (guide.genre?.id ?? undefined) === spec.genre &&
          (guide.provider?.slug ?? undefined) === spec.provider,
      ),
    )
    .filter((guide) => guide !== undefined);

  if (picks.length === 0) return null;

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="h2-guru">{t.guides}</h2>
        <Link href={routes.guides(lang)} className="text-xs font-semibold text-secondary/90 hover:text-secondary md:text-sm">
          {t.viewAll} &rarr;
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={routes.guide(lang, guide.slug)}
              className="flex h-full items-center rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-secondary hover:text-white"
            >
              {guideHeading(guide, lang, t)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
