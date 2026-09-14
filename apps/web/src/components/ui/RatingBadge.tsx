const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ratingColor(rating: number): string {
  if (rating >= 7) return '#22c55e';
  if (rating >= 5) return '#eab308';
  return '#ef4444';
}

export function RatingBadge({ rating, label }: { rating: number; label?: string }) {
  const value = Math.min(Math.max(rating, 0), 10);
  const offset = CIRCUMFERENCE - (value / 10) * CIRCUMFERENCE;

  return (
    <div
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-800/80 bg-slate-950/80 shadow-md backdrop-blur-md"
      title={label}
    >
      <svg height="40" width="40" className="-rotate-90" aria-hidden>
        <circle cx="20" cy="20" r={RADIUS} strokeWidth="2.5" stroke="#1e293b" fill="transparent" />
        <circle
          cx="20"
          cy="20"
          r={RADIUS}
          strokeWidth="2.5"
          stroke={ratingColor(value)}
          fill="transparent"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black tracking-tighter text-white">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
