import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  AuthLayout,
  AuthLayoutCard,
  AuthLayoutFooter,
  AuthLayoutLogo,
} from '../index';

describe('AuthLayout', () => {
  it('renders the centered card with logo, content, and footer', () => {
    const { container } = render(
      <AuthLayout>
        <AuthLayoutCard>
          <AuthLayoutLogo>Acronis</AuthLayoutLogo>
          <h1>Sign in</h1>
          <AuthLayoutFooter>Need help?</AuthLayoutFooter>
        </AuthLayoutCard>
      </AuthLayout>
    );
    expect(container.querySelector('[data-slot="auth-layout"]')).toBeInTheDocument();
    const card = container.querySelector('[data-slot="auth-layout-card"]')!;
    expect(card.className).toContain('max-w-sm');
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Need help?')).toHaveClass('text-muted-foreground');
  });

  it('merges a custom className on the card', () => {
    const { container } = render(
      <AuthLayout>
        <AuthLayoutCard className="max-w-md">x</AuthLayoutCard>
      </AuthLayout>
    );
    expect(container.querySelector('[data-slot="auth-layout-card"]')).toHaveClass('max-w-md');
  });
});
