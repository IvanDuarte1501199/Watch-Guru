import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { currentLocale } from '@/lib/i18n/server';
import { routes } from '@/lib/routes';

export default async function NotFound() {
  const lang = await currentLocale();
  const t = await getDictionary(lang);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-7xl font-black text-secondary">404</p>
      <h1 className="h2-guru">{t.pageNotFound}</h1>
      <p className="p-guru max-w-md">{t.pageNotFoundBody}</p>
      <Link
        href={routes.home(lang)}
        className="mt-4 rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950 transition hover:bg-secondary/90"
      >
        {t.goHome}
      </Link>
    </div>
  );
}
