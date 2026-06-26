import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={props.onItemClick}>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
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
    expect(screen.getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
  });

  it('renders open with defaultOpen, including a separator', () => {
    render(<DemoMenu defaultOpen />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('My account')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('themes the popup from the bridged semantic tokens', () => {
    render(<DemoMenu defaultOpen />);
    expect(screen.getByRole('menu')).toHaveClass('bg-background', 'text-foreground');
  });

  it('invokes an item handler on click', async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    render(<DemoMenu defaultOpen onItemClick={onItemClick} />);
    await user.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('renders a checkbox item with role menuitemcheckbox', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Show grid</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(
      screen.getByRole('menuitemcheckbox', { name: 'Show grid' })
    ).toBeInTheDocument();
  });

  it('forwards the ref to the popup', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent ref={ref}>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
