'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { ClientMessage, RoomState } from '@/lib/match';
import type { Genre } from '@/lib/tmdb/types';
import { ParticipantsList } from './ParticipantsList';

interface GenrePickerProps {
  state: RoomState;
  genres: Genre[];
  send: (message: ClientMessage) => boolean;
}

export function GenrePicker({ state, genres, send }: GenrePickerProps) {
  const { t } = useI18n();
  // Signed-in users arrive with their taste profile's genres pre-selected.
  const [selected, setSelected] = useState<number[]>(() =>
    state.me.genres.filter((id) => genres.some((genre) => genre.id === id)),
  );
  const readyCount = state.participants.filter((participant) => participant.ready).length;

  const toggle = (id: number) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

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

      <button
        type="button"
        onClick={() => send({ type: 'genres', genres: selected })}
        className="mb-8 rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-10 py-3 text-lg font-black text-slate-950 shadow-lg transition hover:brightness-110"
      >
        {t.imReady}
      </button>

      <ParticipantsList state={state} detail="ready" />
    </section>
  );
}
