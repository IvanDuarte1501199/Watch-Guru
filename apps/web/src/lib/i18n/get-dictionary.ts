import 'server-only';
import type { Locale } from './config';
import type { Dictionary } from './dictionaries/es';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import('./dictionaries/es').then((module) => module.default),
  en: () => import('./dictionaries/en').then((module) => module.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => dictionaries[locale]();

export type { Dictionary };
