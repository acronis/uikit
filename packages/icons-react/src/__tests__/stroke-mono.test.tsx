import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BanIcon, ChevronDownIcon, icons } from '../packs/stroke-mono';

function svgOf(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg');
  if (!svg) throw new Error('no <svg> rendered');
  return svg;
}

describe('stroke-mono icons', () => {
  it('renders an svg with the 24px viewBox and at least one path', () => {
    const { container } = render(<BanIcon />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('defaults to size 24 and uses currentColor stroke (decorative)', () => {
    const { container } = render(<ChevronDownIcon />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the rule-derived stroke width per size', () => {
    // 24 → 2 (master), 16 → 1.6px ⇒ 2.4 user units, 32 → 2.5px ⇒ 1.875.
    expect(svgOf(render(<BanIcon />).container)).toHaveAttribute(
      'stroke-width',
      '2'
    );
    expect(svgOf(render(<BanIcon size={16} />).container)).toHaveAttribute(
      'stroke-width',
      '2.4'
    );
    expect(svgOf(render(<BanIcon size={32} />).container)).toHaveAttribute(
      'stroke-width',
      '1.875'
    );
  });

  it('sets width/height from the size prop', () => {
    const svg = svgOf(render(<BanIcon size={16} />).container);
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
  });

  it('is labelled (role=img) when a title is provided', () => {
    const { container, getByText } = render(<BanIcon title="Blocked" />);
    const svg = svgOf(container);
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Blocked');
    expect(getByText('Blocked').tagName.toLowerCase()).toBe('title');
  });

  it('forwards className and ref to the svg', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(
      <BanIcon ref={ref} className="text-red-500" />
    );
    const svg = svgOf(container);
    expect(svg).toHaveClass('text-red-500');
    expect(ref.current).toBe(svg);
  });

  it('exposes a registry of all icons keyed by asset name', () => {
    expect(Object.keys(icons).length).toBeGreaterThan(0);
    expect(icons.ban).toBe(BanIcon);
    expect(icons['chevron-down']).toBe(ChevronDownIcon);
  });
});
