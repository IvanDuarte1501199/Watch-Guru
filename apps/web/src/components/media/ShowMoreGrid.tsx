'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { MediaSummary } from '@/lib/tmdb/types';
import { MediaGrid } from './MediaGrid';

export function ShowMoreGrid({ title, items, initial = 10 }: { title: string; items: MediaSummary[]; initial?: number }) {
  const { lang, t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="h2-guru mb-4 md:mb-8">{title}</h2>
      <MediaGrid items={expanded ? items : items.slice(0, initial)} lang={lang} />
      {!expanded && items.length > initial && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mx-auto block rounded-lg bg-tertiary px-6 py-2 font-semibold text-white transition hover:bg-secondary hover:text-slate-950"
        >
          {t.viewMore}
        </button>
      )}
    </section>
  );
}
