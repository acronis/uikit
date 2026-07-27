import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Timeline, TimelineItem } from '../timeline';

describe('Timeline', () => {
  it('renders a semantic ordered list of items', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="First" />
        <Timeline.Item title="Second" />
      </Timeline>
    );
    const ol = container.querySelector('ol');
    expect(ol).toBeInTheDocument();
    expect(ol?.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders timestamp, title and description', () => {
    render(
      <Timeline>
        <Timeline.Item
          timestamp="Today, 10:30"
          title="Backup success rate dropped"
          description="Fell from 96% to 72%"
        />
      </Timeline>
    );
    expect(screen.getByText('Today, 10:30')).toBeInTheDocument();
    expect(screen.getByText('Backup success rate dropped')).toBeInTheDocument();
    expect(screen.getByText('Fell from 96% to 72%')).toBeInTheDocument();
  });

  it('reflects status on the item and tints the marker', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Incident" status="danger" />
      </Timeline>
    );
    const li = container.querySelector('li');
    expect(li).toHaveAttribute('data-status', 'danger');
    // the plain dot uses the danger status token
    expect(container.innerHTML).toContain('bg-[var(--ui-text-on-status-danger)]');
  });

  it('renders an icon in the marker badge instead of the dot', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Secured" status="success" icon={<svg data-testid="ico" />} />
      </Timeline>
    );
    const icon = container.querySelector('[data-testid="ico"]');
    expect(icon).toBeInTheDocument();
    expect(icon?.parentElement?.className).toContain(
      'bg-[var(--ui-background-status-success-pressed)]'
    );
  });

  it('renders metadata, actions and expandable children', () => {
    render(
      <Timeline>
        <Timeline.Item
          title="Anomaly"
          metadata={<span>meta-tag</span>}
          actions={<a href="#x">View</a>}
        >
          <div>extra detail</div>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('meta-tag')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('extra detail')).toBeInTheDocument();
  });

  it('marks current and disabled items', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Now" current />
        <Timeline.Item title="Off" disabled />
      </Timeline>
    );
    const [a, b] = container.querySelectorAll('li');
    expect(a).toHaveAttribute('data-current', 'true');
    expect(b).toHaveAttribute('data-disabled', 'true');
    expect(b.className).toContain('opacity-60');
  });

  it('gives a disabled item an accessible signal and blocks pointer input', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Off" disabled />
        <Timeline.Item title="On" />
      </Timeline>
    );
    const [disabled, active] = container.querySelectorAll('li');
    expect(disabled).toHaveAttribute('aria-disabled', 'true');
    expect(disabled.className).toContain('pointer-events-none');
    // An active item carries neither signal.
    expect(active).not.toHaveAttribute('aria-disabled');
    expect(active.className).not.toContain('pointer-events-none');
  });

  it('rings the icon marker badge for a current item', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item
          title="Now"
          status="info"
          current
          icon={<svg data-testid="cur" />}
        />
      </Timeline>
    );
    const badge = container.querySelector('[data-testid="cur"]')?.parentElement;
    expect(badge?.className).toContain('ring-2');
    expect(badge?.className).toContain('ring-[var(--ui-text-on-status-info)]');
  });

  it('reflects size and density on the list', () => {
    const { container } = render(
      <Timeline size="small" density="compact">
        <Timeline.Item title="A" />
      </Timeline>
    );
    const ol = container.querySelector('ol');
    expect(ol).toHaveAttribute('data-size', 'small');
    expect(ol).toHaveAttribute('data-density', 'compact');
  });

  it('renders a connector per item (last one hidden by the list rule)', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="A" />
        <Timeline.Item title="B" />
      </Timeline>
    );
    expect(
      container.querySelectorAll('[data-slot="timeline-connector"]')
    ).toHaveLength(2);
    expect(container.querySelector('ol')?.className).toContain(
      '[&>li:last-child_[data-slot=timeline-connector]]:hidden'
    );
  });

  it('forwards refs to the list and an item', () => {
    const olRef = React.createRef<HTMLOListElement>();
    const liRef = React.createRef<HTMLLIElement>();
    render(
      <Timeline ref={olRef}>
        <TimelineItem ref={liRef} title="A" />
      </Timeline>
    );
    expect(olRef.current).toBeInstanceOf(HTMLOListElement);
    expect(liRef.current).toBeInstanceOf(HTMLLIElement);
  });

  it('merges a caller className onto the list', () => {
    const { container } = render(
      <Timeline className="max-w-md">
        <Timeline.Item title="A" />
      </Timeline>
    );
    expect(container.firstElementChild).toHaveClass('max-w-md');
  });
});
