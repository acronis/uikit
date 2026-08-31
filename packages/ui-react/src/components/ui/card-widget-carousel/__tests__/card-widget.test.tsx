import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { CardWidget } from '../card-widget';

describe('CardWidget', () => {
  it('renders header, title, description, metric, and caption', () => {
    render(
      <CardWidget
        header="Widget header"
        title="Insight title"
        description="Some detail"
        metric="$15K"
        caption="Annual savings"
      />
    );
    expect(screen.getByText('Widget header')).toBeInTheDocument();
    expect(screen.getByText('Insight title')).toBeInTheDocument();
    expect(screen.getByText('Some detail')).toBeInTheDocument();
    expect(screen.getByText('$15K')).toBeInTheDocument();
    expect(screen.getByText('Annual savings')).toBeInTheDocument();
  });

  it('renders skeleton and hides body content', () => {
    render(
      <CardWidget
        skeleton
        title="Should not appear"
        description="Should not appear"
        metric="0"
        caption="Should not appear"
      />
    );
    expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
  });

  it('renders the skeleton loading indicator', () => {
    render(<CardWidget skeleton />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  it('renders the footer slot', () => {
    render(<CardWidget footer={<button>Review</button>} />);
    expect(screen.getByRole('button', { name: 'Review' })).toBeInTheDocument();
  });

  it('hides the footer when not provided', () => {
    const { container } = render(<CardWidget />);
    expect(container.querySelector('.border-t')).toBeNull();
  });

  it('hides the header when not provided', () => {
    render(<CardWidget />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders the icon inside the status box when not skeleton', () => {
    render(<CardWidget icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('hides the icon glyph (but keeps the colored box) in skeleton mode', () => {
    render(<CardWidget data-testid="item" icon={<svg data-testid="icon" />} skeleton />);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    expect(
      screen.getByTestId('item').querySelector<HTMLElement>('[style*="background"]')
    ).toBeInTheDocument();
  });

  it('forwards the ref to the root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardWidget ref={ref} />);
    expect(ref.current?.tagName).toBe('DIV');
  });

  it('applies a custom className', () => {
    render(<CardWidget data-testid="item" className="custom" />);
    expect(screen.getByTestId('item')).toHaveClass('custom');
  });

  it.each(['danger', 'warning', 'info'] as const)(
    'applies the correct CSS variable for status %s',
    (status) => {
      render(<CardWidget data-testid="item" status={status} />);
      const iconBox = screen
        .getByTestId('item')
        .querySelector<HTMLElement>('[style*="background"]');
      expect(iconBox?.style.background).toContain(`--ui-background-status-${status}`);
      expect(iconBox?.style.color).toContain(`--ui-glyph-on-status-${status}`);
    }
  );

  it('skeleton bars use the card status background color', () => {
    render(<CardWidget data-testid="item" status="danger" skeleton />);
    const bars = screen
      .getByTestId('item')
      .querySelectorAll<HTMLElement>('[aria-label="Loading"] > div');
    expect(bars.length).toBe(4);
    bars.forEach((bar) => {
      expect(bar.style.background).toContain('--ui-background-status-danger');
    });
  });
});
