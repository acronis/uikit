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
      'text-[var(--ui-link-color-idle)]'
    );
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
    expect(el).toHaveClass('text-[var(--ui-link-color-idle)]');
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
