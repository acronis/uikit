import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../card';

describe('Card', () => {
  it('renders a composed card with all parts', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Backup status</CardTitle>
          <CardDescription>Last run 5 minutes ago</CardDescription>
        </CardHeader>
        <CardContent>All workloads protected.</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Backup status')).toBeInTheDocument();
    expect(screen.getByText('Last run 5 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('All workloads protected.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('drives the surface, text, and border from the bridged semantic tokens', () => {
    render(<Card data-testid="card">body</Card>);
    // No `--ui-card-*` tier exists yet — the card surface/text/border resolve to
    // the shared semantic tokens via the bridged Tailwind names.
    expect(screen.getByTestId('card')).toHaveClass(
      'bg-background',
      'text-foreground',
      'border-border'
    );
  });

  it('renders the description with the muted-foreground token', () => {
    render(<CardDescription>helper</CardDescription>);
    expect(screen.getByText('helper')).toHaveClass('text-muted-foreground');
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

  it('composes onto a custom element via the render prop', () => {
    render(<CardTitle render={<h2 />}>Section title</CardTitle>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Section title');
    expect(heading).toHaveClass('text-2xl');
  });
});
