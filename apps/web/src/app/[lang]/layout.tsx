import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { notFound } from 'next/navigation';
import { preconnect } from 'react-dom';
import { hasLocale, locales } from '@/lib/i18n/config';
import { DictionaryProvider } from '@/lib/i18n/DictionaryProvider';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/seo';
import { ADSENSE_CLIENT, SITE_NAME, SITE_URL } from '@/lib/site';
import { AdsConsent } from '@/components/ads/AdsConsent';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LibraryIndexProvider } from '@/components/library/LibraryIndexProvider';
import '../globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: '#08042c',
};

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.siteTitle, template: `%s | ${SITE_NAME}` },
    applicationName: SITE_NAME,
    icons: { icon: '/logo.svg' },
    ...pageMetadata({ lang, path: '', description: t.siteDescription }),
  };
}

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  // Posters and backdrops come from TMDB's CDN; open that connection early.
  preconnect('https://image.tmdb.org', { crossOrigin: 'anonymous' });

  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} className={outfit.variable}>
      <body className="flex min-h-screen flex-col">
        <DictionaryProvider lang={lang} dictionary={dictionary}>
          <LibraryIndexProvider>
          <Header />
          <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pt-20 md:px-8 lg:px-12">
            {children}
          </main>
          <Footer lang={lang} t={dictionary} />
          {ADSENSE_CLIENT && <AdsConsent client={ADSENSE_CLIENT} />}
          </LibraryIndexProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
