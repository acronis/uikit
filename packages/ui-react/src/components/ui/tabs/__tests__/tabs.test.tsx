import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

function AccountTabs(props: { defaultValue?: string } = {}) {
  return (
    <Tabs defaultValue={props.defaultValue ?? 'account'}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account panel</TabsContent>
      <TabsContent value="password">Password panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders tabs and shows the default panel', () => {
    render(<AccountTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByText('Account panel')).toBeVisible();
  });

  it('marks the active tab with data-active and aria-selected', () => {
    render(<AccountTabs />);
    const active = screen.getByRole('tab', { name: 'Account' });
    expect(active).toHaveAttribute('data-active');
    expect(active).toHaveAttribute('aria-selected', 'true');
    expect(active).toHaveClass('data-[active]:bg-secondary');
  });

  it('switches panels when another tab is activated', async () => {
    const user = userEvent.setup();
    render(<AccountTabs />);
    await user.click(screen.getByRole('tab', { name: 'Password' }));
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute(
      'data-active'
    );
    expect(screen.getByText('Password panel')).toBeVisible();
  });

  it('supports keyboard navigation between tabs (arrow moves focus, Enter activates)', async () => {
    const user = userEvent.setup();
    render(<AccountTabs />);
    await user.click(screen.getByRole('tab', { name: 'Account' }));
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute(
      'data-active'
    );
  });

  it('forwards the ref to the list element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs defaultValue="a">
        <TabsList ref={ref}>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
