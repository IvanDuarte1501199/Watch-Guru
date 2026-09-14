'use client';

import Link from 'next/link';
import { Heart, Share2, Trophy } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { ClientMessage, RankedCard, RoomState } from '@/lib/match';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';

function MiniCard({ item, place }: { item: RankedCard; place?: number }) {
  const { lang, t } = useI18n();
  const poster = tmdbImage(item.card.posterPath, 'w342');
  return (
    <Link
      href={routes.media(lang, item.card.mediaType, item.card.tmdbId, item.card.title)}
      className="group flex flex-col items-center gap-2 text-center"
    >
      <span className="relative block aspect-[2/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
        )}
        {place && (
          <span className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 font-black text-slate-950">
            {place}
          </span>
        )}
      </span>
      <span className="line-clamp-2 text-sm font-semibold text-white group-hover:text-secondary">{item.card.title}</span>
      <span className="text-xs text-slate-400">{format(t.likesCount, { count: item.likes })}</span>
    </Link>
  );
}

export function MatchResult({ state, send }: { state: RoomState; send: (message: ClientMessage) => boolean }) {
  const { lang, t } = useI18n();
  const host = state.participants.find((participant) => participant.isHost);
  const hostName = host?.nickname ?? '';

  if (state.status === 'matched') {
    const latest = state.matches[state.matches.length - 1];
    const backdrop = tmdbImage(latest.card.backdropPath, 'w1280') ?? tmdbImage(latest.card.posterPath, 'w780');
    const detailHref = routes.media(lang, latest.card.mediaType, latest.card.tmdbId, latest.card.title);
    const share = () =>
      navigator
        .share?.({
          title: 'WatchGuru Match',
          text: format(t.shareMatchText, { title: latest.card.title }),
          url: `${window.location.origin}${detailHref}`,
        })
        .catch(() => undefined);

    return (
      <section className="relative mx-auto max-w-lg animate-fade-in-up text-center">
        {backdrop && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backdrop} alt="" className="absolute inset-0 -z-10 h-full w-full rounded-3xl object-cover opacity-20 blur-sm" />
        )}
        <div className="rounded-3xl border border-pink-400/30 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <p className="mb-2 flex items-center justify-center gap-2 text-4xl font-black text-pink-400 md:text-5xl">
            <Heart className="h-10 w-10 animate-pulse fill-pink-500" aria-hidden />
            {t.itsAMatch}
          </p>
          <p className="mb-6 text-slate-300">{format(t.matchLikes, { likes: latest.likes, voters: state.voterCount })}</p>

          <div className="mx-auto mb-6 w-48">
            <MiniCard item={latest} />
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={detailHref}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-4 py-3 font-black text-slate-950 transition hover:brightness-110"
            >
              {t.seeDetails}
            </Link>
            {'share' in navigator && (
              <button
                type="button"
                onClick={share}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 font-semibold text-slate-200 hover:border-secondary"
              >
                <Share2 className="h-4 w-4" aria-hidden />
                {t.share}
              </button>
            )}
            {state.me.isHost ? (
              <button
                type="button"
                onClick={() => send({ type: 'keep-swiping' })}
                className="text-sm font-semibold text-slate-400 hover:text-white"
              >
                {t.keepSearching}
              </button>
            ) : (
              <p className="text-sm text-slate-400">{format(t.waitingHostDecision, { host: hostName })}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Finished: the deck ran out.
  return (
    <section className="mx-auto max-w-3xl animate-fade-in-up text-center">
      <Trophy className="mx-auto mb-3 h-12 w-12 text-yellow-400" aria-hidden />
      <h1 className="h1-guru mb-2">{state.matches.length > 0 ? t.yourMatches : t.noMatchTitle}</h1>

      {state.matches.length > 0 && (
        <ul className="mx-auto mt-6 mb-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {state.matches.map((item) => (
            <li key={item.index}>
              <MiniCard item={item} />
            </li>
          ))}
        </ul>
      )}

      {state.ranking.length > 0 && (
        <>
          <h2 className="h2-guru mt-6 mb-4">{t.podiumTitle}</h2>
          <ol className="mx-auto mb-10 grid max-w-xl grid-cols-3 gap-4">
            {state.ranking.map((item, place) => (
              <li key={item.index}>
                <MiniCard item={item} place={place + 1} />
              </li>
            ))}
          </ol>
        </>
      )}

      {state.me.isHost ? (
        <button
          type="button"
          onClick={() => send({ type: 'more-cards' })}
          className="rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-8 py-3 font-black text-slate-950 transition hover:brightness-110"
        >
          {t.moreCards}
        </button>
      ) : (
        <p className="text-sm text-slate-400">{format(t.waitingHostDecision, { host: hostName })}</p>
      )}
      <p className="mt-4">
        <Link href={routes.match(lang)} className="text-sm font-semibold text-secondary hover:underline">
          {t.newRoom}
        </Link>
      </p>
    </section>
  );
}
