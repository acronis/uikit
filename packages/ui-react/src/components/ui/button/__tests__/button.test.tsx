import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
  it('renders a button with its children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('leads the ai variant with the Sparkles icon before the label', () => {
    render(<Button variant="ai">Ask AI</Button>);
    const button = screen.getByRole('button', { name: /Ask AI/ });
    expect(button).toHaveTextContent('Ask AI');
    // The icon is the first child (rendered before the label).
    expect(button.firstElementChild?.tagName.toLowerCase()).toBe('svg');
  });

  it('does not inject an icon for non-ai variants', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).querySelector('svg')).toBeNull();
  });

  it('applies the default variant and the single (32px) size classes', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass(
      'bg-[var(--ui-button-primary-container-color-idle)]',
      'text-[var(--ui-button-primary-label-color-idle)]',
      'h-[var(--ui-button-global-container-height)]'
    );
  });

  it('applies the requested variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass(
      'bg-[var(--ui-button-destructive-container-color-idle)]',
      'h-[var(--ui-button-global-container-height)]'
    );
  });

  it('merges a custom className with the variant classes', () => {
    render(<Button className="custom-class">Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'custom-class',
      'bg-[var(--ui-button-primary-container-color-idle)]'
    );
  });

  it('fires onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows a pointer cursor on every variant', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('cursor-pointer');
  });

  it('wires the ghost label text-decoration to its per-state tokens (underline on hover only)', () => {
    render(<Button variant="ghost">Docs</Button>);
    const button = screen.getByRole('button', { name: 'Docs' });
    // Ghost is the link-like variant: it underlines on hover and drops the
    // underline again on press, each state driven by its own token.
    expect(button).toHaveClass(
      '[text-decoration-line:var(--ui-button-ghost-label-text-decoration-idle)]',
      'hover:[text-decoration-line:var(--ui-button-ghost-label-text-decoration-hover)]',
      'active:[text-decoration-line:var(--ui-button-ghost-label-text-decoration-active)]',
      'disabled:[text-decoration-line:var(--ui-button-ghost-label-text-decoration-disabled)]'
    );
  });

  it('does not underline non-ghost variants', () => {
    render(<Button variant="default">Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).className).not.toMatch(
      /text-decoration-line|underline/
    );
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('composes with another element via the render prop', () => {
    render(
      <Button render={<a href="/home" />} variant="ghost">
        Home
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(link).toHaveClass('text-[var(--ui-button-ghost-label-color-idle)]');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
