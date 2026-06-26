import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  WidgetPlaceholder,
  WidgetPlaceholderAction,
  WidgetPlaceholderContent,
  WidgetPlaceholderFooter,
  WidgetPlaceholderHeader,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderTitle,
} from '../widget-placeholder';

describe('WidgetPlaceholder', () => {
  it('renders a composed widget placeholder', () => {
    render(
      <WidgetPlaceholder>
        <WidgetPlaceholderHeader>
          <WidgetPlaceholderTitle>Backup statistics</WidgetPlaceholderTitle>
        </WidgetPlaceholderHeader>
        <WidgetPlaceholderContent>
          <WidgetPlaceholderImage>
            <svg data-testid="img-svg" />
          </WidgetPlaceholderImage>
          <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>
          <WidgetPlaceholderAction>Set up backup</WidgetPlaceholderAction>
        </WidgetPlaceholderContent>
        <WidgetPlaceholderFooter>Last checked: never</WidgetPlaceholderFooter>
      </WidgetPlaceholder>
    );
    expect(screen.getByText('Backup statistics')).toBeInTheDocument();
    expect(screen.getByText('No data available yet')).toBeInTheDocument();
    expect(screen.getByText('Set up backup')).toBeInTheDocument();
    expect(screen.getByText('Last checked: never')).toBeInTheDocument();
    expect(screen.getByTestId('img-svg')).toBeInTheDocument();
  });

  it('is not focusable by default', () => {
    render(<WidgetPlaceholder data-testid="wp">content</WidgetPlaceholder>);
    expect(screen.getByTestId('wp')).not.toHaveAttribute('tabindex');
  });

  it('becomes focusable and interactive when interactive', () => {
    render(
      <WidgetPlaceholder data-testid="wp" interactive>
        content
      </WidgetPlaceholder>
    );
    const wp = screen.getByTestId('wp');
    expect(wp).toHaveAttribute('tabindex', '0');
    expect(wp).toHaveClass('cursor-pointer');
  });

  it('does not leak the interactive prop to the DOM', () => {
    render(
      <WidgetPlaceholder data-testid="wp" interactive>
        content
      </WidgetPlaceholder>
    );
    expect(screen.getByTestId('wp')).not.toHaveAttribute('interactive');
  });

  it('forwards the ref on the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<WidgetPlaceholder ref={ref}>content</WidgetPlaceholder>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges a custom className on parts', () => {
    render(
      <WidgetPlaceholderTitle className="custom-x">Title</WidgetPlaceholderTitle>
    );
    expect(screen.getByText('Title')).toHaveClass('custom-x', 'truncate');
  });
});
