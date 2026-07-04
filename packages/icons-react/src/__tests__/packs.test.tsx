import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AcronisAIcon } from '../packs/solid-mono';
import { CircleCheckSolidIcon } from '../packs/stroke-multi';
import { SparklesIcon } from '../packs/solid-multi';

function svgOf(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg');
  if (!svg) throw new Error('no <svg> rendered');
  return svg;
}

describe('solid-mono pack', () => {
  it('paints with currentColor fill (no authored color, no stroke width)', () => {
    const svg = svgOf(render(<AcronisAIcon />).container);
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).not.toHaveAttribute('stroke-width');
    // authored fill on the path was stripped so the svg's fill cascades.
    expect(svg.querySelector('path')).not.toHaveAttribute('fill');
  });
});

describe('multicolor packs keep authored colors', () => {
  it('stroke-multi preserves per-path colors but takes stroke width from rules', () => {
    const svg = svgOf(render(<CircleCheckSolidIcon size={16} />).container);
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).not.toHaveAttribute('stroke'); // not forced to currentColor
    expect(svg).toHaveAttribute('stroke-width', '2.4'); // rule-driven at 16px
    const paths = svg.querySelectorAll('path');
    expect(paths[0]).toHaveAttribute('fill', '#29A33D');
    expect(paths[0]).toHaveAttribute('stroke', '#248F36');
    expect(paths[1]).toHaveAttribute('stroke', 'white');
  });

  it('solid-multi preserves gradients with namespaced ids', () => {
    const svg = svgOf(render(<SparklesIcon />).container);
    expect(svg.querySelector('linearGradient')?.id).toBe(
      'sparkles-paint0_linear_1208_893'
    );
    expect(svg.querySelector('path')?.getAttribute('fill')).toBe(
      'url(#sparkles-paint0_linear_1208_893)'
    );
  });
});
