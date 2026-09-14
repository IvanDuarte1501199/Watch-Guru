import 'server-only';
import { lang } from 'next/root-params';
import { defaultLocale, hasLocale, type Locale } from './config';

/** Current locale for Server Components that don't receive `params` (not-found, loading). */
export async function currentLocale(): Promise<Locale> {
  const value = await lang();
  return value && hasLocale(value) ? value : defaultLocale;
}
