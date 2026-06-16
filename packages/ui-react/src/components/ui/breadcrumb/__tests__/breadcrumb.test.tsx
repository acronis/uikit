import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../breadcrumb';

function Trail() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe('Breadcrumb', () => {
  it('renders a navigation landmark labelled "breadcrumb"', () => {
    render(<Trail />);
    expect(
      screen.getByRole('navigation', { name: 'breadcrumb' })
    ).toBeInTheDocument();
  });

  it('renders the trail as an ordered list of items', () => {
    render(<Trail />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    // 3 breadcrumb items + 2 separators (separators are aria-hidden li's)
    expect(list.querySelectorAll('li')).toHaveLength(5);
  });

  it('renders links with their href and the link token color', () => {
    render(<Trail />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass('text-[var(--ui-breadcrumb-link-label-color-idle)]');
  });

  it('marks the current page with aria-current and the value token color', () => {
    render(<Trail />);
    const page = screen.getByText('Settings');
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveAttribute('aria-disabled', 'true');
    expect(page).toHaveClass('text-[var(--ui-breadcrumb-page-label-color)]');
    // Exposed as a disabled link (role=link), so it is distinguished from the
    // navigable links: it carries no href and is the only aria-current item.
    expect(page).not.toHaveAttribute('href');
    const currentLinks = screen
      .getAllByRole('link')
      .filter((el) => el.getAttribute('aria-current') === 'page');
    expect(currentLinks).toEqual([page]);
  });

  it('renders a default chevron separator hidden from assistive tech', () => {
    render(<Trail />);
    const list = screen.getByRole('list');
    const separators = list.querySelectorAll('li[role="presentation"]');
    expect(separators).toHaveLength(2);
    separators.forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
      expect(sep.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('accepts a custom separator', () => {
    render(
      <BreadcrumbList>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
      </BreadcrumbList>
    );
    const sep = screen.getByRole('presentation', { hidden: true });
    expect(sep).toHaveTextContent('/');
    expect(sep.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders an ellipsis with an accessible "More" label', () => {
    render(<BreadcrumbEllipsis />);
    expect(screen.getByText('More')).toHaveClass('sr-only');
  });

  it('composes a link with another element via the render prop', async () => {
    const onClick = vi.fn();
    render(
      <BreadcrumbLink render={<button type="button" onClick={onClick} />}>
        Home
      </BreadcrumbLink>
    );
    const button = screen.getByRole('button', { name: 'Home' });
    expect(button).toHaveClass('text-[var(--ui-breadcrumb-link-label-color-idle)]');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('forwards refs to the underlying elements', () => {
    const navRef = createRef<HTMLElement>();
    const listRef = createRef<HTMLOListElement>();
    const linkRef = createRef<HTMLAnchorElement>();
    render(
      <Breadcrumb ref={navRef}>
        <BreadcrumbList ref={listRef}>
          <BreadcrumbItem>
            <BreadcrumbLink ref={linkRef} href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
    expect(navRef.current?.tagName).toBe('NAV');
    expect(listRef.current).toBeInstanceOf(HTMLOListElement);
    expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
