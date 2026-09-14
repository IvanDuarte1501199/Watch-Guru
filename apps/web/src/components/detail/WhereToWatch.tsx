'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { tmdbImage } from '@/lib/tmdb/images';
import type { Provider, ProvidersByCountry } from '@/lib/tmdb/types';

const STORAGE_KEY = 'watchRegion';
const isCountryCode = (value: unknown): value is string => typeof value === 'string' && /^[A-Z]{2}$/.test(value);

function readStoredCountry(): string | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isCountryCode(stored) ? stored : null;
  } catch {
    return null; // Storage can be unavailable (private mode).
  }
}

function storeCountry(code: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Ignore storage failures; the choice still applies to this page.
  }
}

async function detectCountry(): Promise<string | null> {
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

interface WhereToWatchProps {
  providers: ProvidersByCountry;
  countryNames: Record<string, string>;
  defaultCountry: string;
}

function ProviderGroup({ label, providers }: { label: string; providers?: Provider[] }) {
  if (!providers?.length) return null;
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-300">{label}</h3>
      <ul className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <li key={provider.provider_id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tmdbImage(provider.logo_path, 'w92') ?? ''}
              alt={provider.provider_name}
              title={provider.provider_name}
              loading="lazy"
              className="h-12 w-12 rounded-lg shadow"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhereToWatch({ providers, countryNames, defaultCountry }: WhereToWatchProps) {
  const { t, lang } = useI18n();
  const codes = Object.keys(providers).sort((a, b) =>
    (countryNames[a] ?? a).localeCompare(countryNames[b] ?? b, lang),
  );
  const [country, setCountry] = useState(defaultCountry);

  // The server renders the locale's default region; once in the browser we
  // switch to the viewer's saved choice, their geo-IP country or browser region.
  useEffect(() => {
    let cancelled = false;
    detectCountry().then((detected) => {
      if (!cancelled && detected && detected !== defaultCountry) setCountry(detected);
    });
    return () => {
      cancelled = true;
    };
  }, [defaultCountry]);

  if (codes.length === 0) return null;

  const handleChange = (code: string) => {
    setCountry(code);
    storeCountry(code);
  };

  const options = codes.includes(country) ? codes : [country, ...codes];
  const available = providers[country];

  return (
    <section className="w-full max-w-2xl rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 backdrop-blur-sm md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="h2-guru">{t.whereToWatch}</h2>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          {t.selectCountry}
          <select
            value={country}
            onChange={(event) => handleChange(event.target.value)}
            className="max-w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white focus:border-secondary focus:outline-none"
          >
            {options.map((code) => (
              <option key={code} value={code}>
                {countryNames[code] ?? code}
              </option>
            ))}
          </select>
        </label>
      </div>

      {available ? (
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:gap-10">
          <ProviderGroup label={t.stream} providers={available.flatrate} />
          <ProviderGroup label={t.rent} providers={available.rent} />
          <ProviderGroup label={t.buy} providers={available.buy} />
        </div>
      ) : (
        <p className="text-sm text-slate-400">{t.notAvailableInCountry}</p>
      )}

      <p className="mt-4 text-xs text-slate-500">{t.providersAttribution}</p>
    </section>
  );
}
