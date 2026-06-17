import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonDropdown } from '../button-dropdown';

describe('ButtonDropdown', () => {
  it('renders a button with its label and a chevron', () => {
    render(<ButtonDropdown>Actions</ButtonDropdown>);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('defaults to the primary variant token classes', () => {
    render(<ButtonDropdown>Actions</ButtonDropdown>);
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'h-[var(--ui-button-dropdown-global-container-height)]',
      'bg-[var(--ui-button-dropdown-primary-container-color-idle)]',
      'text-[var(--ui-button-dropdown-primary-label-color)]'
    );
  });

  it('applies the secondary variant token classes', () => {
    render(<ButtonDropdown variant="secondary">Actions</ButtonDropdown>);
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'bg-[var(--ui-button-dropdown-secondary-container-color-idle)]',
      'border-[var(--ui-button-dropdown-secondary-container-border-color-idle)]'
    );
  });

  it('is closed by default: no data-open, aria-expanded false omitted', () => {
    render(<ButtonDropdown>Actions</ButtonDropdown>);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).not.toHaveAttribute('data-open');
    expect(button).not.toHaveAttribute('aria-expanded');
  });

  it('reflects the open state via data-open and aria-expanded', () => {
    render(<ButtonDropdown open>Actions</ButtonDropdown>);
    const button = screen.getByRole('button', { name: 'Actions' });
    expect(button).toHaveAttribute('data-open');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('merges a custom className with the base classes', () => {
    render(<ButtonDropdown className="custom-class">Actions</ButtonDropdown>);
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveClass(
      'custom-class',
      'h-[var(--ui-button-dropdown-global-container-height)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<ButtonDropdown onClick={onClick}>Actions</ButtonDropdown>);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <ButtonDropdown disabled onClick={onClick}>
        Actions
      </ButtonDropdown>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonDropdown ref={ref}>Actions</ButtonDropdown>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <ButtonDropdown render={<a href="/menu" />}>Actions</ButtonDropdown>
    );
    const link = screen.getByRole('link', { name: 'Actions' });
    expect(link).toHaveAttribute('href', '/menu');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
