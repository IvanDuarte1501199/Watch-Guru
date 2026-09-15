import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { marathons } from '@/lib/marathons/data';
import { loadMarathonCards } from '@/lib/marathons/load';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { MarathonCardLink } from '@/components/marathons/MarathonCardLink';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[lang]/marathons'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({ lang, path: '/marathons', title: t.marathonsTitle, description: t.marathonsDescription });
}

export default async function MarathonsPage({ params }: PageProps<'/[lang]/marathons'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, cards] = await Promise.all([getDictionary(lang), loadMarathonCards(marathons, lang)]);

  return (
    <div className="pb-16">
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: routes.home(lang) },
          { name: t.marathons, href: routes.marathons(lang) },
        ]}
      />
      <header className="max-w-3xl pt-6 pb-10">
        <h1 className="text-4xl leading-none font-black tracking-tight text-white md:text-6xl">{t.marathonsTitle}</h1>
        <p className="p-guru mt-4">{t.marathonsDescription}</p>
      </header>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <li key={card.slug}>
            <MarathonCardLink card={card} lang={lang} t={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}
