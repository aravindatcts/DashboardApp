import '../styles/globals.scss';
import I18nProvider from '@/components/I18nProvider';
import DescopeProvider from '@/components/DescopeProvider';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: { default: 'Member Portal', template: '%s | Member Portal' },
  description: 'America Health Insurance Member Portal — manage your plans, claims, and providers.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DescopeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </DescopeProvider>
      </body>
    </html>
  );
}
