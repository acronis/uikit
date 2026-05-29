import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import { Toaster } from '@/components/Toaster';
import './globals.css';
import 'fumadocs-ui/style.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider search={{ options: { type: 'static' } }}>
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
