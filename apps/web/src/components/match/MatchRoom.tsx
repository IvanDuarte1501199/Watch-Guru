'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { clearCredentials, loadCredentials, saveCredentials, type RoomCredentials, type RoomMediaType } from '@/lib/match';
import type { Genre } from '@/lib/tmdb/types';
import { Loader } from '@/components/ui/Loader';
import { GenrePicker } from './GenrePicker';
import { JoinGate } from './JoinGate';
import { Lobby } from './Lobby';
import { MatchResult } from './MatchResult';
import { SwipeDeck } from './SwipeDeck';
import { useMatchRoom } from './useMatchRoom';

interface MatchRoomProps {
  code: string;
  genres: Record<RoomMediaType, Genre[]>;
}

export function MatchRoom({ code, genres }: MatchRoomProps) {
  const { t } = useI18n();
  const [credentials, setCredentials] = useState<RoomCredentials | null | undefined>(undefined);
  const { state, connection, lastError, send } = useMatchRoom(code, credentials ?? null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the seat token lives in localStorage
    setCredentials(loadCredentials(code));
  }, [code]);

  useEffect(() => {
    if (connection === 'unauthorized') clearCredentials(code);
  }, [connection, code]);

  if (credentials === undefined) return <Loader label={t.loading} />;

  if (!credentials || connection === 'unauthorized') {
    return (
      <>
        {connection === 'unauthorized' && <p className="mt-4 text-center text-sm text-amber-300">{t.seatLost}</p>}
        <JoinGate
          code={code}
          onJoined={(joined) => {
            saveCredentials(code, joined);
            setCredentials(joined);
          }}
        />
      </>
    );
  }

  if (!state) return <Loader label={t.connecting} />;

  // Errors clear with the next state update. Races (e.g. voting as a match is announced) aren't worth showing.
  const errorMessage = !lastError
    ? null
    : lastError.code === 'no_cards'
      ? t.noCards
      : lastError.code === 'invalid_state' || lastError.code === 'not_host'
        ? null
        : t.genericError;

  let content: React.ReactNode;
  switch (state.status) {
    case 'lobby':
      content = <Lobby state={state} send={send} />;
      break;
    case 'genres':
      content = <GenrePicker key={state.me.ready ? 'ready' : 'picking'} state={state} genres={genres[state.mediaType]} send={send} />;
      break;
    case 'swiping':
      content =
        state.deck.length === 0 ? (
          <Loader label={t.buildingDeck} />
        ) : (
          <SwipeDeck state={state} send={send} rejectedAt={lastError?.code === 'invalid_state' ? lastError.at : null} />
        );
      break;
    default:
      content = <MatchResult state={state} send={send} />;
  }

  return (
    <div className="py-4 md:py-8">
      {connection !== 'open' && (
        <p className="fixed top-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-500/90 px-4 py-1.5 text-sm font-bold text-slate-950 shadow-lg">
          <WifiOff className="h-4 w-4" aria-hidden />
          {connection === 'reconnecting' ? t.reconnecting : t.connecting}
        </p>
      )}
      {errorMessage && (
        <p role="alert" className="mb-4 text-center text-sm text-red-300">
          {errorMessage}
        </p>
      )}
      {content}
    </div>
  );
}
