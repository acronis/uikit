import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
      expect(screen.getByRole('banner')).toBeInTheDocument();
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
});
