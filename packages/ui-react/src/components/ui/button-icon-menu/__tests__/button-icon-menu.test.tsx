import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ButtonIconMenu } from '../button-icon-menu';

describe('ButtonIconMenu', () => {
  it('renders an icon-only button carrying the ellipsis glyph', () => {
    render(<ButtonIconMenu />);
    const button = screen.getByRole('button', { name: 'More options' });
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button).toHaveTextContent('');
  });

  it('announces itself as a menu trigger', () => {
    render(<ButtonIconMenu />);
    expect(
      screen.getByRole('button', { name: 'More options' })
    ).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('takes its accessible name from ariaLabel', () => {
    render(<ButtonIconMenu ariaLabel="Más opciones" />);
    expect(
      screen.getByRole('button', { name: 'Más opciones' })
    ).toBeInTheDocument();
  });

  it('lets a native aria-label override the default', () => {
    render(<ButtonIconMenu aria-label="Row actions" />);
    expect(
      screen.getByRole('button', { name: 'Row actions' })
    ).toBeInTheDocument();
  });

  it('applies the bordered (secondary) ButtonIcon token classes', () => {
    render(<ButtonIconMenu />);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveClass(
      'size-[var(--ui-button-icon-global-container-height)]',
      'bg-[var(--ui-button-icon-global-container-color-idle)]',
      'border-[var(--ui-button-icon-secondary-container-border-color-idle)]'
    );
  });

  it('shows a pointer cursor on hover', () => {
    render(<ButtonIconMenu />);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveClass(
      'cursor-pointer'
    );
  });

  it('is closed by default: no data-open, aria-expanded omitted', () => {
    render(<ButtonIconMenu />);
    const button = screen.getByRole('button', { name: 'More options' });
    expect(button).not.toHaveAttribute('data-open');
    expect(button).not.toHaveAttribute('aria-expanded');
  });

  it('reflects the open state via data-open and aria-expanded', () => {
    render(<ButtonIconMenu open />);
    const button = screen.getByRole('button', { name: 'More options' });
    expect(button).toHaveAttribute('data-open');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass(
      'data-[open]:bg-[var(--ui-button-icon-global-container-color-active)]',
      'data-[open]:border-[var(--ui-button-icon-secondary-container-border-color-active)]'
    );
  });

  it('merges a custom className with the base classes', () => {
    render(<ButtonIconMenu className="custom-class" />);
    expect(screen.getByRole('button', { name: 'More options' })).toHaveClass(
      'custom-class',
      'size-[var(--ui-button-icon-global-container-height)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<ButtonIconMenu onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'More options' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<ButtonIconMenu disabled onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'More options' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonIconMenu ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(<ButtonIconMenu render={<a href="/actions" />} />);
    const link = screen.getByRole('link', { name: 'More options' });
    expect(link).toHaveAttribute('href', '/actions');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
