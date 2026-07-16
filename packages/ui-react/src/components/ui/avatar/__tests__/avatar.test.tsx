import { createRef, type ComponentRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../avatar';

describe('Avatar', () => {
  it('stays presentational by default (no role, no tab stop)', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('renders fallback initials', () => {
    render(
      <Avatar>
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('SN')).toBeInTheDocument();
  });

  it('applies the default color (teal) tokens', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('bg-[var(--ui-avatar-color-teal)]');
    expect(root.className).toContain('text-[var(--ui-avatar-label-color-teal)]');
  });

  it('draws the 2px ring outside the 32px circle (box-shadow, not an inset border)', () => {
    // PLTFRM-92393: Figma draws the stroke with strokeAlign OUTSIDE, so the
    // colored circle is the full 32px. A CSS border would be inset (border-box),
    // shrinking the visible circle to 28px — assert we ring instead.
    const { container } = render(
      <Avatar>
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('size-[var(--ui-avatar-global-avatar-size)]');
    expect(root.className).toContain(
      '[box-shadow:0_0_0_var(--ui-avatar-global-avatar-border-border-width)_var(--ui-avatar-global-avatar-border-color)]'
    );
    expect(root.className).not.toMatch(/\bborder-\[length:/);
  });

  it('applies the requested color variant', () => {
    const { container } = render(
      <Avatar color="violet">
        <AvatarFallback>GA</AvatarFallback>
      </Avatar>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('bg-[var(--ui-avatar-color-violet)]');
    expect(root.className).toContain('text-[var(--ui-avatar-label-color-violet)]');
  });

  it('merges a custom className', () => {
    const { container } = render(
      <Avatar className="custom-x">
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'custom-x'
    );
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<ComponentRef<typeof Avatar>>();
    render(
      <Avatar ref={ref}>
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('passes src/alt through AvatarImage', () => {
    render(
      <Avatar>
        <AvatarImage src="/me.png" alt="Sam N." />
        <AvatarFallback>SN</AvatarFallback>
      </Avatar>
    );
    // The fallback renders while the image is still loading (jsdom never fires load).
    expect(screen.getByText('SN')).toBeInTheDocument();
  });
});

describe('AvatarGroup', () => {
  it('renders all avatars and applies the overlap offset to non-first items', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar color="teal">
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
        <Avatar color="violet">
          <AvatarFallback>GA</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    );
    expect(screen.getByText('SN')).toBeInTheDocument();
    expect(screen.getByText('GA')).toBeInTheDocument();
    const group = container.firstElementChild as HTMLElement;
    expect(group.className).toContain(
      '[&>*:not(:first-child)]:ms-[var(--ui-avatar-global-avatar-group-gap)]'
    );
  });
});
