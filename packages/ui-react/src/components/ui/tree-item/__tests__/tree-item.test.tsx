import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TreeItem } from '../tree-item';

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="tree-item-${name}"]`);

describe('TreeItem', () => {
  it('renders a plain div row with the default title', () => {
    const { container } = render(<TreeItem />);
    const root = container.firstElementChild as HTMLElement;

    expect(root.tagName).toBe('DIV');
    expect(root).toHaveAttribute('data-slot', 'tree-item');
    expect(screen.getByText('Title')).toBeInTheDocument();
    // A standalone row is not a valid ARIA tree on its own, so no role and no
    // forced tab stop — the consumer's tree composition supplies both.
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('renders the title it is given', () => {
    render(<TreeItem title="Backups" />);
    expect(screen.getByText('Backups')).toBeInTheDocument();
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('lays the row out with the design metrics and the hover background', () => {
    const { container } = render(<TreeItem />);
    expect(container.firstElementChild).toHaveClass(
      'flex',
      'min-w-32',
      'items-center',
      'gap-2',
      'px-2',
      'py-2',
      'rounded-sm',
      'hover:bg-[var(--ui-background-surface-hover)]'
    );
  });

  it('carries the library focus ring', () => {
    const { container } = render(<TreeItem />);
    expect(container.firstElementChild).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-[3px]',
      'focus-visible:ring-[var(--ui-focus-primary)]'
    );
  });

  it('colors the title with the on-surface text token and truncates it', () => {
    const { container } = render(<TreeItem title="A very long row label" />);
    expect(slot(container, 'title')).toHaveClass(
      'flex-1',
      'min-w-0',
      'truncate',
      'text-sm',
      'leading-6',
      'font-normal',
      'text-[var(--ui-text-on-surface-primary)]'
    );
  });

  // ── isExpandable ──

  it('shows the chevron affordance by default and hides it when not expandable', () => {
    const { container } = render(<TreeItem />);
    const expander = slot(container, 'expander');
    expect(expander).not.toBeNull();
    expect(expander).toHaveAttribute('aria-hidden', 'true');
    expect(expander).toHaveClass(
      'py-1',
      'text-[var(--ui-glyph-on-surface-primary)]'
    );
    // Direction-sensitive artwork mirrors under dir="rtl".
    expect(expander?.querySelector('svg')).toHaveClass('rtl:rotate-180');

    const { container: flat } = render(<TreeItem isExpandable={false} />);
    expect(slot(flat, 'expander')).toBeNull();
  });

  // ── expanded ──

  it('leaves the chevron pointing inline-end when not expanded', () => {
    const { container } = render(<TreeItem />);
    const chevron = slot(container, 'expander')?.querySelector('svg');
    expect(chevron).toHaveClass('rtl:rotate-180');
    expect(chevron).not.toHaveClass('rotate-90');
  });

  it('rotates the chevron a quarter turn when expanded', () => {
    const { container } = render(<TreeItem expanded />);
    const chevron = slot(container, 'expander')?.querySelector('svg');
    // A quarter turn from a right-pointing glyph reads as "down" in both
    // writing directions, so the RTL mirror must not also apply.
    expect(chevron).toHaveClass('rotate-90');
    expect(chevron).not.toHaveClass('rtl:rotate-180');
  });

  it('renders no chevron to rotate when the row is not expandable', () => {
    const { container } = render(<TreeItem isExpandable={false} expanded />);
    expect(slot(container, 'expander')).toBeNull();
  });

  // ── hasIcon / icon ──

  it('hides the icon slot by default', () => {
    const { container } = render(<TreeItem />);
    expect(slot(container, 'icon')).toBeNull();
  });

  it('renders the design placeholder icon when hasIcon has no icon', () => {
    const { container } = render(<TreeItem hasIcon />);
    const iconSlot = slot(container, 'icon');
    expect(iconSlot).not.toBeNull();
    expect(iconSlot?.querySelector('svg')).not.toBeNull();
    expect(iconSlot).toHaveClass('text-[var(--ui-glyph-on-surface-primary)]');
  });

  it('renders a custom icon in place of the placeholder', () => {
    const { container } = render(
      <TreeItem hasIcon icon={<span data-testid="custom-icon" />} />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(slot(container, 'icon')?.childElementCount).toBe(1);
  });

  it('ignores a supplied icon while hasIcon is false', () => {
    render(<TreeItem icon={<span data-testid="custom-icon" />} />);
    expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
  });

  // ── hasCheckbox / checkboxProps ──

  it('hides the checkbox by default', () => {
    const { container } = render(<TreeItem />);
    expect(slot(container, 'checkbox')).toBeNull();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders a checkbox named after the title when hasCheckbox is set', () => {
    render(<TreeItem hasCheckbox title="Backups" />);
    expect(
      screen.getByRole('checkbox', { name: 'Backups' })
    ).toBeInTheDocument();
  });

  it('forwards checkboxProps to the nested Checkbox', async () => {
    const onCheckedChange = vi.fn();
    render(
      <TreeItem
        hasCheckbox
        title="Backups"
        checkboxProps={{ checked: true, onCheckedChange, 'aria-label': 'Pick' }}
      />
    );

    const box = screen.getByRole('checkbox', { name: 'Pick' });
    expect(box).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  // ── selected ──

  it('is unhighlighted by default', () => {
    const { container } = render(<TreeItem />);
    expect(container.firstElementChild).not.toHaveClass(
      'bg-[var(--ui-background-surface-active)]'
    );
    expect(container.firstElementChild).not.toHaveAttribute('data-selected');
  });

  it('paints the highlighted background when selected', () => {
    const { container } = render(<TreeItem selected />);
    expect(container.firstElementChild).toHaveClass(
      'bg-[var(--ui-background-surface-active)]'
    );
    expect(container.firstElementChild).toHaveAttribute(
      'data-selected',
      'true'
    );
  });

  // ── hasExtras / children ──

  it('renders the extras slot with its children by default', () => {
    const { container } = render(
      <TreeItem>
        <button type="button">Rename</button>
      </TreeItem>
    );
    const extras = slot(container, 'extras');
    expect(extras).not.toBeNull();
    expect(extras).toHaveClass('min-w-4', 'shrink-0');
    expect(screen.getByRole('button', { name: 'Rename' })).toBeInTheDocument();
  });

  it('drops the extras slot and its children when hasExtras is false', () => {
    const { container } = render(
      <TreeItem hasExtras={false}>
        <button type="button">Rename</button>
      </TreeItem>
    );
    expect(slot(container, 'extras')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Rename' })).toBeNull();
  });

  // ── order ──

  it('orders the slots chevron, checkbox, icon, title, extras', () => {
    const { container } = render(
      <TreeItem hasCheckbox hasIcon>
        <span>extra</span>
      </TreeItem>
    );
    const order = Array.from(container.firstElementChild!.children).map((el) =>
      el.getAttribute('data-slot')
    );
    expect(order).toEqual([
      'tree-item-expander',
      'tree-item-checkbox',
      'tree-item-icon',
      'tree-item-title',
      'tree-item-extras',
    ]);
  });

  // ── composition ──

  it('composes into another element through the render prop', () => {
    render(<TreeItem title="Backups" render={<li role="treeitem" />} />);
    const item = screen.getByRole('treeitem');
    expect(item.tagName).toBe('LI');
    expect(item).toHaveClass('min-w-32');
  });

  it('passes native div props through, including onClick and tabIndex', async () => {
    const onClick = vi.fn();
    const { container } = render(<TreeItem onClick={onClick} tabIndex={0} />);
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute('tabindex', '0');
    await userEvent.click(root);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges a consumer className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<TreeItem ref={ref} className="w-64" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstElementChild).toHaveClass('w-64', 'min-w-32');
  });
});
