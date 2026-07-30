'use client';

import {
  AuthLayout,
  AuthLayoutCard,
  AuthLayoutFooter,
  AuthLayoutLogo,
  Button,
  InputText,
} from '@acronis-platform/ui-react';

export function AuthLayoutDemo() {
  return (
    <div
      style={{ height: 520 }}
      className="w-full rounded-md bg-[var(--ui-background-surface-secondary)]"
    >
      <AuthLayout className="h-full min-h-0">
        <AuthLayoutCard>
          <AuthLayoutLogo>
            <h1 className="text-base font-semibold">Sign in</h1>
          </AuthLayoutLogo>
          <div className="flex flex-col gap-4">
            <InputText label="Email" type="email" placeholder="you@example.com" />
            <InputText label="Password" type="password" />
            <Button className="w-full">Sign in</Button>
          </div>
          <AuthLayoutFooter>
            <a className="underline underline-offset-4" href="#">
              Forgot password?
            </a>
          </AuthLayoutFooter>
        </AuthLayoutCard>
      </AuthLayout>
    </div>
  );
}
