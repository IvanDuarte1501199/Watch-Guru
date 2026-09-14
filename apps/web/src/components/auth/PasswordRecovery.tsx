'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

const cardClass =
  'mx-auto w-full max-w-md animate-fade-in-up rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-md md:p-8';
const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none';
const buttonClass =
  'mt-2 w-full rounded-lg bg-secondary px-4 py-2.5 font-bold text-slate-950 transition hover:bg-secondary/90 disabled:opacity-60';

function Done({ message }: { message: string }) {
  const { lang, t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <CheckCircle2 className="h-12 w-12 text-green-400" aria-hidden />
      <p role="status" className="text-slate-200">
        {message}
      </p>
      <Link href={routes.login(lang)} className="font-semibold text-secondary hover:underline">
        {t.backToLogin}
      </Link>
    </div>
  );
}

export function ForgotPasswordForm() {
  const { lang, t } = useI18n();
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const email = String(new FormData(event.currentTarget).get('email'));
    // Same outcome whether or not the account exists, so emails can't be enumerated.
    await authClient.requestPasswordReset({ email, redirectTo: routes.resetPassword(lang) }).catch(() => undefined);
    setPending(false);
    setSent(true);
  };

  return (
    <div className={cardClass}>
      {sent ? (
        <Done message={t.resetLinkSent} />
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">{t.forgotTitle}</h1>
            <p className="mt-2 text-sm text-slate-400">{t.forgotSubtitle}</p>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
            {t.email}
            <input name="email" type="email" required autoComplete="email" className={inputClass} />
          </label>
          <button type="submit" disabled={pending} className={buttonClass}>
            {pending ? t.loading : t.sendResetLink}
          </button>
          <Link href={routes.login(lang)} className="text-center text-sm font-semibold text-slate-400 hover:text-white">
            {t.backToLogin}
          </Link>
        </form>
      )}
    </div>
  );
}

export function ResetPasswordForm() {
  const { lang, t } = useI18n();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'pending' | 'done' | 'invalid'>(
    token && !searchParams.get('error') ? 'idle' : 'invalid',
  );

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setStatus('pending');
    const newPassword = String(new FormData(event.currentTarget).get('password'));
    const { error } = await authClient.resetPassword({ newPassword, token });
    setStatus(error ? 'invalid' : 'done');
  };

  return (
    <div className={cardClass}>
      {status === 'done' ? (
        <Done message={t.passwordChanged} />
      ) : status === 'invalid' ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p role="alert" className="text-slate-200">
            {t.resetLinkInvalid}
          </p>
          <Link href={routes.forgotPassword(lang)} className="font-semibold text-secondary hover:underline">
            {t.forgotTitle}
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <h1 className="text-2xl font-black text-white">{t.resetTitle}</h1>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
            {t.newPassword}
            <input
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className={inputClass}
            />
            <span className="text-xs font-normal text-slate-500">{t.passwordHint}</span>
          </label>
          <button type="submit" disabled={status === 'pending'} className={buttonClass}>
            {status === 'pending' ? t.loading : t.savePassword}
          </button>
        </form>
      )}
    </div>
  );
}
