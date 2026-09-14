'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Film, Heart, Layers, Tv, Users } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { MatchApiError, matchApi, saveCredentials, type RoomMediaType } from '@/lib/match';
import { routes } from '@/lib/routes';
import { detectCountry } from '@/lib/watch-region';

export function MatchLanding() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const { data: session } = useSession();
  const [mediaType, setMediaType] = useState<RoomMediaType>('movie');
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const [pending, setPending] = useState<'create' | 'join' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signedInName = session?.user.name;

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending('create');
    setError(null);
    try {
      const region = await detectCountry().catch(() => null);
      const room = await matchApi.create({
        mediaType,
        lang,
        nickname: nickname.trim() || undefined,
        region: region ?? undefined,
      });
      saveCredentials(room.code, room);
      router.push(routes.matchRoom(lang, room.code));
    } catch {
      setError(t.genericError);
      setPending(null);
    }
  };

  const join = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setPending('join');
    setError(null);
    try {
      const preview = await matchApi.preview(normalized);
      if (!preview) throw new MatchApiError(404, 'room_not_found');
      router.push(routes.matchRoom(lang, preview.code));
    } catch {
      setError(t.roomNotFound);
      setPending(null);
    }
  };

  const typeOptions: { value: RoomMediaType; label: string; icon: typeof Film }[] = [
    { value: 'movie', label: t.roomMovies, icon: Film },
    { value: 'tv', label: t.roomTv, icon: Tv },
    { value: 'both', label: t.roomBoth, icon: Layers },
  ];
  const steps = [t.matchStep1, t.matchStep2, t.matchStep3, t.matchStep4];
  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none';

  return (
    <section className="mx-auto max-w-5xl animate-fade-in-up py-6 md:py-12">
      <div className="mb-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-sm font-bold text-pink-300">
          <Heart className="h-4 w-4 fill-pink-400" aria-hidden />
          {t.match}
        </span>
        <h1 className="h1-guru">{t.matchTitle}</h1>
        <p className="p-guru mx-auto mt-4 max-w-2xl">{t.matchDescription}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <form
          onSubmit={create}
          className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-md"
        >
          <h2 className="h2-guru mb-4">{t.whatToWatch}</h2>
          <div className="mb-5 grid grid-cols-3 gap-2" role="radiogroup">
            {typeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mediaType === value}
                onClick={() => setMediaType(value)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-sm font-bold transition ${
                  mediaType === value
                    ? 'border-secondary bg-secondary/15 text-secondary'
                    : 'border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Icon className="h-6 w-6" aria-hidden />
                {label}
              </button>
            ))}
          </div>

          {!signedInName && (
            <label className="mb-5 flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
              {t.yourNickname}
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                required
                maxLength={24}
                placeholder={t.nicknamePlaceholder}
                className={inputClass}
              />
            </label>
          )}

          <button
            type="submit"
            disabled={pending !== null}
            className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-4 py-3 font-black text-slate-950 shadow-lg transition hover:brightness-110 disabled:opacity-60"
          >
            {pending === 'create' ? t.loading : t.createRoom}
          </button>
        </form>

        <div className="flex flex-col gap-6">
          <form onSubmit={join} className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 backdrop-blur-md">
            <h2 className="h2-guru mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" aria-hidden />
              {t.joinRoom}
            </h2>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                aria-label={t.roomCode}
                placeholder={t.roomCode}
                maxLength={8}
                autoCapitalize="characters"
                className={`${inputClass} font-mono tracking-[0.3em] uppercase`}
              />
              <button
                type="submit"
                disabled={pending !== null}
                className="shrink-0 rounded-lg border border-secondary px-4 font-bold text-secondary transition hover:bg-secondary hover:text-slate-950 disabled:opacity-60"
              >
                {t.join}
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6">
            <h2 className="h2-guru mb-4">{t.matchHowTitle}</h2>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-slate-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-sm font-black text-secondary">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 text-center text-sm text-red-300">
          {error}
        </p>
      )}
    </section>
  );
}
