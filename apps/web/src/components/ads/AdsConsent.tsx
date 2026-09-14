'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { setAdConsent, useAdConsent } from '@/lib/ad-consent';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

type AdsQueue = unknown[] & { requestNonPersonalizedAds?: number };
declare global {
  interface Window {
    adsbygoogle?: AdsQueue;
  }
}

/** Consent banner plus the AdSense loader, which only runs after the visitor chooses. */
export function AdsConsent({ client }: { client: string }) {
  const { lang, t } = useI18n();
  const consent = useAdConsent();

  useEffect(() => {
    if (!consent || document.getElementById('adsense-loader')) return;
    const queue: AdsQueue = (window.adsbygoogle ??= []);
    if (consent === 'denied') queue.requestNonPersonalizedAds = 1;
    const script = document.createElement('script');
    script.id = 'adsense-loader';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    document.head.appendChild(script);
  }, [consent, client]);

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl animate-fade-in-up flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-950/95 p-4 text-sm text-slate-300 shadow-2xl backdrop-blur-lg sm:flex-row sm:items-center"
    >
      <p className="flex-1">
        {t.consentText}{' '}
        <Link href={routes.privacy(lang)} className="font-semibold text-secondary hover:underline">
          {t.privacy}
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setAdConsent('denied')}
          className="rounded-lg border border-slate-600 px-3 py-2 font-semibold text-slate-200 transition hover:border-slate-400"
        >
          {t.consentReject}
        </button>
        <button
          type="button"
          onClick={() => setAdConsent('granted')}
          className="rounded-lg bg-secondary px-3 py-2 font-bold text-slate-950 transition hover:bg-secondary/90"
        >
          {t.consentAccept}
        </button>
      </div>
    </div>
  );
}
