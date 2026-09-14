'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { MatchApiError, matchApi, type RoomCredentials, type RoomPreview } from '@/lib/match';
import { routes } from '@/lib/routes';
import { Loader } from '@/components/ui/Loader';

/** Shown when opening a room link without a seat yet: asks for a nickname and joins. */
export function JoinGate({ code, onJoined }: { code: string; onJoined: (credentials: RoomCredentials) => void }) {
  const { lang, t } = useI18n();
  const { data: session } = useSession();
  const [preview, setPreview] = useState<RoomPreview | null | undefined>(undefined);
  const [nickname, setNickname] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    matchApi.preview(code).then(setPreview).catch(() => setPreview(null));
  }, [code]);

  if (preview === undefined) return <Loader label={t.loading} />;

  const unavailable = !preview ? t.roomNotFound : !preview.joinable ? (preview.participants >= 8 ? t.roomFull : t.roomClosed) : null;

  if (unavailable) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="h2-guru">{unavailable}</p>
        <Link href={routes.match(lang)} className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950">
          {t.newRoom}
        </Link>
      </div>
    );
  }

  const join = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const credentials = await matchApi.join(code, nickname.trim() || undefined);
      onJoined(credentials);
    } catch (joinError) {
      const reason = joinError instanceof MatchApiError ? joinError.code : '';
      setError(reason === 'room_full' ? t.roomFull : reason === 'room_closed' ? t.roomClosed : t.genericError);
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={join}
      className="mx-auto mt-6 w-full max-w-md animate-fade-in-up rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 text-center shadow-2xl backdrop-blur-md md:mt-12 md:p-8"
    >
      <Heart className="mx-auto mb-4 h-10 w-10 fill-pink-500 text-pink-500" aria-hidden />
      <h1 className="text-2xl font-black text-white">{format(t.joinRoomTitle, { host: preview!.host ?? 'WatchGuru' })}</h1>
      <p className="mt-2 mb-6 text-sm text-slate-400">{t.joinRoomSubtitle}</p>

      {!session && (
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          required
          maxLength={24}
          aria-label={t.yourNickname}
          placeholder={t.yourNickname}
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-center text-white placeholder-slate-500 focus:border-secondary focus:outline-none"
        />
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-4 py-3 font-black text-slate-950 transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? t.loading : t.join}
      </button>
    </form>
  );
}
