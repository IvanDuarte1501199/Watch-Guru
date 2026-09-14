'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';

export function RandomBanner() {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 backdrop-blur-md sm:flex-row">
      <p className="flex items-center gap-2 font-semibold text-secondary">
        <Sparkles className="h-4 w-4" aria-hidden />
        {t.guruPicked}
      </p>
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
