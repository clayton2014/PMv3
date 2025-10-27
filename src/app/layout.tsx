
import './globals.css';
import { I18nProvider } from '@/i18n';
import { headers } from 'next/headers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const h = headers();
  const cookie = h.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  const initial = (m ? decodeURIComponent(m[1]) : 'pt') as 'pt'|'en';
  return (
    <html lang={initial}>
      <body>
        {/* @ts-expect-error Server Component to Client Provider boundary */}
        <I18nProvider initialLocale={initial}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
