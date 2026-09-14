'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';

interface StarRatingProps {
  /** Rating from 1 to 10; each star is worth 2 points, so halves are possible. */
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
  size?: 'md' | 'sm';
}

export function StarRating({ value, onChange, disabled, size = 'md' }: StarRatingProps) {
  const starClass = size === 'sm' ? 'h-5 w-5' : 'h-8 w-8';
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value ?? 0;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(null)} role="radiogroup" aria-label={t.yourRating}>
      {[1, 2, 3, 4, 5].map((star) => {
        const full = shown >= star * 2;
        const half = !full && shown >= star * 2 - 1;
        return (
          <span key={star} className={`relative ${starClass}`}>
            <Star className={`absolute inset-0 ${starClass} text-slate-600`} aria-hidden />
            {(full || half) && (
              <span className={`absolute inset-y-0 left-0 overflow-hidden ${full ? 'w-full' : 'w-1/2'}`} aria-hidden>
                <Star className={`${starClass} fill-secondary text-secondary`} />
              </span>
            )}
            {/* Left half of each star gives a half point, right half the full star. */}
            {[star * 2 - 1, star * 2].map((points, index) => (
              <button
                key={points}
                type="button"
                role="radio"
                aria-checked={value === points}
                aria-label={format(t.rateStars, { stars: points / 2 })}
                disabled={disabled}
                onMouseEnter={() => setHover(points)}
                onFocus={() => setHover(points)}
                onBlur={() => setHover(null)}
                onClick={() => onChange(value === points ? null : points)}
                className={`absolute inset-y-0 w-1/2 cursor-pointer disabled:cursor-default ${index === 0 ? 'left-0' : 'right-0'}`}
              />
            ))}
          </span>
        );
      })}
      {value !== null && size === 'md' && (
        <span className={`ml-2 min-w-8 font-bold text-secondary ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{(value / 2).toFixed(1)}</span>
      )}
    </div>
  );
}
