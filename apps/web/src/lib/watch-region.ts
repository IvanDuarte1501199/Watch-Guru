'use client';

/* The viewer's country for streaming availability, remembered per browser. */

const STORAGE_KEY = 'watchRegion';

export const isCountryCode = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Z]{2}$/.test(value);

function readStoredCountry(): string | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isCountryCode(stored) ? stored : null;
  } catch {
    return null; // Storage can be unavailable (private mode).
  }
}

export function storeCountry(code: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Ignore storage failures; the choice still applies to this page.
  }
}

/** Saved choice → geo-IP country from the host → browser language region. */
export async function detectCountry(): Promise<string | null> {
  const stored = readStoredCountry();
  if (stored) return stored;

  try {
    const response = await fetch('/api/geo');
    const { country } = (await response.json()) as { country: unknown };
    if (isCountryCode(country)) {
      storeCountry(country);
      return country;
    }
  } catch {
    // Fall through to the browser language.
  }

  // Browser regions can be non-country codes such as "es-419" (Latin America).
  return (
    navigator.languages
      .map((language) => language.split('-')[1]?.toUpperCase())
      .find(isCountryCode) ?? null
  );
}
