'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

export function RandomBanner({ personalized = false }: { personalized?: boolean }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const { data: session } = useSession();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 backdrop-blur-md sm:flex-row">
      <div className="text-center sm:text-left">
        <p className="flex items-center justify-center gap-2 font-semibold text-secondary sm:justify-start">
          <Sparkles className="h-4 w-4" aria-hidden />
          {personalized ? t.forYouPicked : t.guruPicked}
        </p>
        {session && (
          <Link href={routes.taste(lang)} className="text-xs text-slate-300 hover:text-secondary hover:underline">
            {personalized ? t.editTaste : t.personalizeCta}
          </Link>
        )}
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => router.refresh())}
        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-secondary/90 disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${pending ? 'animate-spin' : ''}`} aria-hidden />
        {t.anotherRecommendation}
      </button>
    </div>
  );
}
