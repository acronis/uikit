import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonIconInput } from '../button-icon-input';

const Icon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16">
    <path d="M8 0v16M0 8h16" />
  </svg>
);

describe('ButtonIconInput', () => {
  it('renders an icon-only button with its accessible name', () => {
    render(
      <ButtonIconInput aria-label="Show password">
        <Icon />
      </ButtonIconInput>
    );
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
  });

  it('applies the size and idle token classes for the default normal variant', () => {
    render(
      <ButtonIconInput aria-label="Show password">
        <Icon />
      </ButtonIconInput>
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveClass(
      'size-[var(--ui-button-icon-input-global-container-width)]',
      'bg-[var(--ui-button-icon-input-normal-container-color-idle)]',
      'text-[var(--ui-button-icon-input-normal-icon-color-idle)]'
    );
  });

  it('applies the error variant token classes', () => {
    render(
      <ButtonIconInput aria-label="Show password" variant="error">
        <Icon />
      </ButtonIconInput>
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveClass(
      'bg-[var(--ui-button-icon-input-error-container-color-idle)]',
      'text-[var(--ui-button-icon-input-error-icon-color-idle)]'
    );
  });

  it('merges a custom className with the base classes', () => {
    render(
      <ButtonIconInput aria-label="Show password" className="custom-class">
        <Icon />
      </ButtonIconInput>
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveClass(
      'custom-class',
      'size-[var(--ui-button-icon-input-global-container-width)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(
      <ButtonIconInput aria-label="Show password" onClick={onClick}>
        <Icon />
      </ButtonIconInput>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <ButtonIconInput aria-label="Show password" disabled onClick={onClick}>
        <Icon />
      </ButtonIconInput>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ButtonIconInput aria-label="Show password" ref={ref}>
        <Icon />
      </ButtonIconInput>
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <ButtonIconInput aria-label="Home" render={<a href="/home" />}>
        <Icon />
      </ButtonIconInput>
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has cursor-pointer by default', () => {
    render(
      <ButtonIconInput aria-label="Show password">
        <Icon />
      </ButtonIconInput>
    );
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveClass(
      'cursor-pointer'
    );
  });

  it('defaults to type="button" so it cannot submit an enclosing form', () => {
    render(
      <ButtonIconInput aria-label="Show password">
        <Icon />
      </ButtonIconInput>
    );
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toHaveAttribute('type', 'button');
  });

  it('honors an explicit type override', () => {
    render(
      <ButtonIconInput aria-label="Submit" type="submit">
        <Icon />
      </ButtonIconInput>
    );
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit'
    );
  });
});
