"use client";

import React, { createContext, useContext, useSyncExternalStore, useMemo } from "react";
import type { Dictionary, Locale } from "./types";
import { dictionaries } from "./dictionaries";

interface LanguageContextValue {
  lang: Locale;
  setLang: (locale: Locale) => void;
  t: Dictionary;
}

const STORAGE_KEY = "nexa_preferred_locale";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

let cachedLocale: Locale = "ID";

function getSnapshot(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ID" || saved === "EN") {
      cachedLocale = saved;
      return saved;
    }
  } catch {
    // Ignore localStorage access errors (e.g. sandboxed iframe / SSR)
  }
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return "ID";
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ID",
  setLang: () => {},
  t: dictionaries.ID,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = (nextLocale: Locale) => {
    cachedLocale = nextLocale;
    try {
      localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // Ignore
    }
    listeners.forEach((listener) => listener());
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: dictionaries[lang] || dictionaries.ID,
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

