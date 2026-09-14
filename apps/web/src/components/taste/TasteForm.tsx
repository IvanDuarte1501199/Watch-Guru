'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Check, Heart, ThumbsDown } from 'lucide-react';
import { api, type Taste } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { Genre, Provider } from '@/lib/tmdb/types';
import { detectCountry, storeCountry } from '@/lib/watch-region';
import { Loader } from '@/components/ui/Loader';

type GenreChoice = 'liked' | 'disliked';

interface TasteFormProps {
  genres: Genre[];
  countries: { code: string; name: string }[];
  defaultRegion: string;
}

export function TasteForm({ genres, countries, defaultRegion }: TasteFormProps) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const signedIn = Boolean(session);

  const [loaded, setLoaded] = useState(false);
  const [choices, setChoices] = useState<Record<number, GenreChoice>>({});
  const [region, setRegion] = useState(defaultRegion);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [providers, setProviders] = useState<{ region: string; list: Provider[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    Promise.all([api.taste(), detectCountry()])
      .then(([taste, detected]) => {
        if (cancelled) return;
        if (taste) {
          setChoices(
            Object.fromEntries([
              ...taste.likedGenres.map((id) => [id, 'liked'] as const),
              ...taste.dislikedGenres.map((id) => [id, 'disliked'] as const),
            ]),
          );
          setSelectedProviders(taste.providers);
        }
        setRegion(taste?.region ?? detected ?? defaultRegion);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, [signedIn, defaultRegion]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/providers?region=${region}&lang=${lang}`)
      .then((response) => response.json() as Promise<{ providers: Provider[] }>)
      .then((data) => !cancelled && setProviders({ region, list: data.providers }))
      .catch(() => !cancelled && setProviders({ region, list: [] }));
    return () => {
      cancelled = true;
    };
  }, [region, lang]);

  if (isPending || (signedIn && !loaded)) return <Loader label={t.loading} />;

  if (!signedIn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="h2-guru">{t.tasteTitle}</h1>
        <Link href={routes.signup(lang, routes.taste(lang))} className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950">
          {t.signup}
        </Link>
      </div>
    );
  }

  const cycleGenre = (id: number) =>
    setChoices((current) => {
      const next = { ...current };
      if (!current[id]) next[id] = 'liked';
      else if (current[id] === 'liked') next[id] = 'disliked';
      else delete next[id];
      return next;
    });

  const toggleProvider = (id: number) =>
    setSelectedProviders((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const changeRegion = (code: string) => {
    setRegion(code);
    setSelectedProviders([]);
    storeCountry(code);
  };

  const save = async () => {
    const taste: Taste = {
      likedGenres: genres.filter((genre) => choices[genre.id] === 'liked').map((genre) => genre.id),
      dislikedGenres: genres.filter((genre) => choices[genre.id] === 'disliked').map((genre) => genre.id),
      providers: selectedProviders,
      region,
    };
    setSaving(true);
    setError(false);
    try {
      await api.saveTaste(taste);
      router.push(routes.random(lang, 'movie'));
    } catch {
      setError(true);
      setSaving(false);
    }
  };

  const visibleProviders = providers?.region === region ? providers.list : null;

  return (
    <section className="mx-auto max-w-4xl animate-fade-in-up py-6 md:py-10">
      <h1 className="h1-guru text-center">{t.tasteTitle}</h1>
      <p className="p-guru mx-auto mt-3 mb-8 max-w-2xl text-center">{t.tasteSubtitle}</p>

      <h2 className="h2-guru mb-4">{t.genres}</h2>
      <ul className="mb-10 flex flex-wrap gap-2">
        {genres.map((genre) => {
          const choice = choices[genre.id];
          return (
            <li key={genre.id}>
              <button
                type="button"
                onClick={() => cycleGenre(genre.id)}
                aria-label={`${genre.name}${choice ? ` · ${choice === 'liked' ? t.liked : t.disliked}` : ''}`}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  choice === 'liked'
                    ? 'border-secondary bg-secondary text-slate-950'
                    : choice === 'disliked'
                      ? 'border-red-500/50 bg-red-500/10 text-red-300 line-through'
                      : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-secondary'
                }`}
              >
                {choice === 'liked' && <Heart className="h-4 w-4 fill-slate-950" aria-hidden />}
                {choice === 'disliked' && <ThumbsDown className="h-4 w-4" aria-hidden />}
                {genre.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="h2-guru">{t.yourProviders}</h2>
          <p className="text-sm text-slate-400">{t.providersHint}</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          {t.selectCountry}
          <select
            value={region}
            onChange={(event) => changeRegion(event.target.value)}
            className="max-w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white focus:border-secondary focus:outline-none"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!visibleProviders ? (
        <Loader label={t.loading} />
      ) : (
        <ul className="mb-10 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {visibleProviders.map((provider) => {
            const selected = selectedProviders.includes(provider.provider_id);
            return (
              <li key={provider.provider_id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  title={provider.provider_name}
                  onClick={() => toggleProvider(provider.provider_id)}
                  className={`relative block w-full overflow-hidden rounded-xl border-2 transition ${
                    selected ? 'border-secondary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tmdbImage(provider.logo_path, 'w92') ?? ''} alt={provider.provider_name} loading="lazy" className="aspect-square w-full" />
                  {selected && (
                    <span className="absolute top-1 right-1 rounded-full bg-secondary p-0.5 text-slate-950">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p role="alert" className="mb-4 text-center text-sm text-red-300">{t.genericError}</p>}

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-secondary px-6 py-3 font-bold text-slate-950 transition hover:bg-secondary/90 disabled:opacity-60"
        >
          {saving ? t.saving : t.saveTaste}
        </button>
        <Link href={routes.home(lang)} className="text-sm font-semibold text-slate-400 hover:text-white">
          {t.skip}
        </Link>
      </div>
    </section>
  );
}
