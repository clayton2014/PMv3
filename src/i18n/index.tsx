
'use client';
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

type Dict = Record<string, string>;
type Locale = 'pt' | 'en';

const I18nContext = createContext<{ locale: Locale; t: (k: string) => string; setLocale: (l: Locale) => void; }>({
  locale: 'pt',
  t: (k) => k,
  setLocale: () => {},
});

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop() as string) : null;
}
function writeCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
}

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || 'pt');
  const [dict, setDict] = useState<Dict>({});
  useEffect(() => {
    const fromCookie = (readCookie('lang') as Locale) || initialLocale || 'pt';
    setLocaleState(fromCookie);
  }, [initialLocale]);

  useEffect(() => {
    async function load() {
      const mod = await import(`./locales/${locale}.ts`);
      setDict(mod.default as Dict);
    }
    load();
    writeCookie('lang', locale);
    try { localStorage.setItem('lang', locale); } catch {}
  }, [locale]);

  const t = useMemo(() => (k: string) => dict[k] ?? k, [dict]);

  const setLocale = (l: Locale) => setLocaleState(l);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
