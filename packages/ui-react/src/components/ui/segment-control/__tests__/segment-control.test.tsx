import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SegmentControl, SegmentControlItem } from '../segment-control';

function Control(props: React.ComponentProps<typeof SegmentControl>) {
  return (
    <SegmentControl aria-label="View" {...props}>
      <SegmentControlItem value="grid">Grid</SegmentControlItem>
      <SegmentControlItem value="list">List</SegmentControlItem>
      <SegmentControlItem value="table" disabled>
        Table
      </SegmentControlItem>
    </SegmentControl>
  );
}

describe('SegmentControl', () => {
  it('renders an accessible single-choice control using its token tier', () => {
    render(<Control defaultValue="grid" />);
    expect(screen.getByRole('radiogroup', { name: 'View' })).toHaveClass(
      'bg-[var(--ui-segment-control-container-color)]',
      'overflow-hidden'
    );
    expect(screen.getByRole('radiogroup', { name: 'View' })).not.toHaveClass(
      'px-[var(--ui-segment-control-container-padding-x)]',
      'py-[var(--ui-segment-control-container-padding-y)]',
      'gap-[var(--ui-segment-control-container-gap)]',
      'border-[color:var(--ui-segment-control-container-border-color)]'
    );
    expect(screen.getByRole('radiogroup', { name: 'View' })).toHaveClass(
      'h-[var(--ui-segment-control-item-height)]'
    );
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveClass(
      'shrink-0',
      'whitespace-nowrap',
      'data-[checked]:bg-[var(--ui-segment-control-item-color-active)]'
    );
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('fills the available width for three or more choices when requested', () => {
    render(<Control variant="fill" />);
    expect(screen.getByRole('radiogroup', { name: 'View' })).toHaveClass(
      'w-full',
      '[&>[role=radio]]:flex-1'
    );
  });

  it('selects one item at a time and reports changes', async () => {
    const onValueChange = vi.fn();
    render(<Control onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'List' }));
    expect(onValueChange).toHaveBeenCalledWith('list', expect.anything());
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('supports arrow-key selection between enabled items', async () => {
    render(<Control defaultValue="grid" />);
    const grid = screen.getByRole('radio', { name: 'Grid' });
    grid.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('does not select disabled items', async () => {
    render(<Control />);
    await userEvent.click(screen.getByRole('radio', { name: 'Table' }));
    expect(screen.getByRole('radio', { name: 'Table' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('forwards refs to the group and its items', () => {
    const groupRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLElement>();
    render(
      <SegmentControl ref={groupRef} aria-label="View">
        <SegmentControlItem ref={itemRef} value="grid">
          Grid
        </SegmentControlItem>
      </SegmentControl>
    );
    expect(groupRef.current?.getAttribute('role')).toBe('radiogroup');
    expect(itemRef.current?.getAttribute('role')).toBe('radio');
  });

  it('renders the Tag counter only when hasCounter is true', () => {
    render(
      <SegmentControl aria-label="View">
        <SegmentControlItem
          value="grid"
          hasCounter
          counter={{
            variant: 'neutral',
            size: 'sm',
            icon: <span data-testid="counter-icon" />,
            children: '7',
          }}
        >
          Grid
        </SegmentControlItem>
        <SegmentControlItem value="list" counter={{ children: '3' }}>
          List
        </SegmentControlItem>
      </SegmentControl>
    );
    expect(screen.getByRole('radio', { name: 'Grid 7' })).toBeInTheDocument();
    expect(screen.getByTestId('counter-icon')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'List' })).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });
});

/** Give the scroll track a measurable overflow that jsdom otherwise reports as 0. */
function makeOverflowing(track: HTMLElement, scrollLeft = 0) {
  Object.defineProperty(track, 'scrollWidth', {
    value: 600,
    configurable: true,
  });
  Object.defineProperty(track, 'clientWidth', {
    value: 200,
    configurable: true,
  });
  Object.defineProperty(track, 'scrollLeft', {
    value: scrollLeft,
    configurable: true,
  });
}

function getTrack(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[class*="overflow-x-auto"]')!;
}

describe('SegmentControl hasScroll', () => {
  it('renders no scroll chevrons by default', () => {
    render(<Control defaultValue="grid" />);
    expect(
      screen.queryByRole('button', { name: 'Previous' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('renders both chevrons on a scrollable track using the box-icon tier', () => {
    const { container } = render(<Control hasScroll defaultValue="grid" />);
    const track = getTrack(container);
    expect(track).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'View' })).toHaveClass(
      'w-full'
    );
    expect(screen.getByRole('radio', { name: 'Grid' })).toBe(
      track.querySelector('[role=radio]')
    );
    expect(track).toHaveClass('flex-1');
    expect(
      screen.getByRole('button', { name: 'Previous' }).parentElement
    ).toHaveClass('shrink-0');
    expect(
      screen.getByRole('button', { name: 'Previous' }).parentElement
    ).not.toHaveClass('absolute');
    expect(screen.getByRole('button', { name: 'Previous' })).toHaveClass(
      'bg-[var(--ui-segment-control-box-icon-color-idle)]',
      'w-[var(--ui-segment-control-box-icon-width)]'
    );
  });

  it('disables the chevron at each end of the track and enables the other', () => {
    const { container } = render(<Control hasScroll defaultValue="grid" />);
    const track = getTrack(container);

    makeOverflowing(track, 0);
    fireEvent.scroll(track);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

    makeOverflowing(track, 400);
    fireEvent.scroll(track);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('pages the track when an enabled chevron is pressed', async () => {
    const { container } = render(<Control hasScroll defaultValue="grid" />);
    const track = getTrack(container);
    const scrollBy = vi.fn();
    track.scrollBy = scrollBy;

    makeOverflowing(track, 200);
    fireEvent.scroll(track);

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 120, behavior: 'smooth' })
    );

    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: -120, behavior: 'smooth' })
    );
  });

  it('localizes the chevron labels through props', () => {
    render(
      <Control
        hasScroll
        scrollPrevLabel="Anterior"
        scrollNextLabel="Siguiente"
      />
    );
    expect(
      screen.getByRole('button', { name: 'Anterior' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Siguiente' })
    ).toBeInTheDocument();
  });
});
