'use client';

import { useEffect, useRef } from 'react';
import { useAdConsent } from '@/lib/ad-consent';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { ADSENSE_CLIENT } from '@/lib/site';

const SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

/** Responsive AdSense unit. Renders nothing unless ads are configured and the visitor has chosen a consent option. */
export function AdSlot({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  const consent = useAdConsent();
  const pushed = useRef(false);
  const enabled = Boolean(ADSENSE_CLIENT && SLOT && consent);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle ??= []).push({});
    } catch {
      // Blocked by an ad blocker; leave the space empty.
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside aria-label={t.advertisement} className={`my-8 min-h-24 overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT!}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
