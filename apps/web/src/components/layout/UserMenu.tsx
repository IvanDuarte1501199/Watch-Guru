'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, LogOut, MailWarning, SlidersHorizontal } from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

export function UserMenu() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (isPending) return <span className="h-8 w-8 animate-pulse rounded-full bg-slate-800" aria-hidden />;

  if (!session) {
    const onAuthPage = pathname.endsWith('/login') || pathname.endsWith('/signup');
    return (
      <Link
        href={routes.login(lang, onAuthPage ? undefined : pathname)}
        className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold whitespace-nowrap text-slate-950 transition hover:bg-secondary/90 md:text-sm"
      >
        {t.login}
      </Link>
    );
  }

  const { user } = session;
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  const sendVerification = async () => {
    await authClient.sendVerificationEmail({ email: user.email, callbackURL: pathname }).catch(() => undefined);
    setVerificationSent(true);
  };

  const signOut = async () => {
    setOpen(false);
    await authClient.signOut();
    router.refresh();
  };

  const itemClass = 'flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 transition hover:bg-slate-900 hover:text-secondary';

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t.accountMenu}
        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-secondary/50 bg-tertiary text-sm font-bold text-white transition hover:border-secondary"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-11 right-0 z-50 w-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/95 py-1 shadow-2xl backdrop-blur-lg"
        >
          <p className="truncate border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
            {format(t.hello, { name: user.name || user.email })}
          </p>
          {!user.emailVerified && (
            <button
              role="menuitem"
              type="button"
              disabled={verificationSent}
              onClick={sendVerification}
              className={`${itemClass} w-full text-left text-amber-300 disabled:text-slate-400`}
            >
              <MailWarning className="h-4 w-4 shrink-0" aria-hidden />
              {verificationSent ? t.verificationSent : t.verifyEmail}
            </button>
          )}
          <Link role="menuitem" href={routes.myList(lang)} onClick={() => setOpen(false)} className={itemClass}>
            <Bookmark className="h-4 w-4" aria-hidden />
            {t.myList}
          </Link>
          <Link role="menuitem" href={routes.taste(lang)} onClick={() => setOpen(false)} className={itemClass}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            {t.myTaste}
          </Link>
          <button role="menuitem" type="button" onClick={signOut} className={`${itemClass} w-full border-t border-slate-800`}>
            <LogOut className="h-4 w-4" aria-hidden />
            {t.logout}
          </button>
        </div>
      )}
    </div>
  );
}
