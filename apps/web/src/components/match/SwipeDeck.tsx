'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Heart, Star, X } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { nextCardIndex, type ClientMessage, type DeckCard, type RoomState } from '@/lib/match';
import { tmdbImage } from '@/lib/tmdb/images';
import { ParticipantsList } from './ParticipantsList';

const SWIPE_THRESHOLD = 110;
const EXIT_MS = 220;

function CardFace({ card, posterOnly = false }: { card: DeckCard; posterOnly?: boolean }) {
  const { t } = useI18n();
  const poster = tmdbImage(card.posterPath, 'w500');
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl select-none">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
      )}
      {!posterOnly && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-5 pt-24 text-left">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {card.onGroupProviders && (
            <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-[11px] font-bold text-green-300 uppercase">
              {t.onGroupProviders}
            </span>
          )}
          {card.genres.map((genre) => (
            <span key={genre} className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold text-slate-200 uppercase">
              {genre}
            </span>
          ))}
        </div>
        <h2 className="text-2xl leading-tight font-black text-white">{card.title}</h2>
        <p className="mt-1 flex items-center gap-3 text-sm text-slate-300">
          {card.year && <span>{card.year}</span>}
          <span>{card.mediaType === 'tv' ? t.tvShow : t.movie}</span>
          {card.voteAverage > 0 && (
            <span className="flex items-center gap-1 font-bold text-yellow-400">
              <Star className="h-3.5 w-3.5 fill-yellow-400" aria-hidden />
              {card.voteAverage.toFixed(1)}
            </span>
          )}
        </p>
        {card.overview && <p className="mt-2 line-clamp-3 text-sm leading-snug text-slate-300">{card.overview}</p>}
      </div>}
    </div>
  );
}

export function SwipeDeck({ state, send, rejectedAt }: { state: RoomState; send: (m: ClientMessage) => boolean; rejectedAt: number | null }) {
  const { t } = useI18n();
  const [pending, setPending] = useState<Set<number>>(new Set());
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const [exiting, setExiting] = useState<'left' | 'right' | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  // Server state is the source of truth: drop optimistic votes it has confirmed or rejected.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reconcile optimistic votes with pushed state
    setPending((current) => {
      if (current.size === 0) return current;
      const confirmed = new Set(state.me.votedCards);
      const next = new Set([...current].filter((index) => !confirmed.has(index)));
      return next.size === current.size ? current : next;
    });
  }, [state.me.votedCards]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a rejected vote brings its card back
    if (rejectedAt) setPending(new Set());
  }, [rejectedAt]);

  const index = nextCardIndex(state, pending);
  const card = index === null ? null : state.deck[index];
  const upcoming = index === null ? null : state.deck[nextCardIndex(state, new Set([...pending, index])) ?? -1];

  const decide = useCallback(
    (liked: boolean) => {
      if (index === null || exiting) return;
      setExiting(liked ? 'right' : 'left');
      window.setTimeout(() => {
        if (send({ type: 'vote', index, liked })) setPending((current) => new Set(current).add(index));
        setExiting(null);
        setDrag({ x: 0, y: 0, dragging: false });
      }, EXIT_MS);
    },
    [index, exiting, send],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') decide(true);
      if (event.key === 'ArrowLeft') decide(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide]);

  if (!state.me.isVoter) {
    return (
      <section className="mx-auto max-w-md py-10 text-center">
        <p className="p-guru mb-6">{t.spectator}</p>
        <ParticipantsList state={state} detail="progress" />
      </section>
    );
  }

  if (!card) {
    return (
      <section className="mx-auto flex max-w-md animate-fade-in flex-col items-center gap-4 py-16 text-center">
        <h1 className="h2-guru">{t.doneSwiping}</h1>
        <p className="animate-pulse text-slate-400">{t.doneSwipingHint}</p>
        <ParticipantsList state={state} detail="progress" />
      </section>
    );
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (exiting) return;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };
    setDrag({ x: 0, y: 0, dragging: true });
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!start.current) return;
    setDrag({ x: event.clientX - start.current.x, y: event.clientY - start.current.y, dragging: true });
  };
  const onPointerUp = () => {
    if (!start.current) return;
    start.current = null;
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) decide(drag.x > 0);
    else setDrag({ x: 0, y: 0, dragging: false });
  };

  const offsetX = exiting ? (exiting === 'right' ? 600 : -600) : drag.x;
  const likeOpacity = Math.min(Math.max(offsetX / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-offsetX / SWIPE_THRESHOLD, 0), 1);
  const remaining = state.deck.length - state.me.votedCards.length - pending.size;

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between text-xs font-semibold text-slate-400">
        <span>{format(t.cardsLeft, { count: remaining })}</span>
        <span>{state.majority === 1 ? t.majorityHintOne : format(t.majorityHint, { count: state.majority })}</span>
      </div>

      <div className="relative aspect-[2/3] w-full max-w-[min(100%,24rem)] touch-none">
        {upcoming && (
          <div className="absolute inset-0 scale-95 opacity-40 brightness-50" aria-hidden>
            <CardFace card={upcoming} posterOnly />
          </div>
        )}
        <div
          key={index}
          role="group"
          aria-label={card.title}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`absolute inset-0 animate-fade-in cursor-grab active:cursor-grabbing ${drag.dragging && !exiting ? '' : 'transition-transform duration-200 ease-out'}`}
          style={{ transform: `translate(${offsetX}px, ${exiting ? 0 : drag.y * 0.2}px) rotate(${offsetX / 18}deg)` }}
        >
          <CardFace card={card} />
          <span
            className="absolute top-8 left-6 -rotate-12 rounded-lg border-4 border-green-400 px-3 py-1 text-3xl font-black text-green-400 uppercase"
            style={{ opacity: likeOpacity }}
            aria-hidden
          >
            {t.like}
          </span>
          <span
            className="absolute top-8 right-6 rotate-12 rounded-lg border-4 border-red-400 px-3 py-1 text-3xl font-black text-red-400 uppercase"
            style={{ opacity: nopeOpacity }}
            aria-hidden
          >
            {t.nope}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => decide(false)}
          aria-label={t.nope}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-400/60 bg-slate-950 text-red-400 shadow-xl transition hover:scale-110 hover:bg-red-500/10"
        >
          <X className="h-8 w-8" strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          aria-label={t.like}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-400/60 bg-slate-950 text-green-400 shadow-xl transition hover:scale-110 hover:bg-green-500/10"
        >
          <Heart className="h-8 w-8 fill-green-400" />
        </button>
      </div>
      <p className="hidden text-xs text-slate-500 md:block">{t.swipeHint}</p>

      <ParticipantsList state={state} detail="progress" />
    </section>
  );
}
