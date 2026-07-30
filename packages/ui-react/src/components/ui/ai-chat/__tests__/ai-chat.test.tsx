import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AiChat } from '../ai-chat';

describe('AiChat', () => {
  it('defaults to the full-width variant', () => {
    render(<AiChat data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('w-full');
  });

  describe('collapsed', () => {
    it('renders the collapsed rail width and the branding header', () => {
      render(<AiChat variant="collapsed" data-testid="root" />);

      const root = screen.getByTestId('root');
      expect(root).toHaveClass('w-[var(--ui-chat-container-collapsed-width)]');
      // Not `getByRole('banner')` — this `<header>` is nested inside the
      // root `<aside>` landmark, so per HTML-AAM it maps to `generic`, not
      // `banner` (see chat-header-expanded's "Avoiding a duplicate banner
      // landmark" doc for the same distinction on its sibling component).
      expect(root.querySelector('header')).toBeInTheDocument();
    });

    it('renders the icon-only nav and footer actions', () => {
      render(<AiChat variant="collapsed" />);

      expect(screen.getByRole('button', { name: 'Chat' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Tasks (new activity)' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Maximize chat' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Show full-width chat' })
      ).toBeInTheDocument();
    });

    it('does not render children (no room for the feed)', () => {
      render(
        <AiChat variant="collapsed">
          <div data-testid="feed-content">hello</div>
        </AiChat>
      );

      expect(screen.queryByTestId('feed-content')).not.toBeInTheDocument();
    });
  });

  describe('expanded', () => {
    it('renders the expanded panel width and the tabbed header', () => {
      render(<AiChat variant="expanded" data-testid="root" />);

      const root = screen.getByTestId('root');
      expect(root).toHaveClass(
        'w-[var(--ui-chat-container-expanded-max-width)]'
      );
      expect(root).toHaveClass(
        'min-w-[var(--ui-chat-container-expanded-min-width)]'
      );
      expect(screen.getByRole('tab', { name: 'Acronis AI' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tasks' })).toBeInTheDocument();
    });

    it('renders children inside the feed area', () => {
      render(
        <AiChat variant="expanded">
          <div data-testid="feed-content">hello</div>
        </AiChat>
      );

      expect(screen.getByTestId('feed-content')).toBeInTheDocument();
    });

    it('renders the footer variant-switch actions with their shortcuts', () => {
      render(<AiChat variant="expanded" />);

      expect(
        screen.getByRole('button', { name: /Maximize chat/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Collapse chat/ })
      ).toBeInTheDocument();
      expect(screen.getByText('⌘H')).toBeInTheDocument();
      expect(screen.getByText('⌘C')).toBeInTheDocument();
    });
  });

  describe('full-width', () => {
    it('renders the sidebar and body panes', () => {
      render(<AiChat variant="full-width" />);

      expect(screen.getByText('Acronis AI')).toBeInTheDocument();
      expect(screen.getByText('Chat name')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /New chat/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Minimize chat/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Collapse chat/ })
      ).toBeInTheDocument();
    });

    it('renders children inside the body feed area', () => {
      render(
        <AiChat variant="full-width">
          <div data-testid="feed-content">hello</div>
        </AiChat>
      );

      expect(screen.getByTestId('feed-content')).toBeInTheDocument();
    });
  });

  it('composes a different element via the render prop', () => {
    render(<AiChat variant="collapsed" render={<section aria-label="AI chat" />} />);

    const root = screen.getByRole('region', { name: 'AI chat' });
    expect(root.tagName).toBe('SECTION');
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLElement>();
    render(<AiChat ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('ASIDE');
  });

  it('merges a consumer className onto the root', () => {
    render(<AiChat className="custom-chat" data-testid="root" />);
    expect(screen.getByTestId('root')).toHaveClass('custom-chat');
  });

  describe('variant switching', () => {
    it('is uncontrolled via defaultVariant — clicking a footer action changes the render', async () => {
      const user = userEvent.setup();
      render(<AiChat defaultVariant="expanded" />);

      await user.click(screen.getByRole('button', { name: /Collapse chat/ }));

      expect(
        screen.getByRole('button', { name: 'Maximize chat' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('tab', { name: 'Acronis AI' })
      ).not.toBeInTheDocument();
    });

    it('calls onVariantChange for every wired action', async () => {
      const user = userEvent.setup();
      const onVariantChange = vi.fn();
      render(<AiChat defaultVariant="expanded" onVariantChange={onVariantChange} />);

      await user.click(screen.getByRole('button', { name: /Maximize chat/ }));
      expect(onVariantChange).toHaveBeenCalledWith('full-width');
    });

    it('when variant is controlled, a click only fires onVariantChange and does not self-update', async () => {
      const user = userEvent.setup();
      const onVariantChange = vi.fn();
      render(<AiChat variant="expanded" onVariantChange={onVariantChange} />);

      await user.click(screen.getByRole('button', { name: /Collapse chat/ }));

      expect(onVariantChange).toHaveBeenCalledWith('collapsed');
      // Still rendering the controlled `expanded` variant — the consumer
      // didn't feed the new value back in.
      expect(screen.getByRole('tab', { name: 'Acronis AI' })).toBeInTheDocument();
    });

    it('collapsed rail: "Maximize chat" expands and "Show full-width chat" goes full-width', async () => {
      const user = userEvent.setup();
      const onVariantChange = vi.fn();
      render(<AiChat defaultVariant="collapsed" onVariantChange={onVariantChange} />);

      await user.click(screen.getByRole('button', { name: 'Show full-width chat' }));
      expect(onVariantChange).toHaveBeenCalledWith('full-width');
    });

    it('full-width sidebar: "Minimize chat" returns to expanded, "Collapse chat" collapses', async () => {
      const user = userEvent.setup();
      const onVariantChange = vi.fn();
      render(<AiChat defaultVariant="full-width" onVariantChange={onVariantChange} />);

      await user.click(screen.getByRole('button', { name: /Minimize chat/ }));
      expect(onVariantChange).toHaveBeenCalledWith('expanded');
    });
  });

  describe('localization', () => {
    it('overrides every collapsed-rail label', () => {
      render(
        <AiChat
          variant="collapsed"
          chatNavLabel="Chat DE"
          tasksNavLabel="Tasks DE"
          maximizeChatLabel="Maximize DE"
          showFullWidthChatLabel="Full-width DE"
        />
      );

      expect(screen.getByRole('button', { name: 'Chat DE' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Tasks DE' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Maximize DE' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Full-width DE' })
      ).toBeInTheDocument();
    });

    it('overrides every expanded-panel label and shortcut', () => {
      render(
        <AiChat
          variant="expanded"
          acronisAiLabel="Acronis AI DE"
          tasksTabLabel="Tasks DE"
          maximizeChatLabel="Maximize DE"
          maximizeChatShortcut="^H"
          collapseChatLabel="Collapse DE"
          collapseChatShortcut="^C"
        />
      );

      expect(
        screen.getByRole('tab', { name: 'Acronis AI DE' })
      ).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tasks DE' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Maximize DE/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Collapse DE/ })
      ).toBeInTheDocument();
      expect(screen.getByText('^H')).toBeInTheDocument();
      expect(screen.getByText('^C')).toBeInTheDocument();
    });

    it('overrides every full-width label, shortcut, and title', () => {
      render(
        <AiChat
          variant="full-width"
          acronisAiLabel="Acronis AI DE"
          newChatLabel="New chat DE"
          newChatShortcut="^N"
          minimizeChatLabel="Minimize DE"
          collapseChatLabel="Collapse DE"
          conversationTitle="Conversation DE"
        />
      );

      expect(screen.getByText('Acronis AI DE')).toBeInTheDocument();
      expect(screen.getByText('Conversation DE')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /New chat DE/ })
      ).toBeInTheDocument();
      expect(screen.getByText('^N')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Minimize DE/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Collapse DE/ })
      ).toBeInTheDocument();
    });

    it('overrides the resize-edge tooltip', async () => {
      const user = userEvent.setup();
      render(
        <AiChat
          defaultVariant="expanded"
          resizable
          resizeTooltip="Drag me DE"
        />
      );

      await user.hover(screen.getByRole('separator'));
      expect(await screen.findByText('Drag me DE')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('labels the full-width sidebar landmark distinctly from the root landmark', () => {
      render(<AiChat variant="full-width" />);

      const asides = screen.getAllByRole('complementary');
      expect(asides).toHaveLength(2);
      const [root, sidebar] = asides;
      expect(root).not.toHaveAttribute('aria-labelledby');
      expect(sidebar).toHaveAttribute('aria-labelledby');
      expect(
        screen.getByRole('complementary', { name: 'Acronis AI' })
      ).toBe(sidebar);
    });

    it('gives the full-width sidebar and body headings a real 1/2 hierarchy', () => {
      render(<AiChat variant="full-width" />);

      expect(
        screen.getByRole('heading', { level: 1, name: 'Acronis AI' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Chat name' })
      ).toBeInTheDocument();
    });
  });

  describe('resizable', () => {
    it('does not render a resize edge by default', () => {
      render(<AiChat defaultVariant="expanded" />);
      expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    });

    it('renders a resize edge for expanded and collapsed, but not full-width', () => {
      const { rerender } = render(<AiChat defaultVariant="expanded" resizable />);
      expect(screen.getByRole('separator')).toBeInTheDocument();

      rerender(<AiChat variant="collapsed" resizable />);
      expect(screen.getByRole('separator')).toBeInTheDocument();

      rerender(<AiChat variant="full-width" resizable />);
      expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    });
  });
});
