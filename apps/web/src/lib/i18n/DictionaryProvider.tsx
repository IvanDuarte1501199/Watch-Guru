'use client';

import { createContext, useContext } from 'react';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries/es';

type I18nContextValue = { lang: Locale; t: Dictionary };

const I18nContext = createContext<I18nContextValue | null>(null);

export function DictionaryProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ lang, t: dictionary }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <DictionaryProvider>');
  return value;
}
