'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, safeNextPath } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get('next');
  const next = safeNextPath(rawNext, mode === 'signup' ? routes.taste(lang) : routes.home(lang));

  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .authConfig()
      .then((config) => setGoogleEnabled(config.google))
      .catch(() => setGoogleEnabled(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email'));
    const password = String(form.get('password'));

    setPending(true);
    setError(null);
    const { error: authError } =
      mode === 'signup'
        ? await authClient.signUp.email({
            name: String(form.get('name')),
            email,
            password,
            // Where the verification email link lands.
            callbackURL: routes.home(lang),
          })
        : await authClient.signIn.email({ email, password });
    setPending(false);

    if (authError) {
      setError(mode === 'signup' ? t.signupError : t.loginError);
      return;
    }
    router.replace(next);
    router.refresh();
  };

  const signInWithGoogle = async () => {
    setError(null);
    const { error: authError } = await authClient.signIn.social({ provider: 'google', callbackURL: next });
    if (authError) setError(t.genericError);
  };

  const inputClass =
    'w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none';
  const switchHref = mode === 'login' ? routes.signup(lang, rawNext ?? undefined) : routes.login(lang, rawNext ?? undefined);

  return (
    <div className="mx-auto w-full max-w-md animate-fade-in-up rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-md md:p-8">
      <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
        {mode === 'login' ? t.loginTitle : t.signupTitle}
      </h1>
      <p className="mt-2 mb-6 text-sm text-slate-400">{mode === 'login' ? t.loginSubtitle : t.signupSubtitle}</p>

      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
            </svg>
            {t.continueWithGoogle}
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-slate-500 uppercase">
            <span className="h-px flex-1 bg-slate-800" />
            {t.orWord}
            <span className="h-px flex-1 bg-slate-800" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
            {t.name}
            <input name="name" required maxLength={80} autoComplete="name" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
          {t.email}
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
          {t.password}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={128}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className={inputClass}
          />
          {mode === 'signup' && <span className="text-xs font-normal text-slate-500">{t.passwordHint}</span>}
          {mode === 'login' && (
            <Link
              href={routes.forgotPassword(lang)}
              className="self-end text-xs font-semibold text-secondary hover:underline"
            >
              {t.forgotPassword}
            </Link>
          )}
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-lg bg-secondary px-4 py-2.5 font-bold text-slate-950 transition hover:bg-secondary/90 disabled:opacity-60"
        >
          {pending ? t.loading : mode === 'login' ? t.login : t.signup}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {mode === 'login' ? t.noAccount : t.haveAccount}{' '}
        <Link href={switchHref} className="font-semibold text-secondary hover:underline">
          {mode === 'login' ? t.signup : t.login}
        </Link>
      </p>
    </div>
  );
}
