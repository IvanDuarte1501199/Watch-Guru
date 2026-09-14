'use client';

import { useSyncExternalStore } from 'react';

export type AdConsent = 'granted' | 'denied';

const STORAGE_KEY = 'wg-ad-consent';
const listeners = new Set<() => void>();
let memory: AdConsent | null = null;

function read(): AdConsent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function setAdConsent(value: AdConsent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the choice lasts for this page view only.
    memory = value;
  }
  listeners.forEach((listener) => listener());
}

/** `undefined` while rendering on the server, `null` until the visitor chooses. */
export function useAdConsent(): AdConsent | null | undefined {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => read() ?? memory,
    () => undefined,
  );
}
