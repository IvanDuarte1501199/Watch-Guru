'use client';

import { Check, Crown } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { RoomState } from '@/lib/match';

type Detail = 'presence' | 'ready' | 'progress';

export function ParticipantsList({ state, detail }: { state: RoomState; detail: Detail }) {
  const { t } = useI18n();
  const deckSize = state.deck.length;

  return (
    <ul className="flex flex-wrap justify-center gap-2" aria-label={t.participants}>
      {state.participants.map((participant) => {
        const isMe = participant.id === state.me.id;
        return (
          <li
            key={participant.id}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
              isMe ? 'border-secondary/60 bg-secondary/10' : 'border-slate-700 bg-slate-900/70'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${participant.online ? 'bg-green-400' : 'bg-slate-600'}`}
              aria-hidden
            />
            {participant.isHost && <Crown className="h-3.5 w-3.5 text-yellow-400" aria-label={t.host} />}
            <span className="font-semibold text-white">
              {participant.nickname}
              {isMe && <span className="font-normal text-slate-400"> ({t.you})</span>}
            </span>
            {detail === 'ready' &&
              (participant.ready ? (
                <Check className="h-4 w-4 text-green-400" aria-label={t.ready} />
              ) : (
                <span className="text-xs text-slate-400">{t.choosing}</span>
              ))}
            {detail === 'progress' && participant.isVoter && deckSize > 0 && (
              <span className="text-xs font-bold text-slate-400">
                {Math.min(participant.votes, deckSize)}/{deckSize}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
