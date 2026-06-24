import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonMenu } from '../button-menu';

describe('ButtonMenu', () => {
  it('renders a button with its label and a chevron', () => {
    render(<ButtonMenu>Actions</ButtonMenu>);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('defaults to the primary variant token classes', () => {
    render(<ButtonMenu>Actions</ButtonMenu>);
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'h-[var(--ui-button-menu-global-container-height)]',
      'bg-[var(--ui-button-menu-primary-container-color-idle)]',
      'text-[var(--ui-button-menu-primary-label-color)]'
    );
  });

  it('applies the secondary variant token classes', () => {
    render(<ButtonMenu variant="secondary">Actions</ButtonMenu>);
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'bg-[var(--ui-button-menu-secondary-container-color-idle)]',
      'border-[var(--ui-button-menu-secondary-container-border-color-idle)]'
    );
  });

  it('is closed by default: no data-open, aria-expanded false omitted', () => {
    render(<ButtonMenu>Actions</ButtonMenu>);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).not.toHaveAttribute('data-open');
    expect(button).not.toHaveAttribute('aria-expanded');
  });

  it('reflects the open state via data-open and aria-expanded', () => {
    render(<ButtonMenu open>Actions</ButtonMenu>);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toHaveAttribute('data-open');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('merges a custom className with the base classes', () => {
    render(<ButtonMenu className="custom-class">Actions</ButtonMenu>);
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'custom-class',
      'h-[var(--ui-button-menu-global-container-height)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<ButtonMenu onClick={onClick}>Actions</ButtonMenu>);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <ButtonMenu disabled onClick={onClick}>
        Actions
      </ButtonMenu>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonMenu ref={ref}>Actions</ButtonMenu>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <ButtonMenu render={<a href="/menu" />}>Actions</ButtonMenu>
    );
    const link = screen.getByRole('link', { name: 'Actions' });
    expect(link).toHaveAttribute('href', '/menu');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
