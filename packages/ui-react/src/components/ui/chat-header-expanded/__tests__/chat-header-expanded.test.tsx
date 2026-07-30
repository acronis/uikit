import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  ChatHeaderExpanded,
  ChatHeaderExpandedTab,
  ChatHeaderExpandedTabs,
} from '../chat-header-expanded';

/** The composed tab content this header is designed to receive. */
function Tabs() {
  return (
    <ChatHeaderExpandedTabs>
      <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
      <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
    </ChatHeaderExpandedTabs>
  );
}

describe('ChatHeaderExpanded', () => {
  it('renders a header band wired to the Chat token tier', () => {
    render(
      <ChatHeaderExpanded>
        <Tabs />
      </ChatHeaderExpanded>
    );

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('h-[var(--ui-chat-header-height)]');
    expect(header).toHaveClass('px-[var(--ui-chat-header-padding-x)]');
    expect(header).toHaveClass(
      'border-b-[length:var(--ui-chat-global-border-width)]'
    );
    expect(header).toHaveClass('border-[var(--ui-chat-global-border-color)]');
  });

  it('renders composed tab children rather than flattened label props', () => {
    render(
      <ChatHeaderExpanded>
        <Tabs />
      </ChatHeaderExpanded>
    );

    expect(screen.getByRole('tab', { name: /Acronis AI/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Tasks/ })).toBeInTheDocument();
  });

  it('renders only the new-chat action by default', () => {
    render(
      <ChatHeaderExpanded>
        <Tabs />
      </ChatHeaderExpanded>
    );

    expect(screen.getByRole('button', { name: 'New chat' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Chat history' })
    ).not.toBeInTheDocument();
  });

  it('adds the history action when hasHistory is set', () => {
    render(
      <ChatHeaderExpanded hasHistory>
        <Tabs />
      </ChatHeaderExpanded>
    );

    expect(
      screen.getByRole('button', { name: 'Chat history' })
    ).toBeInTheDocument();
  });

  it('orders the history action before the new-chat action', () => {
    render(
      <ChatHeaderExpanded hasHistory>
        <Tabs />
      </ChatHeaderExpanded>
    );

    const history = screen.getByRole('button', { name: 'Chat history' });
    const newChat = screen.getByRole('button', { name: 'New chat' });
    expect(
      history.compareDocumentPosition(newChat) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('exposes the action labels as overridable props (localization)', () => {
    render(
      <ChatHeaderExpanded
        hasHistory
        newChatLabel="Neuer Chat"
        historyLabel="Chatverlauf"
      >
        <Tabs />
      </ChatHeaderExpanded>
    );

    expect(screen.getByRole('button', { name: 'Neuer Chat' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Chatverlauf' })
    ).toBeInTheDocument();
  });

  it('composes a different element via the render prop', () => {
    render(
      <ChatHeaderExpanded render={<section aria-label="Chat header" />}>
        <Tabs />
      </ChatHeaderExpanded>
    );

    const root = screen.getByRole('region', { name: 'Chat header' });
    expect(root.tagName).toBe('SECTION');
    expect(root).toHaveClass('h-[var(--ui-chat-header-height)]');
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <ChatHeaderExpanded ref={ref}>
        <Tabs />
      </ChatHeaderExpanded>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('HEADER');
  });

  it('merges a consumer className onto the root', () => {
    render(
      <ChatHeaderExpanded className="custom-header">
        <Tabs />
      </ChatHeaderExpanded>
    );

    expect(screen.getByRole('banner')).toHaveClass('custom-header');
  });
});

// The pill tabs are an inlined PLACEHOLDER for the unshipped standalone
// SegmentControl component. These tests pin the contract the placeholder is
// expected to keep until it is swapped out.
describe('ChatHeaderExpandedTabs (SegmentControl placeholder)', () => {
  it('renders a tablist wired to the SegmentControl container tokens', () => {
    render(
      <ChatHeaderExpandedTabs data-testid="tabs">
        <ChatHeaderExpandedTab active>One</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const group = screen.getByTestId('tabs');
    expect(group).toHaveClass('bg-[var(--ui-segment-control-container-color)]');
    expect(group).toHaveClass(
      'rounded-[var(--ui-segment-control-container-border-radius)]'
    );
    expect(group).toHaveClass(
      'h-[var(--ui-segment-control-container-height)]'
    );
  });

  it('hides the overflow-scroll affordance by default', () => {
    render(
      <ChatHeaderExpandedTabs>
        <ChatHeaderExpandedTab active>One</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    );

    expect(
      screen.queryByRole('button', { name: 'Scroll tabs forward' })
    ).not.toBeInTheDocument();
  });

  it('renders both scroll affordance buttons when hasScroll is set', () => {
    render(
      <ChatHeaderExpandedTabs hasScroll>
        <ChatHeaderExpandedTab active>One</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    );

    expect(
      screen.getByRole('button', { name: 'Scroll tabs backward' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Scroll tabs forward' })
    ).toBeInTheDocument();
  });

  it('exposes the scroll affordance labels as overridable props', () => {
    render(
      <ChatHeaderExpandedTabs
        hasScroll
        scrollBackwardLabel="Zurück"
        scrollForwardLabel="Vorwärts"
      >
        <ChatHeaderExpandedTab active>One</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    );

    expect(screen.getByRole('button', { name: 'Zurück' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vorwärts' })).toBeInTheDocument();
  });

  it('mirrors the scroll affordance edge and separator logically for RTL', () => {
    render(
      <ChatHeaderExpandedTabs hasScroll scrollForwardLabel="Forward">
        <ChatHeaderExpandedTab active>One</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    );

    const forward = screen.getByRole('button', { name: 'Forward' });
    // Logical inline-start border, not `border-l`.
    expect(forward).toHaveClass(
      'border-s-[length:var(--ui-segment-control-box-icon-border-width)]'
    );
    // Pinned to the logical inline-end edge, not `right-`.
    expect(forward.parentElement).toHaveClass('end-[-1px]');
  });

  it('forwards a ref to the tab group', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ChatHeaderExpandedTabs ref={ref}>
        <ChatHeaderExpandedTab active>One</ChatHeaderExpandedTab>
      </ChatHeaderExpandedTabs>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('ChatHeaderExpandedTab (SegmentControlItem placeholder)', () => {
  it('marks the active tab as selected and wires the active tokens', () => {
    render(<ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>);

    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveClass('bg-[var(--ui-segment-control-item-color-active)]');
    expect(tab).toHaveClass(
      'text-[var(--ui-segment-control-value-color-active)]'
    );
  });

  it('wires the idle tokens (including a hover state of its own) when not active', () => {
    render(<ChatHeaderExpandedTab>Tasks</ChatHeaderExpandedTab>);

    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'false');
    expect(tab).toHaveClass('bg-[var(--ui-segment-control-item-color-idle)]');
    expect(tab).toHaveClass('text-[var(--ui-segment-control-value-color-idle)]');
    // Each interaction state must reference its own token.
    expect(tab).toHaveClass(
      'hover:bg-[var(--ui-segment-control-item-color-hover)]'
    );
    expect(tab).toHaveClass(
      'hover:text-[var(--ui-segment-control-value-color-hover)]'
    );
  });

  it('uses the generated SegmentControl value text style', () => {
    render(<ChatHeaderExpandedTab>Tasks</ChatHeaderExpandedTab>);
    expect(screen.getByRole('tab')).toHaveClass(
      'ui-segment-control-value-text-style'
    );
  });

  it('renders no counter by default', () => {
    render(<ChatHeaderExpandedTab>Tasks</ChatHeaderExpandedTab>);
    expect(screen.getByRole('tab').textContent).toBe('Tasks');
  });

  it('renders the counter through the shared Tag component (ai / sm)', () => {
    render(<ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>);

    const counter = screen.getByText('7');
    // Tag's `ai` variant paints its gradient border via a `background` shorthand.
    const tag = counter.closest('span[class*="--ui-tag-ai-label-color"]');
    expect(tag).not.toBeNull();
    expect(tag).toHaveClass('h-[var(--ui-tag-global-sm-container-height)]');
  });

  it('renders a counter of 0 (not treated as absent)', () => {
    render(<ChatHeaderExpandedTab counter={0}>Tasks</ChatHeaderExpandedTab>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const onClick = vi.fn();
    render(
      <ChatHeaderExpandedTab onClick={onClick}>Tasks</ChatHeaderExpandedTab>
    );

    await userEvent.click(screen.getByRole('tab'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards a ref to the tab button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ChatHeaderExpandedTab ref={ref} active>
        One
      </ChatHeaderExpandedTab>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.type).toBe('button');
  });
});
