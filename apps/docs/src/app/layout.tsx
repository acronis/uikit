import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Toaster } from '@/components/Toaster';
import './globals.css';
import 'fumadocs-ui/style.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider
          search={{
            options: {
              type: 'static',
              api: `${process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? ''}/api/search`,
            },
          }}
        >
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
