import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonIcon } from '../button-icon';

const Icon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16">
    <path d="M8 0v16M0 8h16" />
  </svg>
);

describe('ButtonIcon', () => {
  it('renders an icon-only button with its accessible name', () => {
    render(
      <ButtonIcon aria-label="Add">
        <Icon />
      </ButtonIcon>
    );
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('applies the size and idle token classes', () => {
    render(
      <ButtonIcon aria-label="Add">
        <Icon />
      </ButtonIcon>
    );
    expect(screen.getByRole('button', { name: 'Add' })).toHaveClass(
      'size-[var(--ui-button-icon-global-container-height)]',
      'bg-[var(--ui-button-icon-global-container-idle)]',
      'text-[var(--ui-button-icon-global-icon-idle)]'
    );
  });

  it('merges a custom className with the base classes', () => {
    render(
      <ButtonIcon aria-label="Add" className="custom-class">
        <Icon />
      </ButtonIcon>
    );
    expect(screen.getByRole('button', { name: 'Add' })).toHaveClass(
      'custom-class',
      'size-[var(--ui-button-icon-global-container-height)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(
      <ButtonIcon aria-label="Add" onClick={onClick}>
        <Icon />
      </ButtonIcon>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <ButtonIcon aria-label="Add" disabled onClick={onClick}>
        <Icon />
      </ButtonIcon>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ButtonIcon aria-label="Add" ref={ref}>
        <Icon />
      </ButtonIcon>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <ButtonIcon aria-label="Home" render={<a href="/home" />}>
        <Icon />
      </ButtonIcon>
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
