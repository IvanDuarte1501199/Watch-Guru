import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { LEGAL_UPDATED, legalContent } from '@/lib/legal';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { CONTACT_EMAIL } from '@/lib/site';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

type LegalKind = keyof typeof legalContent;

const copy = {
  privacy: { title: 'privacyTitle', description: 'privacyDescription', path: '/privacy', route: routes.privacy },
  terms: { title: 'termsTitle', description: 'termsDescription', path: '/terms', route: routes.terms },
} as const;

export async function legalMetadata(params: Promise<{ lang: string }>, kind: LegalKind): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({ lang, path: copy[kind].path, title: t[copy[kind].title], description: t[copy[kind].description] });
}

export async function LegalPage({ params, kind }: { params: Promise<{ lang: string }>; kind: LegalKind }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const title = t[copy[kind].title];

  return (
    <article className="mx-auto max-w-3xl pb-16">
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: routes.home(lang) },
          { name: title, href: copy[kind].route(lang) },
        ]}
      />
      <header className="pt-6 pb-8">
        <h1 className="h1-guru">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {format(t.legalUpdated, {
            date: new Date(`${LEGAL_UPDATED}T12:00:00Z`).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }),
          })}
        </p>
      </header>

      <div className="space-y-8">
        {legalContent[kind][lang].map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-xl font-bold text-white">{section.heading}</h2>
            <div className="space-y-3 text-slate-300">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
        <p className="border-t border-slate-800 pt-6 text-slate-400">
          {CONTACT_EMAIL ? (
            <>
              {t.legalContact.split('{email}')[0]}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-secondary hover:underline">
                {CONTACT_EMAIL}
              </a>
              {t.legalContact.split('{email}')[1]}
            </>
          ) : (
            t.legalContactNoEmail
          )}
        </p>
      </div>
    </article>
  );
}
