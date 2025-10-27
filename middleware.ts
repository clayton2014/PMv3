
import { NextRequest, NextResponse } from 'next/server';

function pickLocale(req: NextRequest): 'pt' | 'en' {
  const al = req.headers.get('accept-language') || '';
  if (/\bpt\b|pt-BR|pt-PT/i.test(al)) return 'pt';
  if (/\ben\b|en-US|en-GB/i.test(al)) return 'en';
  const country = req.headers.get('x-vercel-ip-country') || '';
  if (/^(BR|PT)$/i.test(country)) return 'pt';
  return 'en';
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const langCookie = req.cookies.get('lang')?.value as 'pt' | 'en' | undefined;
  const chosen = langCookie || pickLocale(req);
  if (langCookie !== chosen) {
    res.cookies.set('lang', chosen, { path: '/', sameSite: 'lax', maxAge: 60*60*24*365 });
  }
  return res;
}
