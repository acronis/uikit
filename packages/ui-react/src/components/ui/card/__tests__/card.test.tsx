import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Card, CardContent, CardFooter, CardHeader } from '../card';

describe('Card', () => {
  it('renders a composed card with all parts', () => {
    render(
      <Card data-testid="card">
        <CardHeader
          title="Backup status"
          description="Last run 5 minutes ago"
          hasDescription
        />
        <CardContent>All workloads protected.</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Backup status')).toBeInTheDocument();
    expect(screen.getByText('Last run 5 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('All workloads protected.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('drives the surface, text, and border from the shared semantic tokens', () => {
    render(<Card data-testid="card">body</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toContain(
      'bg-[var(--ui-background-surface-primary)]'
    );
    expect(card.className).toContain(
      'text-[var(--ui-text-on-surface-primary)]'
    );
    expect(card.className).toContain(
      'border-[var(--ui-border-on-surface-border)]'
    );
  });

  it('switches the border token when hasError is set', () => {
    render(
      <Card data-testid="card" hasError>
        body
      </Card>
    );
    expect(screen.getByTestId('card').className).toContain(
      'border-[var(--ui-border-on-surface-border-error)]'
    );
  });

  it('merges a custom className without dropping the base classes', () => {
    render(
      <Card data-testid="card" className="custom-class">
        body
      </Card>
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('rounded-lg');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>body</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardHeader', () => {
  it('renders the title by default', () => {
    render(<CardHeader />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('hides the description unless hasDescription is set', () => {
    render(<CardHeader description="Hidden" />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('shows the description when hasDescription is set', () => {
    render(<CardHeader description="Visible" hasDescription />);
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('does not render a drag handle by default', () => {
    render(<CardHeader />);
    expect(
      screen.queryByRole('img', { name: 'Reorder' })
    ).not.toBeInTheDocument();
  });

  it('renders a drag handle when isDraggable is set', () => {
    render(<CardHeader isDraggable dragHandleLabel="Drag" />);
    expect(screen.getByRole('img', { name: 'Drag' })).toBeInTheDocument();
  });

  it('renders a toggle switch when isSwitchable is set', async () => {
    const user = userEvent.setup();
    const onSwitchCheckedChange = vi.fn();
    render(
      <CardHeader
        isSwitchable
        switchLabel="Enable"
        onSwitchCheckedChange={onSwitchCheckedChange}
      />
    );
    const toggle = screen.getByRole('switch', { name: 'Enable' });
    await user.click(toggle);
    expect(onSwitchCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('renders an avatar with initials when hasAvatar is set', () => {
    render(<CardHeader hasAvatar avatarLabel="SB" />);
    expect(screen.getByText('SB')).toBeInTheDocument();
  });

  it('renders a rename button and fires onRename when hasRename is set', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(
      <CardHeader hasRename onRename={onRename} renameLabel="Rename card" />
    );
    await user.click(screen.getByRole('button', { name: 'Rename card' }));
    expect(onRename).toHaveBeenCalledOnce();
  });

  it('renders extras next to the title and actions at the end', () => {
    render(
      <CardHeader
        extras={<span>Beta</span>}
        actions={<button type="button">Menu</button>}
      />
    );
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Body content</CardContent>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});
