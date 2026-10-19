import 'katex/dist/katex.min.css';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { BRAND, TAGLINE, THEME_COOKIE } from '@/lib/brand';

export const metadata: Metadata = {
  title: { default: `${BRAND} · Cambridge AS & A Level`, template: `%s · ${BRAND}` },
  description: TAGLINE,
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f7f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0f' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Theme comes from a cookie and is rendered on <html>, so there is no flash and no inline script.
  const theme = (await cookies()).get(THEME_COOKIE)?.value;
  return (
    <html lang="en-GB" data-theme={theme === 'light' || theme === 'dark' ? theme : undefined}>
      <body>{children}</body>
    </html>
  );
}
