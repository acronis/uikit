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
  it('renders with indicator indent class', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked>Show toolbar</DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByRole('menuitemcheckbox', { name: /Show toolbar/ })).toHaveClass('ps-8');
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

  it('applies indicator indent class to radio items', () => {
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
    expect(screen.getByRole('menuitemradio', { name: 'Option A' })).toHaveClass('ps-8');
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

  it('applies ps-8 when inset=true', () => {
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
    expect(screen.getByText('Indented')).toHaveClass('ps-8');
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
