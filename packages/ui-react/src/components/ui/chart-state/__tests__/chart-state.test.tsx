import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ChartState } from '../chart-state';

describe('ChartState', () => {
  it('renders loading as one polite status region with its default label', () => {
    render(<ChartState state="loading" />);

    expect(screen.getByRole('status')).toHaveTextContent('Data is loading…');
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('keeps the state live-region contract when conflicting props are passed', () => {
    render(
      <ChartState
        state="loading"
        role="region"
        aria-live="off"
        data-testid="cs"
      />
    );

    const el = screen.getByTestId('cs');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).not.toHaveAttribute('aria-busy');
  });

  it.each([
    ['empty', 'No data found', 'ui-background-status-neutral-hover'],
    ['warning', 'Data may be incomplete', 'ui-background-status-warning'],
    ['error', 'Something went wrong', 'ui-background-status-critical'],
  ] as const)(
    'renders the %s state with its shared circular icon treatment',
    (state, message, backgroundToken) => {
      const { container } = render(<ChartState state={state} />);

      const region = screen.getByRole(state === 'error' ? 'alert' : 'status');
      expect(region).toHaveTextContent(message);
      expect(region).toHaveAttribute(
        'aria-live',
        state === 'error' ? 'assertive' : 'polite'
      );

      const iconContainer = container.querySelector('[aria-hidden="true"]');
      expect(iconContainer?.className).toContain('size-16');
      expect(iconContainer?.className).toContain(backgroundToken);
      expect(iconContainer?.querySelector('svg')).toHaveAttribute(
        'width',
        '24'
      );
    }
  );

  it('overrides the default description for the selected state', () => {
    render(<ChartState state="warning" description="Partial results" />);

    expect(screen.getByText('Partial results')).toBeInTheDocument();
    expect(
      screen.queryByText('Data may be incomplete')
    ).not.toBeInTheDocument();
  });

  it('renders the number state as a centered, disabled KPI value', () => {
    const { container } = render(
      <ChartState state="number" description="0 GB" />
    );

    const value = screen.getByText('0 GB');
    expect(value.tagName).toBe('P');
    expect(value.className).toContain('text-5xl');
    expect(value.className).toContain(
      'text-[var(--ui-text-on-surface-disabled)]'
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('defaults the number state value to zero', () => {
    render(<ChartState state="number" />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('contains a long unbroken error description within the container', () => {
    const longCtiPath =
      "failed to execute 'cti.a.p.dts.func.v1.0~a.ax_core.query.v1.0~a.ax_core.widget.v1.0~a.ax_core.daily_activity_table.v1.0': failed to execute node 'func': failed to build return: failed to execute expression '$func[cti.a.p.dts.func.v1.0~a.ax_core.platform.daily_activity_table.v1.0](query=$.params.query)': failed to execute module function 'Platform.GetDailyActivityTableQuery': failed to query daily_activity_table: unmarshaling error";
    const { container } = render(
      <ChartState state="error" description={longCtiPath} />
    );
    const root = container.firstElementChild as HTMLElement;

    expect(screen.getByText(longCtiPath)).toBeInTheDocument();
    expect(root.className).toContain('overflow-y-auto');
    expect(root.className).toContain('overflow-x-hidden');
    expect(root.className).not.toContain('justify-center');
    expect(root).toHaveClass('min-w-0');
    expect(root.querySelector('p')?.className).toContain('min-w-0');
    expect(root.querySelector('p')?.className).toContain(
      '[overflow-wrap:anywhere]'
    );
    expect(root.querySelector('div > span')?.className).toContain('shrink-0');
    expect(root.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ChartState state="empty" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
