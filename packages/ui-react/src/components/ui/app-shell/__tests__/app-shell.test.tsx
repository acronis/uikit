import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  AppShell,
  AppShellBody,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  AppShellSidebar,
} from '../index';

describe('AppShell', () => {
  it('renders the slots with their landmark elements', () => {
    const { container } = render(
      <AppShell>
        <AppShellSidebar>nav</AppShellSidebar>
        <AppShellBody>
          <AppShellHeader>header</AppShellHeader>
          <AppShellMain>main</AppShellMain>
          <AppShellFooter>footer</AppShellFooter>
        </AppShellBody>
      </AppShell>
    );
    expect(container.querySelector('[data-slot="app-shell"]')).toBeInTheDocument();
    expect(container.querySelector('aside[data-slot="app-shell-sidebar"]')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveTextContent('header');
    expect(screen.getByRole('main')).toHaveTextContent('main');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('footer');
  });

  it('forwards refs and merges className', () => {
    const { container } = render(
      <AppShell className="custom-shell">
        <AppShellMain>x</AppShellMain>
      </AppShell>
    );
    expect(container.querySelector('[data-slot="app-shell"]')).toHaveClass(
      'custom-shell'
    );
  });
});
