import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonGroup, ButtonGroupItem } from '../button-group';

const Icon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16">
    <path d="M8 0v16M0 8h16" />
  </svg>
);

function renderGroup(props?: React.ComponentProps<typeof ButtonGroup>) {
  return render(
    <ButtonGroup aria-label="View mode" {...props}>
      <ButtonGroupItem aria-label="List">
        <Icon />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Grid">
        <Icon />
      </ButtonGroupItem>
      <ButtonGroupItem aria-label="Table">
        <Icon />
      </ButtonGroupItem>
    </ButtonGroup>
  );
}

describe('ButtonGroup', () => {
  it('renders a named toolbar containing every item', () => {
    renderGroup();
    const toolbar = screen.getByRole('toolbar', { name: 'View mode' });
    expect(toolbar).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('applies the outlined container tokens by default', () => {
    renderGroup();
    expect(screen.getByRole('toolbar')).toHaveClass(
      'rounded-[var(--ui-button-group-global-container-border-radius)]',
      'border-[length:var(--ui-button-group-global-container-border-width)]',
      'border-[color:var(--ui-button-group-global-container-border-color)]',
      'overflow-hidden'
    );
  });

  it('draws no container border or radius for variant="inlined"', () => {
    renderGroup({ variant: 'inlined' });
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).not.toHaveClass(
      'border-[length:var(--ui-button-group-global-container-border-width)]'
    );
    expect(toolbar).not.toHaveClass(
      'rounded-[var(--ui-button-group-global-container-border-radius)]'
    );
    // The clipping and layout are variant-independent.
    expect(toolbar).toHaveClass('inline-flex', 'overflow-hidden');
  });

  it('merges a custom className with the container classes', () => {
    renderGroup({ className: 'custom-class' });
    expect(screen.getByRole('toolbar')).toHaveClass(
      'custom-class',
      'inline-flex'
    );
  });

  it('forwards the ref to the container element', () => {
    const ref = createRef<HTMLDivElement>();
    renderGroup({ ref });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('exposes the group as a single tab stop and roves with the arrow keys', async () => {
    renderGroup();
    const [list, grid] = screen.getAllByRole('button');

    await userEvent.tab();
    expect(list).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(grid).toHaveFocus();

    // One Tab stop for the whole cluster: Tab leaves the group entirely
    // rather than moving to the next item.
    await userEvent.tab();
    expect(grid).not.toHaveFocus();
    expect(list).not.toHaveFocus();
  });
});

describe('ButtonGroupItem', () => {
  it('applies the box geometry and idle token classes', () => {
    renderGroup();
    expect(screen.getByRole('button', { name: 'List' })).toHaveClass(
      'h-[var(--ui-button-group-global-box-height)]',
      'px-[var(--ui-button-group-global-box-padding-x)]',
      'py-[var(--ui-button-group-global-box-padding-y)]',
      'bg-[var(--ui-button-group-global-box-color-idle)]',
      'text-[var(--ui-glyph-on-surface-primary)]'
    );
  });

  it('carries the separator border with a last-child reset', () => {
    renderGroup();
    // Figma hangs the separator off the item, not the container; the trailing
    // one is dropped in CSS via `:last-child` rather than an `order` prop.
    for (const item of screen.getAllByRole('button')) {
      expect(item).toHaveClass(
        'border-e-[length:var(--ui-button-group-global-separator-border-width)]',
        'border-[color:var(--ui-button-group-global-separator-color)]',
        'last:border-e-0'
      );
    }
  });

  it('uses a clipped inset focus ring', () => {
    renderGroup();
    // An outer ring would be clipped away by the container's `overflow-hidden`.
    expect(screen.getByRole('button', { name: 'List' })).toHaveClass(
      'focus-visible:ring-[3px]',
      'focus-visible:ring-inset',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
  });

  it('renders a natively disabled button and marks it for styling', () => {
    render(
      <ButtonGroup aria-label="View mode">
        <ButtonGroupItem aria-label="List" disabled>
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    const item = screen.getByRole('button', { name: 'List' });
    expect(item).toBeDisabled();
    expect(item).toHaveAttribute('data-disabled');
  });

  it('marks every item disabled when the whole group is disabled', () => {
    renderGroup({ disabled: true });
    for (const item of screen.getAllByRole('button')) {
      expect(item).toHaveAttribute('data-disabled');
    }
  });

  it('skips a disabled item during arrow-key navigation', async () => {
    render(
      <ButtonGroup aria-label="View mode">
        <ButtonGroupItem aria-label="List">
          <Icon />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Grid" disabled>
          <Icon />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Table">
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'List' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Table' })).toHaveFocus();
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(
      <ButtonGroup aria-label="View mode">
        <ButtonGroupItem aria-label="List" onClick={onClick}>
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <ButtonGroup aria-label="View mode">
        <ButtonGroupItem aria-label="List" disabled onClick={onClick}>
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    await userEvent.click(screen.getByRole('button', { name: 'List' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ButtonGroup aria-label="View mode">
        <ButtonGroupItem aria-label="List" ref={ref}>
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <ButtonGroup aria-label="View mode">
        {/* `nativeButton={false}` tells Base UI the rendered element is not a
            real <button>, so it applies the button semantics itself. The item
            stays a button to the a11y tree — the group is a toolbar of
            actions, so this component intentionally exposes no link part. */}
        <ButtonGroupItem
          aria-label="Docs"
          nativeButton={false}
          render={<a href="/docs" />}
        >
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    const item = screen.getByRole('button', { name: 'Docs' });
    expect(item.tagName).toBe('A');
    expect(item).toHaveAttribute('href', '/docs');
  });

  it('merges a custom className with the item classes', () => {
    render(
      <ButtonGroup aria-label="View mode">
        <ButtonGroupItem aria-label="List" className="custom-class">
          <Icon />
        </ButtonGroupItem>
      </ButtonGroup>
    );
    expect(screen.getByRole('button', { name: 'List' })).toHaveClass(
      'custom-class',
      'h-[var(--ui-button-group-global-box-height)]'
    );
  });
});
