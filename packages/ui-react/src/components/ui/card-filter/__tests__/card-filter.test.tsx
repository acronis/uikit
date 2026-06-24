import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CardFilter } from '../card-filter';

const Icon = () => (
  <svg data-testid="icon" aria-hidden="true" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" />
  </svg>
);

describe('CardFilter', () => {
  it('renders the label and value', () => {
    render(<CardFilter label="Total assets" value="125" />);
    expect(screen.getByText('Total assets')).toBeInTheDocument();
    expect(screen.getByText('125')).toBeInTheDocument();
  });

  it('defaults to the static (presentational) variant — not a button', () => {
    render(<CardFilter label="Total assets" value="125" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('125')).toHaveClass(
      'text-[var(--ui-card-filter-static-value-color-idle)]'
    );
  });

  it('renders a button with the clickable value color for variant="clickable"', () => {
    render(<CardFilter variant="clickable" label="Filters" value="3" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('3')).toHaveClass(
      'text-[var(--ui-card-filter-clickable-value-color)]'
    );
  });

  it('shows an em-dash and hides the icon for variant="static-empty"', () => {
    render(
      <CardFilter variant="static-empty" label="Pending" value="9" icon={<Icon />} />
    );
    // The provided value is ignored in favor of the placeholder.
    expect(screen.queryByText('9')).not.toBeInTheDocument();
    expect(screen.getByText('–')).toHaveClass(
      'text-[var(--ui-card-filter-static-value-color-disabled)]'
    );
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('renders the icon before the value when provided', () => {
    render(<CardFilter label="Total" value="1" icon={<Icon />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('fires onClick when the clickable card is pressed', async () => {
    const onClick = vi.fn();
    render(
      <CardFilter variant="clickable" label="Filters" value="3" onClick={onClick} />
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('merges a custom className with the base classes', () => {
    render(<CardFilter label="Total" value="1" className="custom-class" />);
    expect(screen.getByText('Total').parentElement).toHaveClass('custom-class');
  });

  it('forwards the ref to the underlying element', () => {
    const ref = createRef<HTMLElement>();
    render(<CardFilter variant="clickable" label="Filters" value="3" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <CardFilter
        variant="clickable"
        label="Alerts"
        value="12"
        render={<a href="/alerts" />}
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/alerts');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
