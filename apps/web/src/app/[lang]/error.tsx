'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang, t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-7xl font-black text-secondary">500</p>
      <h1 className="h2-guru">{t.somethingWentWrong}</h1>
      <p className="p-guru max-w-md">{t.somethingWentWrongBody}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950 transition hover:bg-secondary/90"
        >
          {t.tryAgain}
        </button>
        <Link href={routes.home(lang)} className="rounded-lg border border-slate-700 px-5 py-2 font-bold text-white hover:border-secondary">
          {t.goHome}
        </Link>
      </div>
    </div>
  );
}
