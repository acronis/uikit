import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyOverlay } from '../empty-overlay';

describe('EmptyOverlay', () => {
  it('renders the title as a level-3 heading', () => {
    render(<EmptyOverlay title="No object yet" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'No object yet' })
    ).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<EmptyOverlay title="No object yet" description="Short description." />);
    expect(screen.getByText('Short description.')).toBeInTheDocument();
  });

  it('omits the description when not provided', () => {
    render(<EmptyOverlay title="No object yet" />);
    expect(screen.queryByText('Short description.')).not.toBeInTheDocument();
  });

  it('renders the icon badge only when an icon is provided', () => {
    const { rerender } = render(
      <EmptyOverlay title="No object yet" icon={<svg data-testid="icon" />} />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();

    rerender(<EmptyOverlay title="No object yet" />);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('applies the requested badge color', () => {
    render(
      <EmptyOverlay
        title="No object yet"
        icon={<svg data-testid="icon" />}
        color="blue"
      />
    );
    expect(screen.getByTestId('icon').parentElement).toHaveClass(
      'bg-[var(--ui-avatar-color-blue)]'
    );
  });

  it('defaults the badge color to green', () => {
    render(<EmptyOverlay title="No object yet" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon').parentElement).toHaveClass(
      'bg-[var(--ui-avatar-color-green)]'
    );
  });

  it('fills its container by default', () => {
    render(<EmptyOverlay data-testid="overlay" title="No object yet" />);
    expect(screen.getByTestId('overlay')).toHaveClass('size-full');
  });

  it('merges a custom className without dropping base classes', () => {
    render(
      <EmptyOverlay data-testid="overlay" title="No object yet" className="custom" />
    );
    const el = screen.getByTestId('overlay');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('size-full');
  });

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyOverlay ref={ref} title="No object yet" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
