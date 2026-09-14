import { Coffee } from 'lucide-react';
import { CAFECITO_USER } from '@/lib/site';

/** Link to the developer's Cafecito page; renders nothing until NEXT_PUBLIC_CAFECITO_USER is set. */
export function CafecitoButton({ label, className = '' }: { label: string; className?: string }) {
  if (!CAFECITO_USER) return null;
  return (
    <a
      href={`https://cafecito.app/${encodeURIComponent(CAFECITO_USER)}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-400/20 hover:text-amber-100 ${className}`}
    >
      <Coffee className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
