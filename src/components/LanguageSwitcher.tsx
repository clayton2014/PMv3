
'use client';
import * as React from 'react';
import { useI18n } from '@/i18n';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  function change(l: 'pt'|'en') {
    setLocale(l);
    try {
      document.cookie = `lang=${encodeURIComponent(l)}; path=/; SameSite=Lax; max-age=${60*60*24*365}`;
      localStorage.setItem('lang', l);
    } catch {}
    router.refresh?.();
  }

  return (
    <div className={className}>
      <label htmlFor="lang-select" className="sr-only">{t('lang.choose')}</label>
      <select
        id="lang-select"
        className="border rounded px-2 py-1 bg-background"
        value={locale}
        onChange={(e) => change(e.target.value as 'pt'|'en')}
        aria-label={t('lang.choose')}
      >
        <option value="pt">{t('lang.portuguese')}</option>
        <option value="en">{t('lang.english')}</option>
      </select>
    </div>
  );
}
