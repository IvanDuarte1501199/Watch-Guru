'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authClient, useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { Loader } from '@/components/ui/Loader';

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:outline-none';

export function AccountPanel() {
  const { lang, t } = useI18n();
  const { data: session, isPending } = useSession();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    authClient
      .listAccounts()
      .then(({ data }) => setHasPassword(data?.some((item) => item.providerId === 'credential') ?? false))
      .catch(() => setHasPassword(false));
  }, [userId]);

  if (deleted) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="p-guru max-w-md">{t.accountDeleted}</p>
        <Link href={routes.home(lang)} className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950">
          {t.home}
        </Link>
      </div>
    );
  }

  if (isPending) return <Loader label={t.loading} />;

  if (!session) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <Link href={routes.login(lang, routes.account(lang))} className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950">
          {t.login}
        </Link>
      </div>
    );
  }

  const { user } = session;
  const canDelete =
    confirmText.trim().toUpperCase() === t.deleteAccountConfirmWord && hasPassword !== null && (!hasPassword || password.length > 0);

  const deleteAccount = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canDelete) return;
    setDeleting(true);
    setError(null);
    const { error: deleteError } = await authClient.deleteUser(hasPassword ? { password } : {});
    setDeleting(false);
    if (!deleteError) {
      setDeleted(true);
      return;
    }
    if (deleteError.code === 'INVALID_PASSWORD') setError(t.deleteAccountWrongPassword);
    else if (deleteError.status === 403 || deleteError.code === 'SESSION_EXPIRED') setError(t.deleteAccountReauth);
    else setError(t.genericError);
  };

  return (
    <section className="mx-auto max-w-2xl animate-fade-in-up pb-16">
      <h1 className="h1-guru pt-4 md:pt-8">{t.account}</h1>
      <p className="p-guru mt-2 mb-8">{t.accountSubtitle}</p>

      <dl className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold text-slate-500 uppercase">{t.accountName}</dt>
          <dd className="mt-1 truncate text-white">{user.name || '—'}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-slate-500 uppercase">{t.accountEmail}</dt>
          <dd className="mt-1 truncate text-white">{user.email}</dd>
        </div>
      </dl>

      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link href={routes.taste(lang)} className="font-semibold text-secondary hover:underline">
          {t.myTaste}
        </Link>
        <Link href={routes.privacy(lang)} className="font-semibold text-secondary hover:underline">
          {t.privacyTitle}
        </Link>
      </p>

      <form onSubmit={deleteAccount} className="mt-10 flex flex-col gap-4 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
        <h2 className="text-xl font-bold text-red-300">{t.deleteAccount}</h2>
        <p className="text-sm text-slate-300">{t.deleteAccountBody}</p>

        {hasPassword && (
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
            {t.deleteAccountPassword}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-300">
          {t.deleteAccountConfirmLabel}
          <input
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            autoComplete="off"
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!canDelete || deleting}
          className="self-start rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? t.loading : t.deleteAccountButton}
        </button>
      </form>
    </section>
  );
}
