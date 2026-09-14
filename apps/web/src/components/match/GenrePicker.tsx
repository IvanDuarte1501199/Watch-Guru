'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { ClientMessage, RoomState } from '@/lib/match';
import { tmdbImage } from '@/lib/tmdb/images';
import type { Genre, Provider } from '@/lib/tmdb/types';
import { ParticipantsList } from './ParticipantsList';

interface GenrePickerProps {
  state: RoomState;
  genres: Genre[];
  send: (message: ClientMessage) => boolean;
}

const MAX_PROVIDERS_SHOWN = 16;

export function GenrePicker({ state, genres, send }: GenrePickerProps) {
  const { lang, t } = useI18n();
  // Signed-in users arrive with their taste profile's genres and services pre-selected.
  const [selected, setSelected] = useState<number[]>(() =>
    state.me.genres.filter((id) => genres.some((genre) => genre.id === id)),
  );
  const [selectedProviders, setSelectedProviders] = useState<number[]>(state.me.providers);
  const [providers, setProviders] = useState<Provider[]>([]);
  const readyCount = state.participants.filter((participant) => participant.ready).length;
  const { region } = state;

  useEffect(() => {
    if (!region || state.me.ready) return;
    let cancelled = false;
    fetch(`/api/providers?region=${region}&lang=${lang}`)
      .then((response) => response.json() as Promise<{ providers: Provider[] }>)
      .then((data) => !cancelled && setProviders(data.providers.slice(0, MAX_PROVIDERS_SHOWN)))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [region, lang, state.me.ready]);

  const toggle = (id: number) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const toggleProvider = (id: number) =>
    setSelectedProviders((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  if (state.me.ready) {
    return (
      <section className="mx-auto flex max-w-xl animate-fade-in flex-col items-center gap-6 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
          <Check className="h-8 w-8 text-green-400" aria-hidden />
        </div>
        <h1 className="h2-guru">{t.waitingOthers}</h1>
        <ParticipantsList state={state} detail="ready" />
        {state.me.isHost && readyCount > 0 && readyCount < state.participants.length && (
          <button
            type="button"
            onClick={() => send({ type: 'begin-swiping' })}
            className="rounded-lg border border-secondary px-5 py-2 font-bold text-secondary transition hover:bg-secondary hover:text-slate-950"
          >
            {t.startNow} ({readyCount}/{state.participants.length})
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl animate-fade-in-up text-center">
      <h1 className="h1-guru">{t.pickGenres}</h1>
      <p className="p-guru mt-2 mb-6">{t.pickGenresHint}</p>

      <ul className="mb-8 flex flex-wrap justify-center gap-2">
        {genres.map((genre) => {
          const active = selected.includes(genre.id);
          return (
            <li key={genre.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggle(genre.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-secondary bg-secondary text-slate-950'
                    : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-secondary'
                }`}
              >
                {genre.name}
              </button>
            </li>
          );
        })}
      </ul>

      {providers.length > 0 && (
        <div className="mb-8">
          <h2 className="h2-guru">{t.yourProviders}</h2>
          <p className="mt-1 mb-4 text-sm text-slate-400">{t.groupProvidersHint}</p>
          <ul className="mx-auto grid max-w-lg grid-cols-4 gap-2 sm:grid-cols-8">
            {providers.map((provider) => {
              const active = selectedProviders.includes(provider.provider_id);
              return (
                <li key={provider.provider_id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    title={provider.provider_name}
                    onClick={() => toggleProvider(provider.provider_id)}
                    className={`relative block w-full overflow-hidden rounded-xl border-2 transition ${
                      active ? 'border-secondary' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tmdbImage(provider.logo_path, 'w92') ?? ''}
                      alt={provider.provider_name}
                      loading="lazy"
                      className="aspect-square w-full"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => send({ type: 'genres', genres: selected, providers: selectedProviders })}
        className="mb-8 rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-10 py-3 text-lg font-black text-slate-950 shadow-lg transition hover:brightness-110"
      >
        {t.imReady}
      </button>

      <ParticipantsList state={state} detail="ready" />
    </section>
  );
}
