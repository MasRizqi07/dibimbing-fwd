"use client";

import React, { createContext, useContext, useSyncExternalStore, useMemo, useCallback } from "react";
import type { Dictionary, Locale } from "./types";
import { dictionaries } from "./dictionaries";
import { useRouter } from "next/navigation";

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
    const saved = document.cookie.split("; ").find((item) => item.startsWith("nexa_locale="))?.split("=")[1];
    if (saved === "ID" || saved === "EN") {
      cachedLocale = saved;
      return saved;
    }
  } catch {
    // Ignore localStorage access errors (e.g. sandboxed iframe / SSR)
  }
  return cachedLocale;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "ID",
  setLang: () => {},
  t: dictionaries.ID,
});

export function LanguageProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  const router = useRouter();
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => initialLocale);

  const setLang = useCallback((nextLocale: Locale) => {
    cachedLocale = nextLocale;
    try {
      document.cookie = `nexa_locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
      localStorage.setItem(STORAGE_KEY, nextLocale);
    } catch {
      // Ignore
    }
    listeners.forEach((listener) => listener());
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: dictionaries[lang] || dictionaries.ID,
    }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

