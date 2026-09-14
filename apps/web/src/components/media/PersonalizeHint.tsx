'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

/** Invites viewers to personalize random picks, or confirms they already are. */
export function PersonalizeHint() {
  const { lang, t } = useI18n();
  const { data: session, isPending } = useSession();
  const [hasTaste, setHasTaste] = useState<boolean | null>(null);
  const userId = session?.user.id;

  useEffect(() => {
    if (!userId) return;
    api
      .taste()
      .then((taste) => setHasTaste(Boolean(taste)))
      .catch(() => setHasTaste(false));
  }, [userId]);

  if (isPending || (userId && hasTaste === null)) return null;

  const href = userId ? routes.taste(lang) : routes.signup(lang, routes.taste(lang));
  return (
    <p className="mt-2 text-sm">
      {userId && hasTaste && <span className="text-slate-400">{t.personalizedOn} </span>}
      <Link href={href} className="font-semibold text-secondary hover:underline">
        {userId && hasTaste ? t.editTaste : t.personalizeCta} &rarr;
      </Link>
    </p>
  );
}
