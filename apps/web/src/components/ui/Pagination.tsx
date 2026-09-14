import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { format } from '@/lib/i18n/config';

/** TMDB never serves more than 500 pages of any list. */
const MAX_PAGES = 500;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Builds the URL for a given page, keeping any other query params. */
  hrefForPage: (page: number) => string;
  t: Dictionary;
}

function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'gap', total];
  if (current >= total - 3) return [1, 'gap', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'gap', current - 1, current, current + 1, 'gap', total];
}

export function Pagination({ currentPage, totalPages, hrefForPage, t }: PaginationProps) {
  const total = Math.min(totalPages, MAX_PAGES);
  if (total <= 1) return null;

  const arrowClass =
    'flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition hover:border-secondary hover:text-secondary';

  return (
    <nav aria-label="Pagination" className="mb-8 flex items-center justify-center gap-1 md:gap-2">
      {currentPage > 1 ? (
        <Link href={hrefForPage(currentPage - 1)} rel="prev" aria-label={t.previous} className={arrowClass}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${arrowClass} pointer-events-none opacity-40`} aria-hidden>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pageWindow(currentPage, total).map((page, index) =>
        page === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-slate-500">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={hrefForPage(page)}
            aria-label={format(t.page, { page })}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
              page === currentPage ? 'bg-secondary text-slate-950' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            {page}
          </Link>
        ),
      )}

      {currentPage < total ? (
        <Link href={hrefForPage(currentPage + 1)} rel="next" aria-label={t.next} className={arrowClass}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${arrowClass} pointer-events-none opacity-40`} aria-hidden>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
