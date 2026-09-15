import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { marathons } from '@/lib/marathons/data';
import { loadMarathonCards } from '@/lib/marathons/load';
import { routes } from '@/lib/routes';
import { MarathonCardLink } from './MarathonCardLink';

/** Home rail of franchise marathons. */
export async function MarathonsShowcase({ lang, t }: { lang: Locale; t: Dictionary }) {
  const cards = await loadMarathonCards(marathons, lang);

  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="h2-guru">{t.marathons}</h2>
          <p className="mt-1 text-sm text-slate-400">{t.marathonsHomeSubtitle}</p>
        </div>
        <Link href={routes.marathons(lang)} className="shrink-0 text-xs font-semibold text-secondary/90 hover:text-secondary md:text-sm">
          {t.viewAll} &rarr;
        </Link>
      </div>
      <ul className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-4 md:mx-0 md:px-0">
        {cards.map((card) => (
          <li key={card.slug} className="w-[270px] shrink-0 snap-start sm:w-[290px]">
            <MarathonCardLink card={card} lang={lang} t={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}
