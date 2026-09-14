'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { ClientMessage, RoomState } from '@/lib/match';
import { ParticipantsList } from './ParticipantsList';

export function Lobby({ state, send }: { state: RoomState; send: (message: ClientMessage) => boolean }) {
  const { t } = useI18n();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const host = state.participants.find((participant) => participant.isHost);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the room URL is only known in the browser
    setUrl(window.location.href.split('?')[0]);
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const share = () => navigator.share?.({ title: 'WatchGuru Match', text: t.shareRoomText, url }).catch(() => undefined);
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <section className="mx-auto flex max-w-xl animate-fade-in-up flex-col items-center gap-6 text-center">
      <div>
        <h1 className="h1-guru">{t.lobbyTitle}</h1>
        <p className="p-guru mt-2">{t.lobbySubtitle}</p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-2xl">
        {url ? <QRCodeSVG value={url} size={196} level="M" /> : <div className="h-[196px] w-[196px]" />}
      </div>

      <div>
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">{t.roomCode}</p>
        <p className="font-mono text-4xl font-black tracking-[0.3em] text-white">{state.code}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 font-semibold text-slate-200 transition hover:border-secondary hover:text-secondary"
        >
          <Copy className="h-4 w-4" aria-hidden />
          {copied ? t.linkCopied : t.copyLink}
        </button>
        {canShare && (
          <button
            type="button"
            onClick={share}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 font-semibold text-slate-200 transition hover:border-secondary hover:text-secondary"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {t.share}
          </button>
        )}
      </div>

      <div className="w-full">
        <h2 className="mb-3 text-sm font-bold tracking-wide text-slate-400 uppercase">
          {t.participants} ({state.participants.length})
        </h2>
        <ParticipantsList state={state} detail="presence" />
      </div>

      {state.me.isHost ? (
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => send({ type: 'start' })}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-10 py-3 text-lg font-black text-slate-950 shadow-lg transition hover:brightness-110"
          >
            {t.startRoom}
          </button>
          {state.participants.length === 1 && <p className="text-xs text-slate-400">{t.aloneHint}</p>}
        </div>
      ) : (
        <p className="animate-pulse text-slate-300">{format(t.waitingHost, { host: host?.nickname ?? '' })}</p>
      )}
    </section>
  );
}
