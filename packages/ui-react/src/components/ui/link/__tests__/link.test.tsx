import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Link } from '../link';

describe('Link', () => {
  it('renders an anchor with its href and label', () => {
    render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('applies the idle link token color', () => {
    render(<Link href="/docs">Docs</Link>);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass(
      'text-[var(--ui-link-normal-text-color-idle)]'
    );
  });

  it('does not set text-underline-position (matches ButtonGhost, which has no such override either)', () => {
    render(<Link href="/docs">Docs</Link>);
    const linkClasses = screen.getByRole('link', { name: 'Docs' }).className;
    expect(linkClasses).not.toMatch(/text-underline-position/);
  });

  it('renders the external icon when external', () => {
    const { container } = render(
      <Link href="https://x.test" external>
        Out
      </Link>
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('omits the external icon by default', () => {
    const { container } = render(<Link href="/docs">Docs</Link>);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders inert when disabled (aria-disabled, no href, not focusable)', () => {
    render(
      <Link href="/docs" disabled>
        Docs
      </Link>
    );
    const link = screen.getByText('Docs').closest('a') as HTMLAnchorElement;
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('wires the inverse surface tokens when variant="inverse"', () => {
    render(
      <Link href="/docs" variant="inverse">
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('text-[var(--ui-link-inverse-text-color-idle)]');
    expect(link.className).toContain(
      'hover:text-[var(--ui-link-inverse-text-color-hover)]'
    );
    expect(link.className).toContain(
      'active:text-[var(--ui-link-inverse-text-color-active)]'
    );
  });

  // The Figma set carries the `SquareArrowUpRight` layer only in its five
  // `background=normal` variants, so `external` is a no-op on the inverse surface —
  // exactly as toggling Figma's `External` on an inverse instance is.
  it('ignores external on the inverse surface', () => {
    const { container } = render(
      <Link href="/docs" variant="inverse" external>
        Docs
      </Link>
    );
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('still renders the external icon on the normal surface', () => {
    const { container } = render(
      <Link href="/docs" variant="normal" external>
        Docs
      </Link>
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not reference the normal tokens on the inverse surface', () => {
    render(
      <Link href="/docs" variant="inverse">
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs' }).className).not.toMatch(
      /--ui-link-normal-/
    );
  });

  // The Figma set has only four enabled inverse variants and marks the fifth
  // unsupported ("disable state not supported onBackdrop"), so `disabled` does nothing
  // at all here rather than being applied without its color.
  it('ignores disabled entirely on the inverse surface', () => {
    render(
      <Link href="/docs" variant="inverse" disabled>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).not.toHaveAttribute('aria-disabled');
    expect(link).not.toHaveAttribute('tabindex');
  });

  it('still navigates and fires onClick when disabled on the inverse surface', async () => {
    const onClick = vi.fn();
    render(
      <Link href="#" variant="inverse" disabled onClick={onClick}>
        Docs
      </Link>
    );
    await userEvent.click(screen.getByRole('link', { name: 'Docs' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('defaults to the normal surface', () => {
    render(<Link href="/docs">Docs</Link>);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass(
      'text-[var(--ui-link-normal-text-color-idle)]'
    );
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(
      <Link href="#" onClick={onClick}>
        Docs
      </Link>
    );
    await userEvent.click(screen.getByRole('link', { name: 'Docs' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders as a custom element via the render prop', () => {
    render(
      <Link render={<button type="button" />}>
        Action
      </Link>
    );
    const el = screen.getByRole('button', { name: 'Action' });
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveClass('text-[var(--ui-link-normal-text-color-idle)]');
  });

  it('forwards the ref to the underlying anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="/docs" ref={ref}>
        Docs
      </Link>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
