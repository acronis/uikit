import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tag } from '../../tag';
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

  it('renders the title, tag, timestamp and description slots', () => {
    render(
      <Timeline>
        <Timeline.Item
          title="Backup success rate dropped"
          tag={<Tag variant="warning">Warning</Tag>}
          timestamp="Dec 22, 08:30 AM"
          description="Fell from 96% to 72%"
        />
      </Timeline>
    );
    expect(screen.getByText('Backup success rate dropped')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Dec 22, 08:30 AM')).toBeInTheDocument();
    expect(screen.getByText('Fell from 96% to 72%')).toBeInTheDocument();
  });

  it('renders extra content in the card body', () => {
    render(
      <Timeline>
        <Timeline.Item title="Event">
          <p>Nested detail</p>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('Nested detail')).toBeInTheDocument();
  });

  it('defaults to level 1 and reflects the nesting level', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Root" />
        <Timeline.Item title="Child" level={2} branchStart />
        <Timeline.Item title="Grandchild" level={3} />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    expect(items.map((li) => li.dataset.level)).toEqual(['1', '2', '3']);
  });

  it('draws the elbow only when a nested item starts a branch', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Root" branchStart />
        <Timeline.Item title="Branch" level={2} branchStart />
        <Timeline.Item title="Sibling" level={2} />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    // `branchStart` is ignored at level 1 — there is no parent to join.
    expect(
      items[0].querySelector('[data-slot="timeline-elbow"]')
    ).not.toBeInTheDocument();
    expect(
      items[1].querySelector('[data-slot="timeline-elbow"]')
    ).toBeInTheDocument();
    expect(
      items[2].querySelector('[data-slot="timeline-elbow"]')
    ).not.toBeInTheDocument();
  });

  it('derives the connector from the next visible row, and honors an override', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Root" />
        <Timeline.Item title="Child" level={2} branchStart />
        <Timeline.Item title="Next root" />
        <Timeline.Item title="Forced" connector />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    const hasConnector = (li: HTMLElement) =>
      li.querySelector('[data-slot="timeline-connector"]') !== null;

    // Reaches a deeper row.
    expect(hasConnector(items[0])).toBe(true);
    // The branch's last row: the next row is shallower, so the line would dangle.
    expect(hasConnector(items[1])).toBe(false);
    // Reaches a row at its own level.
    expect(hasConnector(items[2])).toBe(true);
    // Last row overall — only drawn because it was forced on.
    expect(hasConnector(items[3])).toBe(true);
  });

  it("drops a collapsed row's dangling connector", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" collapsible />
        <Timeline.Item title="Child" level={2} branchStart />
      </Timeline>
    );
    const connector = () =>
      container.querySelector('[data-slot="timeline-connector"]');
    // Expanded, the root's line reaches its child.
    expect(connector()).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    // Collapsed, nothing follows it — the line must go with the child.
    expect(connector()).not.toBeInTheDocument();
  });

  it('marks the marker and connectors as decorative', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Event" level={2} branchStart />
        {/* A following sibling, so the first row's connector is drawn. */}
        <Timeline.Item title="Sibling" level={2} />
      </Timeline>
    );
    for (const selector of [
      '[data-slot="timeline-connector"]',
      '[data-slot="timeline-elbow"]',
    ]) {
      expect(container.querySelector(selector)).toHaveAttribute('aria-hidden');
    }
  });

  it('reflects the variant on the root', () => {
    const { container } = render(
      <Timeline variant="tree">
        <Timeline.Item title="Event" />
      </Timeline>
    );
    expect(container.querySelector('ol')).toHaveAttribute(
      'data-variant',
      'tree'
    );
  });

  it('shows the disclosure button in the header, or ahead of the marker in tree mode', () => {
    const { container, rerender } = render(
      <Timeline>
        <Timeline.Item title="Event" collapsible />
      </Timeline>
    );
    const card = container.querySelector('li > div:last-child');
    expect(card).toContainElement(screen.getByRole('button'));

    rerender(
      <Timeline variant="tree">
        <Timeline.Item title="Event" collapsible />
      </Timeline>
    );
    // In tree mode the control lives in the marker column, before the card.
    const markerColumn = container.querySelector('li > div:first-of-type');
    expect(markerColumn).toContainElement(screen.getByRole('button'));

    rerender(
      <Timeline>
        <Timeline.Item title="Event" />
      </Timeline>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('collapses descendant rows in tree mode without any consumer wiring', async () => {
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" collapsible />
        <Timeline.Item title="Child" level={2} branchStart />
        <Timeline.Item title="Grandchild" level={3} branchStart />
        <Timeline.Item title="Next root" />
      </Timeline>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('Grandchild')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
    // A sibling at the collapsed row's own level is unaffected.
    expect(screen.getByText('Next root')).toBeInTheDocument();
    expect(screen.getByText('Root')).toBeInTheDocument();
  });

  it('collapses only the nested branch when a deeper row is collapsed', async () => {
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" />
        <Timeline.Item title="Child" level={2} branchStart collapsible />
        <Timeline.Item title="Grandchild" level={3} branchStart />
        <Timeline.Item title="Sibling" level={2} />
      </Timeline>
    );
    await user.click(screen.getByRole('button'));

    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
    expect(screen.getByText('Sibling')).toBeInTheDocument();
    expect(screen.getByText('Root')).toBeInTheDocument();
  });

  it('starts collapsed with defaultExpanded={false}', () => {
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" collapsible defaultExpanded={false} />
        <Timeline.Item title="Child" level={2} branchStart />
      </Timeline>
    );
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('skips the connector between tree siblings with mismatched marker widths', () => {
    const { container } = render(
      <Timeline variant="tree">
        {/* Reserves a disclosure button, so its marker column is wider... */}
        <Timeline.Item title="Parent" collapsible />
        {/* ...than this sibling's, so a straight line between them is impossible. */}
        <Timeline.Item title="Leaf sibling" />
        <Timeline.Item title="Another leaf" />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    const hasConnector = (li: HTMLElement) =>
      li.querySelector('[data-slot="timeline-connector"]') !== null;

    expect(hasConnector(items[0])).toBe(false);
    // Two leaves share a marker width, so their line is fine.
    expect(hasConnector(items[1])).toBe(true);
  });

  it('leaves descendant rows alone when a default-variant card collapses', async () => {
    const user = userEvent.setup();
    render(
      <Timeline>
        <Timeline.Item title="Root" collapsible>
          <p>Section detail</p>
        </Timeline.Item>
        <Timeline.Item title="Child" level={2} branchStart />
      </Timeline>
    );
    await user.click(screen.getByRole('button'));

    // The chevron belongs to the card, so only its own body goes away.
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('hides the card body while collapsed', async () => {
    const user = userEvent.setup();
    render(
      <Timeline>
        <Timeline.Item title="Event" collapsible>
          <p>Section detail</p>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('Section detail')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
  });

  it('always shows the body of a non-collapsible item', () => {
    render(
      <Timeline>
        <Timeline.Item title="Event">
          <p>Section detail</p>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('Section detail')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('reports the requested disclosure state', async () => {
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Timeline>
        <Timeline.Item
          title="Event"
          collapsible
          onExpandedChange={onExpandedChange}
        />
      </Timeline>
    );
    const toggle = screen.getByRole('button');
    const item = container.querySelector('li');

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(item).toHaveAttribute('data-expanded', 'true');

    await user.click(toggle);
    expect(onExpandedChange).toHaveBeenCalledWith(false);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(item).toHaveAttribute('data-expanded', 'false');
  });

  it('honors a controlled expanded state', async () => {
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item
          title="Root"
          collapsible
          expanded={false}
          onExpandedChange={onExpandedChange}
        />
        <Timeline.Item title="Child" level={2} branchStart />
      </Timeline>
    );
    const toggle = screen.getByRole('button');
    // The consumer owns the state, so the descendant stays hidden after a click.
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    await user.click(toggle);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
  });

  it('names the disclosure button and lets the name be overridden', () => {
    const { rerender } = render(
      <Timeline>
        <Timeline.Item title="Event" collapsible />
      </Timeline>
    );
    expect(
      screen.getByRole('button', { name: 'Toggle event details' })
    ).toBeInTheDocument();

    rerender(
      <Timeline>
        <Timeline.Item title="Event" collapsible toggleLabel="Mostrar mas" />
      </Timeline>
    );
    expect(
      screen.getByRole('button', { name: 'Mostrar mas' })
    ).toBeInTheDocument();
  });

  it('renders initials in the marker when no icon is given', () => {
    render(
      <Timeline>
        <Timeline.Item title="Event" initials="MS" />
      </Timeline>
    );
    expect(screen.getByText('MS')).toBeInTheDocument();
  });

  it('forwards refs and merges class names', () => {
    const rootRef = React.createRef<HTMLOListElement>();
    const itemRef = React.createRef<HTMLLIElement>();
    render(
      <Timeline ref={rootRef} className="custom-root">
        <TimelineItem ref={itemRef} className="custom-item" title="Event" />
      </Timeline>
    );
    expect(rootRef.current).toBeInstanceOf(HTMLOListElement);
    expect(itemRef.current).toBeInstanceOf(HTMLLIElement);
    expect(rootRef.current).toHaveClass('custom-root');
    expect(itemRef.current).toHaveClass('custom-item');
  });
});
