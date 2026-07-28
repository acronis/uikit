import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SvgIcon } from '../lib/svg-icon';

// design-assets can declare distinct artwork per size (its own `$file`/`$from`);
// the generator emits one entry in `sizes` per design-defined variant, and
// SvgIcon must render the one matching the requested size — never the canonical
// scaled. No production icon exercises this yet, so it is covered here directly.
const SIZES = {
  16: { inner: <path data-variant="sixteen" d="M0 0h16" />, w: '16', h: '16' },
  24: { inner: <path data-variant="twentyfour" d="M0 0h24" />, w: '24', h: '24' },
};

function pathVariant(container: HTMLElement): string | null {
  return container.querySelector('path')?.getAttribute('data-variant') ?? null;
}

describe('SvgIcon per-size artwork', () => {
  it('renders the canonical (default) artwork when no size is given', () => {
    const { container } = render(<SvgIcon sizes={SIZES} defaultSize={24} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '24');
    expect(pathVariant(container)).toBe('twentyfour');
  });

  it('renders the size-specific artwork (not the canonical scaled)', () => {
    const { container } = render(<SvgIcon size={16} sizes={SIZES} defaultSize={24} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    expect(pathVariant(container)).toBe('sixteen');
  });

  it('lifts a uniform stroke width to the root and forwards ref + a title', () => {
    const ref = createRef<SVGSVGElement>();
    const sizes = {
      24: { inner: <path d="M0 0h24" />, w: '24', h: '24', strokeWidth: '2' },
    };
    const { container, getByText } = render(
      <SvgIcon ref={ref} title="Widget" sizes={sizes} defaultSize={24} />
    );
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Widget');
    expect(getByText('Widget').tagName.toLowerCase()).toBe('title');
    expect(ref.current).toBe(svg);
  });
});
