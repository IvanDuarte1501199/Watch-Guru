import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, locales } from '@/lib/i18n/config';
import { DictionaryProvider } from '@/lib/i18n/DictionaryProvider';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
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
    title: { default: `${SITE_NAME} · ${t.dontKnowWhatToWatch}`, template: `%s | ${SITE_NAME}` },
    applicationName: SITE_NAME,
    icons: { icon: '/logo.svg' },
    ...pageMetadata({ lang, path: '', description: t.siteDescription }),
  };
}

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} className={outfit.variable}>
      <body className="flex min-h-screen flex-col">
        <DictionaryProvider lang={lang} dictionary={dictionary}>
          <Header />
          <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pt-20 md:px-8 lg:px-12">
            {children}
          </main>
          <Footer lang={lang} t={dictionary} />
        </DictionaryProvider>
      </body>
    </html>
  );
}
