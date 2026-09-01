import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../dropdown-menu';

function DemoMenu(props: {
  defaultOpen?: boolean;
  onItemClick?: () => void;
}) {
  return (
    <DropdownMenu defaultOpen={props.defaultOpen}>
      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={props.onItemClick}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('is closed by default and opens from the trigger', async () => {
    const user = userEvent.setup();
    render(<DemoMenu />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Profile/ })).toBeInTheDocument();
  });

  it('renders open with defaultOpen', () => {
    render(<DemoMenu defaultOpen />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Profile/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
  });

  it('themes the popup from the --ui-button-menu-dropdown tokens', () => {
    render(<DemoMenu defaultOpen />);
    expect(screen.getByRole('menu')).toHaveClass(
      'bg-[var(--ui-button-menu-dropdown-container-color)]',
      'border-[var(--ui-button-menu-dropdown-container-border-color)]',
      'rounded-[var(--ui-button-menu-dropdown-container-border-radius)]'
    );
  });

  it('themes the item from the --ui-button-menu-dropdown-item tokens', () => {
    render(<DemoMenu defaultOpen />);
    expect(screen.getByRole('menuitem', { name: /Profile/ })).toHaveClass(
      'bg-[var(--ui-button-menu-dropdown-item-container-color-idle)]',
      'text-[var(--ui-button-menu-dropdown-item-label-color)]'
    );
  });

  it('invokes an item handler on click', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<DemoMenu defaultOpen onItemClick={onItemClick} />);
    await user.click(screen.getByRole('menuitem', { name: /Profile/ }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('renders a shortcut inside the item', () => {
    render(<DemoMenu defaultOpen />);
    expect(screen.getByText('⇧⌘P')).toBeInTheDocument();
    expect(screen.getByText('⇧⌘P')).toHaveClass(
      'text-[var(--ui-button-menu-dropdown-extras-shortcut-label-color)]'
    );
  });

  it('renders sections with auto-border between groups', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem>Two</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const groups = screen.getByRole('menu').querySelectorAll('[role="group"]');
    expect(groups).toHaveLength(2);
    expect(groups[0]).toHaveClass(
      'py-[var(--ui-button-menu-dropdown-section-container-padding-y)]'
    );
  });

  it('centers the sub-trigger cascade chevron against the label', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const chevron = screen
      .getByRole('menuitem', { name: /Share/ })
      .querySelector('svg');
    expect(chevron).toHaveClass('self-center', 'ms-auto');
  });

  // #585 — Base UI's Menu.Root defaults to `modal={true}`, which scroll-locks
  // the document and renders an `InternalBackdrop` over the page so pointer
  // events never reach anything behind the menu. A dropdown is a light-dismiss
  // overlay, so DropdownMenu pins `modal={false}`. The backdrop is the only
  // DOM-observable manifestation of that choice: `MenuPositioner` renders it
  // (a `[role="presentation"][data-base-ui-inert]` div) exactly when
  // `modal && lastOpenChangeReason !== 'trigger-hover'`. The scroll lock is
  // structurally skipped for `modal={false}` too, but happy-dom has no real
  // scrollbar and takes an early-return branch in `useScrollLock`, so no
  // assertion on `document.body.style` would discriminate here.
  it('opens non-modally, without the pointer-blocking modal backdrop', async () => {
    const user = userEvent.setup();
    render(<DemoMenu />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(
      document.querySelectorAll('[role="presentation"][data-base-ui-inert]')
    ).toHaveLength(0);
  });

  it('light-dismisses on an outside click, leaving outside controls interactive', async () => {
    const user = userEvent.setup();
    const onOutsideClick = vi.fn();
    render(
      <div>
        <button type="button" onClick={onOutsideClick}>
          Outside
        </button>
        <DemoMenu />
      </div>
    );

    const outside = screen.getByRole('button', { name: 'Outside' });
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(outside);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('forwards the ref to the popup', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent ref={ref}>
          <DropdownMenuGroup>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

describe('DropdownMenuCheckboxItem', () => {
  it('reserves an in-flow indicator slot so labels align with icon items', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked={false}>Show toolbar</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const item = screen.getByRole('menuitemcheckbox', { name: /Show toolbar/ });
    expect(item).not.toHaveClass('ps-8');
    expect(item.firstElementChild).toHaveClass('h-6', 'w-4', 'shrink-0');
  });

  it('renders the check glyph only when checked', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked>On</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={false}>Off</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const glyph = screen
      .getByRole('menuitemcheckbox', { name: 'On' })
      .querySelector('svg');
    expect(glyph).not.toBeNull();
    expect(glyph).toHaveAttribute('width', '16');
    expect(glyph).toHaveAttribute('height', '16');
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Off' }).querySelector('svg')
    ).toBeNull();
  });

  it('reflects checked state via aria-checked', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked>Enabled</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={false}>Disabled</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByRole('menuitemcheckbox', { name: 'Enabled' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Disabled' })).toHaveAttribute('aria-checked', 'false');
  });
});

describe('DropdownMenuRadioGroup / DropdownMenuRadioItem', () => {
  it('marks only the selected value as checked', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup value="asc">
              <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByRole('menuitemradio', { name: 'Ascending' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Descending' })).toHaveAttribute('aria-checked', 'false');
  });

  it('renders a sized dot indicator on the selected item only', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup value="a">
              <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const selected = screen.getByRole('menuitemradio', { name: 'Option A' });
    const dot = selected.querySelector('.rounded-full');
    // `block` is what makes the dot's size apply — Base UI renders the
    // indicator as an inline `<span>`, which would ignore width/height.
    expect(dot).toHaveClass('block', 'size-2');
    expect(
      screen.getByRole('menuitemradio', { name: 'Option B' }).querySelector('.rounded-full')
    ).toBeNull();
  });

  it('reserves an in-flow indicator slot instead of a hardcoded indent', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup value="a">
              <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const item = screen.getByRole('menuitemradio', { name: 'Option A' });
    expect(item).not.toHaveClass('ps-8');
    expect(item.firstElementChild).toHaveClass('h-6', 'w-4', 'shrink-0');
  });
});

describe('DropdownMenuLabel', () => {
  it('renders label text with token classes', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const label = screen.getByText('My Account');
    expect(label).toHaveClass(
      'px-[var(--ui-button-menu-dropdown-item-container-padding-x)]',
      'text-[var(--ui-button-menu-dropdown-item-label-color)]'
    );
  });

  it('indents to the indicator slot when inset=true', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel inset>Indented</DropdownMenuLabel>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText('Indented')).toHaveClass(
      'ps-[calc(var(--ui-button-menu-dropdown-item-container-padding-x)+1rem+var(--ui-button-menu-dropdown-item-container-gap))]'
    );
  });
});

describe('DropdownMenuSeparator', () => {
  it('renders with role=separator and token classes', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Above</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Below</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveClass(
      'bg-[var(--ui-button-menu-dropdown-section-container-border-color)]',
      'h-[var(--ui-button-menu-dropdown-section-container-border-width)]'
    );
  });
});
