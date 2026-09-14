import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guideHeading, guideProviders, listGuides, type Guide } from '@/lib/guides';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps<'/[lang]/guides'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({ lang, path: '/guides', title: t.guidesTitle, description: t.guidesDescription });
}

export default async function GuidesPage({ params }: PageProps<'/[lang]/guides'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [t, guides] = await Promise.all([getDictionary(lang), listGuides(lang)]);

  const linkList = (items: Guide[]) => (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((guide) => (
        <li key={guide.slug}>
          <Link href={routes.guide(lang, guide.slug)} className="text-slate-300 transition hover:text-secondary">
            {guideHeading(guide, lang, t)}
          </Link>
        </li>
      ))}
    </ul>
  );

  const sectionClass = 'mb-10 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 md:p-6';

  return (
    <div className="mx-auto max-w-5xl pb-12">
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: routes.home(lang) },
          { name: t.guides, href: routes.guides(lang) },
        ]}
      />
      <header className="pt-6 pb-8">
        <h1 className="h1-guru">{t.guidesTitle}</h1>
        <p className="p-guru mt-4">{t.guidesDescription}</p>
      </header>

      <section className={sectionClass}>
        <h2 className="h2-guru mb-4">{t.guidesMoviesByGenre}</h2>
        {linkList(guides.filter((guide) => guide.kind === 'movie' && guide.genre && !guide.provider))}
      </section>

      <section className={sectionClass}>
        <h2 className="h2-guru mb-4">{t.guidesTvByGenre}</h2>
        {linkList(guides.filter((guide) => guide.kind === 'tv' && guide.genre && !guide.provider))}
      </section>

      {guideProviders.map((provider) => (
        <section key={provider.slug} className={sectionClass}>
          <h2 className="h2-guru mb-4">
            {t.guidesByPlatform}: {provider.name}
          </h2>
          {linkList(guides.filter((guide) => guide.provider?.id === provider.id))}
        </section>
      ))}
    </div>
  );
}
