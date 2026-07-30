import { createRef } from 'react';
import { SquareDashedIcon } from '@acronis-platform/icons-react/stroke-mono';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TagIcon } from '../tag-icon';

describe('TagIcon', () => {
  it('stays presentational by default (no role, no tab stop, no text)', () => {
    const { container } = render(<TagIcon icon={<SquareDashedIcon />} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root.textContent).toBe('');
  });

  it('renders the icon passed to the icon slot', () => {
    const { container } = render(
      <TagIcon icon={<svg data-testid="glyph" />} />
    );
    expect(screen.getByTestId('glyph')).toBeInTheDocument();
    expect(container.firstElementChild?.firstElementChild).toBe(
      screen.getByTestId('glyph')
    );
  });

  it('renders an empty badge when no icon is given', () => {
    const { container } = render(<TagIcon />);
    expect(container.firstElementChild?.childElementCount).toBe(0);
  });

  it('applies the default color (violet) tokens', () => {
    const { container } = render(<TagIcon icon={<SquareDashedIcon />} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('bg-[var(--ui-avatar-color-violet)]');
    expect(root.className).toContain('text-[var(--ui-avatar-label-color-violet)]');
  });

  it('applies the requested color variant', () => {
    const { container } = render(
      <TagIcon color="violet" icon={<SquareDashedIcon />} />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('bg-[var(--ui-avatar-color-violet)]');
    expect(root.className).toContain('text-[var(--ui-avatar-label-color-violet)]');
  });

  it('is a 32px box with the tokenized 8px padding and a 16px glyph', () => {
    // Figma binds the padding to `gap/gap-8` (-> --ui-gap-8); the 32px box and
    // the 8px radius have no tokens-pd token, so they use the Tailwind scale.
    const { container } = render(<TagIcon icon={<SquareDashedIcon />} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('size-8');
    expect(root.className).toContain('p-[var(--ui-gap-8)]');
    expect(root.className).toContain('rounded-lg');
    expect(root.className).toContain('[&_svg]:size-4');
  });

  it('uses no physical directional utility (RTL-safe)', () => {
    const { container } = render(<TagIcon icon={<SquareDashedIcon />} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).not.toMatch(/(^|\s|:)(ml|mr|pl|pr|left|right)-/);
  });

  it('forwards arbitrary span attributes, so consumers can label it', () => {
    render(<TagIcon role="img" aria-label="Draft" icon={<SquareDashedIcon />} />);
    expect(screen.getByRole('img', { name: 'Draft' })).toBeInTheDocument();
  });

  it('merges a custom className', () => {
    const { container } = render(<TagIcon className="custom-x" />);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'custom-x'
    );
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<TagIcon ref={ref} icon={<SquareDashedIcon />} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
