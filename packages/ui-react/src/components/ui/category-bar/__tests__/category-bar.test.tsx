import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CategoryBar } from '../category-bar';
import { type ChartConfig } from '../../chart';

const data = [
  { key: 'registered', value: 42 },
  { key: 'trained', value: 32 },
  { key: 'certified', value: 26 },
];

const config = {
  registered: { label: 'Registered', color: 'rgb(23 99 207)' },
  trained: { label: 'Trained', color: 'rgb(255 149 0)' },
  certified: { label: 'Certified', color: 'rgb(40 167 69)' },
} satisfies ChartConfig;

function renderBar(
  props: Partial<React.ComponentProps<typeof CategoryBar>> = {}
) {
  return render(<CategoryBar data={data} config={config} {...props} />);
}

describe('CategoryBar', () => {
  it('renders one segment per datum sized proportionally to its value', () => {
    const { container } = renderBar({ showTooltip: false });
    const track = screen.getByRole('img');
    const segments = track.children;
    expect(segments).toHaveLength(3);
    // flex-grow carries the value; basis is 0 so widths are exactly value/total.
    expect((segments[0] as HTMLElement).style.flex).toBe('42 0 0%');
    expect((segments[1] as HTMLElement).style.flex).toBe('32 0 0%');
    expect((segments[0] as HTMLElement).style.backgroundColor).toBe(
      'rgb(23 99 207)'
    );
    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
  });

  it('builds an accessible summary from the data', () => {
    renderBar();
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Registered 42, Trained 32, Certified 26'
    );
  });

  it('uses a caller-supplied aria-label over the generated summary', () => {
    renderBar({ 'aria-label': 'Onboarding funnel' });
    expect(screen.getByRole('img')).toHaveAccessibleName('Onboarding funnel');
  });

  it('renders a legend with each segment value + % when showLegend is on', () => {
    const off = renderBar();
    expect(off.container.textContent).not.toContain('Registered');
    const on = renderBar({ showLegend: true });
    expect(on.container.textContent).toContain('Registered');
    expect(on.container.textContent).toContain('Certified');
    // 42 / 100 = 42%
    expect(on.container.textContent).toContain('42');
    expect(on.container.textContent).toContain('42%');
  });

  it('formats values with valueFormatter in the legend', () => {
    renderBar({
      showLegend: true,
      valueFormatter: (v) => `$${v.toLocaleString('en-US')}`,
    });
    expect(screen.getByText('$42')).toBeInTheDocument();
  });

  it('applies the size variant height class to the track', () => {
    renderBar({ size: 'lg', showTooltip: false });
    expect(screen.getByRole('img')).toHaveClass('h-4');
  });

  it('shows a segment tooltip content when defaultOpenIndex is set', () => {
    renderBar({ defaultOpenIndex: 1 });
    expect(screen.getByText('Trained')).toBeInTheDocument();
    expect(screen.getByText('32 · 32%')).toBeInTheDocument();
  });

  it('renders custom tooltip content via tooltipContent with the resolved segment', () => {
    renderBar({
      defaultOpenIndex: 0,
      tooltipContent: (seg) => (
        <span>
          {seg.label}: {seg.percent}%
        </span>
      ),
    });
    expect(screen.getByText('Registered: 42%')).toBeInTheDocument();
    // the default body (value · %) is replaced
    expect(screen.queryByText('42 · 42%')).not.toBeInTheDocument();
  });

  it('guards an all-zero dataset (0% shares, no divide-by-zero)', () => {
    render(
      <CategoryBar
        showLegend
        data={[
          { key: 'registered', value: 0 },
          { key: 'trained', value: 0 },
        ]}
        config={config}
      />
    );
    expect(screen.getAllByText('0%')).toHaveLength(2);
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CategoryBar data={data} config={config} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a caller className onto the root', () => {
    const { container } = renderBar({ className: 'w-80' });
    expect(container.firstElementChild).toHaveClass('w-80');
  });
});
