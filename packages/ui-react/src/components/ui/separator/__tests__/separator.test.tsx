import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from '../separator';

describe('Separator', () => {
  it('renders with the separator role and the divider token', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('bg-[var(--ui-border-on-surface-divider)]', 'h-px', 'w-full');
  });

  it('switches dimensions for the vertical orientation', () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('h-full', 'w-px');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies no surrounding spacing for the default S1 size', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).not.toHaveClass('my-[var(--ui-gap-4)]', 'my-[var(--ui-gap-8)]');
  });

  it('applies the S2/S3 spacing tokens for horizontal separators', () => {
    render(<Separator data-testid="sep-s2" size="S2" />);
    expect(screen.getByTestId('sep-s2')).toHaveClass('my-[var(--ui-gap-4)]');

    render(<Separator data-testid="sep-s3" size="S3" />);
    expect(screen.getByTestId('sep-s3')).toHaveClass('my-[var(--ui-gap-8)]');
  });

  it('applies the S2/S3 spacing tokens for vertical separators', () => {
    render(<Separator data-testid="sep-s2" orientation="vertical" size="S2" />);
    expect(screen.getByTestId('sep-s2')).toHaveClass('mx-[var(--ui-gap-4)]');

    render(<Separator data-testid="sep-s3" orientation="vertical" size="S3" />);
    expect(screen.getByTestId('sep-s3')).toHaveClass('mx-[var(--ui-gap-8)]');
  });

  it('merges a custom className', () => {
    render(<Separator data-testid="sep" className="my-4" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveClass('my-4', 'bg-[var(--ui-border-on-surface-divider)]');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
