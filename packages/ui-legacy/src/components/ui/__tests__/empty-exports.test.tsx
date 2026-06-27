import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyIcon, EmptyIconComponent, EmptySvgIcon } from '../../../react';

describe('Empty exports', () => {
  it('exports EmptyIcon as the empty slot wrapper from main entry', () => {
    render(<EmptyIcon data-testid="empty-slot-icon" />);

    expect(screen.getByTestId('empty-slot-icon')).toHaveAttribute(
      'data-slot',
      'empty-icon'
    );
  });

  it('keeps EmptyIconComponent as a compatibility alias', () => {
    render(<EmptyIconComponent data-testid="empty-slot-icon-compat" />);

    expect(screen.getByTestId('empty-slot-icon-compat')).toHaveAttribute(
      'data-slot',
      'empty-icon'
    );
  });

  it('exports EmptySvgIcon as the standalone generated icon', () => {
    render(<EmptySvgIcon data-testid="empty-svg-icon" />);

    const icon = screen.getByTestId('empty-svg-icon');

    expect(icon).not.toHaveAttribute('data-slot');
    expect(icon).toHaveClass('shrink-0');
    expect(icon).not.toHaveClass('[&_svg]:h-full');
  });
});
