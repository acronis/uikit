import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ChatMenuItemExtras } from '../chat-menu-item-extras';

describe('ChatMenuItemExtras', () => {
  it('stays presentational (no role, no tab stop)', () => {
    const { container } = render(
      <ChatMenuItemExtras variant="tag" labelTag="Beta" />
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('wires the cluster gap to the MenuItemExtras container-gap token', () => {
    const { container } = render(
      <ChatMenuItemExtras variant="tag" labelTag="Beta" />
    );
    expect(container.firstElementChild).toHaveClass(
      'gap-[var(--ui-sidebar-secondary-menu-item-extras-global-container-gap)]',
      'items-center',
      'justify-end'
    );
  });

  it('defaults to the tag variant (matching the Figma set default)', () => {
    render(<ChatMenuItemExtras labelTag="Beta" labelShortcut="⌘H" />);
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('⌘H')).not.toBeInTheDocument();
  });

  describe('variant="tag"', () => {
    it('renders the label through the shipped Tag (info, sm)', () => {
      render(<ChatMenuItemExtras variant="tag" labelTag="Beta" />);
      const tag = screen.getByText('Beta').closest('span[class*="ui-tag-"]');
      expect(tag).not.toBeNull();
      // Figma constrains this slot to variant="info" size="sm".
      expect(tag).toHaveClass(
        'bg-[var(--ui-tag-info-container-color)]',
        'border-[var(--ui-tag-info-container-border-color)]',
        'text-[var(--ui-tag-info-label-color)]',
        'h-[var(--ui-tag-global-sm-container-height)]'
      );
    });

    it('does not render the shortcut text', () => {
      render(
        <ChatMenuItemExtras variant="tag" labelTag="Beta" labelShortcut="⌘H" />
      );
      expect(screen.queryByText('⌘H')).not.toBeInTheDocument();
    });
  });

  describe('variant="shortcut"', () => {
    it('renders the shortcut text with its own color + text-style tokens', () => {
      render(<ChatMenuItemExtras variant="shortcut" labelShortcut="⌘H" />);
      const shortcut = screen.getByText('⌘H');
      expect(shortcut).toHaveClass(
        'text-[var(--ui-sidebar-secondary-menu-item-extras-global-shortcut-color)]',
        'ui-sidebar-secondary-menu-item-extras-global-shortcut-text-style'
      );
    });

    it('aligns the shortcut to the logical end (RTL-safe)', () => {
      render(<ChatMenuItemExtras variant="shortcut" labelShortcut="⌘H" />);
      expect(screen.getByText('⌘H')).toHaveClass('text-end');
    });

    it('does not render a Tag', () => {
      const { container } = render(
        <ChatMenuItemExtras
          variant="shortcut"
          labelTag="Beta"
          labelShortcut="⌘H"
        />
      );
      expect(screen.queryByText('Beta')).not.toBeInTheDocument();
      expect(container.querySelector('[class*="ui-tag-"]')).toBeNull();
    });
  });

  it('merges a consumer className onto the root', () => {
    const { container } = render(
      <ChatMenuItemExtras variant="tag" labelTag="Beta" className="w-full" />
    );
    expect(container.firstElementChild).toHaveClass('w-full');
  });

  it('forwards arbitrary span props', () => {
    render(
      <ChatMenuItemExtras
        variant="shortcut"
        labelShortcut="⌘H"
        data-testid="extras"
      />
    );
    expect(screen.getByTestId('extras')).toBeInTheDocument();
  });

  it('forwards the ref to the underlying span', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<ChatMenuItemExtras ref={ref} variant="tag" labelTag="Beta" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
