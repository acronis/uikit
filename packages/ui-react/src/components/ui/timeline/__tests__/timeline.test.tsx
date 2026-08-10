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

  it('draws the elbow only on the row that opens a branch', () => {
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

  it('derives the elbow from the level jump, with no branchStart', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Root" />
        <Timeline.Item title="Child" level={2} />
        <Timeline.Item title="Grandchild" level={3} />
        <Timeline.Item title="Sibling" level={3} />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    const hasElbow = (li: HTMLElement) =>
      li.querySelector('[data-slot="timeline-elbow"]') !== null;

    // Being deeper than the row above *is* what opens a branch, so the elbow does
    // not have to be declared a second time — and the parent's line always lands.
    expect(hasElbow(items[0])).toBe(false);
    expect(hasElbow(items[1])).toBe(true);
    expect(hasElbow(items[2])).toBe(true);
    // Same level as the row above: continues the branch rather than opening one.
    expect(hasElbow(items[3])).toBe(false);
  });

  it('drops the descending line when a deeper row refuses its elbow', () => {
    const { container } = render(
      <Timeline>
        <Timeline.Item title="Root" />
        <Timeline.Item title="Child" level={2} branchStart={false} />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    // The two halves of the join are resolved together: without the elbow there is
    // nothing for the parent's line to meet, so it is not drawn either.
    expect(
      items[1].querySelector('[data-slot="timeline-elbow"]')
    ).not.toBeInTheDocument();
    expect(
      items[0].querySelector('[data-slot="timeline-connector"]')
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
        <Timeline.Item title="Root" />
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

  it('puts the disclosure button ahead of the marker, and only in tree mode', () => {
    const { container, rerender } = render(
      <Timeline variant="tree">
        <Timeline.Item title="Event" />
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    // The control lives in the marker column, before the card.
    const markerColumn = container.querySelector('li > div:first-of-type');
    expect(markerColumn).toContainElement(screen.getByRole('button'));

    rerender(
      <Timeline>
        <Timeline.Item title="Event" />
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    // The same branch in `default` mode collapses nothing, so there is no control.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('collapses descendant rows in tree mode without any consumer wiring', async () => {
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" toggleLabel="Toggle root" />
        <Timeline.Item level={2} branchStart title="Child" />
        <Timeline.Item level={3} branchStart title="Grandchild" />
        <Timeline.Item title="Next root" />
      </Timeline>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
    expect(screen.getByText('Grandchild')).toBeInTheDocument();

    // No `collapsible` anywhere: the control is derived from having descendants.
    await user.click(screen.getByRole('button', { name: 'Toggle root' }));

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
        <Timeline.Item title="Root" toggleLabel="Toggle root" />
        <Timeline.Item
          level={2}
          branchStart
          title="Child"
          toggleLabel="Toggle child"
        />
        <Timeline.Item level={3} branchStart title="Grandchild" />
        <Timeline.Item level={2} title="Sibling" />
      </Timeline>
    );
    // Both `Root` and `Child` have descendants, so both derive a control.
    expect(screen.getAllByRole('button')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Toggle child' }));

    expect(screen.queryByText('Grandchild')).not.toBeInTheDocument();
    expect(screen.getByText('Sibling')).toBeInTheDocument();
    expect(screen.getByText('Root')).toBeInTheDocument();
  });

  it('starts collapsed with defaultExpanded={false}', () => {
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" defaultExpanded={false} />
        <Timeline.Item title="Child" level={2} branchStart />
      </Timeline>
    );
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('derives the tree disclosure control from having descendants', () => {
    const { container } = render(
      <Timeline variant="tree">
        <Timeline.Item title="Parent" toggleLabel="Toggle parent" />
        <Timeline.Item level={2} branchStart title="Child" />
        <Timeline.Item title="Leaf" />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    const hasButton = (li: HTMLElement) =>
      li.querySelector('button') !== null;

    // No `collapsible` prop is passed anywhere in this tree.
    expect(hasButton(items[0])).toBe(true);
    expect(hasButton(items[1])).toBe(false);
    expect(hasButton(items[2])).toBe(false);
  });

  it('does not derive a control in the default variant', () => {
    render(
      <Timeline>
        <Timeline.Item title="Parent" />
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    // `default`'s chevron reveals the row's own body — that stays opt-in.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('keeps a collapsed row’s control so it can be expanded again', async () => {
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Parent" toggleLabel="Toggle parent" />
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    const toggle = () => screen.getByRole('button', { name: 'Toggle parent' });

    await user.click(toggle());
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    // The descendant is gone, but "has descendants" is read from the authored
    // children — so the control survives and the row is not a dead end.
    expect(toggle()).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle());
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('skips the connector between tree siblings with mismatched marker widths', () => {
    const { container } = render(
      <Timeline variant="tree">
        {/* Collapsed, so its own descendant is hidden and the next visible row is
            the sibling below — which has no branch, so no disclosure button and a
            narrower marker column. A straight line between them is impossible. */}
        <Timeline.Item title="Parent" defaultExpanded={false} />
        <Timeline.Item level={2} branchStart title="Hidden child" />
        <Timeline.Item title="Leaf sibling" />
        <Timeline.Item title="Another leaf" />
      </Timeline>
    );
    const items = Array.from(container.querySelectorAll('li'));
    const hasConnector = (li: HTMLElement) =>
      li.querySelector('[data-slot="timeline-connector"]') !== null;

    expect(screen.queryByText('Hidden child')).not.toBeInTheDocument();
    expect(hasConnector(items[0])).toBe(false);
    // Two leaves share a marker width, so their line is fine.
    expect(hasConnector(items[1])).toBe(true);
  });

  it('folds the card body with collapsibleBody, in either variant', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Timeline>
        <Timeline.Item title="Event" collapsibleBody>
          <p>Section detail</p>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.getByText('Section detail')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();

    rerender(
      <Timeline variant="tree">
        {/* A fresh key remounts the row, so it starts from its default again. */}
        <Timeline.Item key="tree" title="Event" collapsibleBody>
          <p>Section detail</p>
        </Timeline.Item>
      </Timeline>
    );
    // Same control, same behaviour — it is the card's, not the timeline's.
    expect(screen.getByText('Section detail')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
  });

  it('keeps the branch and card controls independent on one tree row', async () => {
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item
          title="Root"
          collapsibleBody
          toggleLabel="Toggle branch"
          bodyToggleLabel="Toggle body"
        >
          <p>Section detail</p>
        </Timeline.Item>
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    // A row with descendants gets both: the branch button and the card chevron.
    expect(screen.getAllByRole('button')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Toggle body' }));
    // The card folded; the branch is untouched.
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle branch' }));
    // The branch dropped; the card's own state is still its own.
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle body' }));
    expect(screen.getByText('Section detail')).toBeInTheDocument();
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
  });

  it('honors a controlled card-body state', async () => {
    const onBodyExpandedChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Timeline>
        <Timeline.Item
          title="Event"
          collapsibleBody
          bodyExpanded={false}
          onBodyExpandedChange={onBodyExpandedChange}
        >
          <p>Section detail</p>
        </Timeline.Item>
      </Timeline>
    );
    const toggle = screen.getByRole('button');
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
    expect(container.querySelector('li')).toHaveAttribute(
      'data-body-expanded',
      'false'
    );

    await user.click(toggle);
    expect(onBodyExpandedChange).toHaveBeenCalledWith(true);
    // The consumer owns it, so nothing moved on its own.
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
  });

  it('starts the card body folded with defaultBodyExpanded={false}', () => {
    render(
      <Timeline>
        <Timeline.Item title="Event" collapsibleBody defaultBodyExpanded={false}>
          <p>Section detail</p>
        </Timeline.Item>
      </Timeline>
    );
    expect(screen.queryByText('Section detail')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders no card chevron without collapsibleBody', () => {
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

  it('collapsing a branch never hides the row’s own body', async () => {
    const user = userEvent.setup();
    render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" toggleLabel="Toggle root">
          <p>Section detail</p>
        </Timeline.Item>
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    expect(screen.getByText('Section detail')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle root' }));

    // The control is a hierarchy control: it drops the branch, never the row's
    // own body. An expandable card is `Card`'s concern, not the timeline's.
    expect(screen.queryByText('Child')).not.toBeInTheDocument();
    expect(screen.getByText('Section detail')).toBeInTheDocument();
  });

  it('reports the requested disclosure state', async () => {
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Timeline variant="tree">
        <Timeline.Item title="Event" onExpandedChange={onExpandedChange} />
        <Timeline.Item level={2} branchStart title="Child" />
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
      <Timeline variant="tree">
        <Timeline.Item title="Event" />
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    expect(
      screen.getByRole('button', { name: 'Toggle nested events' })
    ).toBeInTheDocument();

    rerender(
      <Timeline variant="tree">
        <Timeline.Item title="Event" toggleLabel="Mostrar más" />
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    expect(
      screen.getByRole('button', { name: 'Mostrar más' })
    ).toBeInTheDocument();
  });

  it('gives a row carrying both controls two distinct default names', () => {
    const { container } = render(
      <Timeline variant="tree">
        <Timeline.Item title="Root" collapsibleBody>
          <p>Section detail</p>
        </Timeline.Item>
        <Timeline.Item level={2} branchStart title="Child" />
      </Timeline>
    );
    // Both defaults land in the same `<li>`, so a shared string would leave a
    // screen-reader user with two identically-named buttons doing different things.
    const names = Array.from(
      container.querySelectorAll('li:first-of-type button')
    ).map((button) => button.getAttribute('aria-label'));

    expect(names).toHaveLength(2);
    expect(new Set(names).size).toBe(2);
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
