import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BrandAcronisIcon } from '../packs/solid-mono';
import { CircleCheckMultiIcon } from '../packs/stroke-multi';
import { SparklesMultiIcon } from '../packs/solid-multi';

function svgOf(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg');
  if (!svg) throw new Error('no <svg> rendered');
  return svg;
}

describe('solid-mono pack', () => {
  it('paints with currentColor fill (no authored color, no stroke width)', () => {
    const svg = svgOf(render(<BrandAcronisIcon />).container);
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).not.toHaveAttribute('stroke-width');
    // authored fill on the path was stripped so the svg's fill cascades.
    expect(svg.querySelector('path')).not.toHaveAttribute('fill');
  });
});

describe('multicolor packs keep authored colors', () => {
  it('stroke-multi preserves per-path colors but takes stroke width from rules', () => {
    const svg = svgOf(render(<CircleCheckMultiIcon size={16} />).container);
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).not.toHaveAttribute('stroke'); // not forced to currentColor
    expect(svg).toHaveAttribute('stroke-width', '2.4'); // rule-driven at 16px
    const paths = svg.querySelectorAll('path');
    expect(paths[0]).toHaveAttribute('fill', '#29a33d');
    expect(paths[0]).toHaveAttribute('stroke', '#248f36');
    expect(paths[1]).toHaveAttribute('stroke', '#fff');
  });

  it('solid-multi preserves gradients with namespaced ids', () => {
    const svg = svgOf(render(<SparklesMultiIcon />).container);
    const gradientId = svg.querySelector('linearGradient')?.id;
    // ids are namespaced per-icon so gradients can't collide across icons.
    expect(gradientId).toMatch(/^sparkles-/);
    expect(svg.querySelector('path')?.getAttribute('fill')).toBe(
      `url(#${gradientId})`
    );
  });
});
