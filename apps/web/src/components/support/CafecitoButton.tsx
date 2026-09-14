import { Coffee } from 'lucide-react';
import { CAFECITO_USER } from '@/lib/site';

/** Link to the developer's Cafecito page; renders nothing until NEXT_PUBLIC_CAFECITO_USER is set. */
export function CafecitoButton({
  label,
  compact = false,
  className = '',
}: {
  label: string;
  /** Icon only below `xl`, for tight spots like the header. */
  compact?: boolean;
  className?: string;
}) {
  if (!CAFECITO_USER) return null;
  return (
    <a
      href={`https://cafecito.app/${encodeURIComponent(CAFECITO_USER)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={compact ? label : undefined}
      title={compact ? label : undefined}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 text-sm font-semibold whitespace-nowrap ${compact ? 'p-1.5 sm:p-2 xl:px-3 xl:py-1.5' : 'px-4 py-2'} text-amber-200 transition hover:border-amber-300 hover:bg-amber-400/20 hover:text-amber-100 ${className}`}
    >
      <Coffee className="h-4 w-4" aria-hidden />
      <span className={compact ? 'hidden xl:inline' : undefined}>{label}</span>
    </a>
  );
}
