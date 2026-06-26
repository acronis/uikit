import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from '../label';

describe('Label', () => {
  it('renders its children inside a label element', () => {
    render(<Label>Email</Label>);
    const label = screen.getByText('Email');
    expect(label.tagName).toBe('LABEL');
  });

  it('associates with a control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>
    );
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email');
  });

  it('applies the base typography classes', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toHaveClass(
      'text-sm',
      'font-medium',
      'leading-none'
    );
  });

  it('merges a custom className', () => {
    render(<Label className="text-muted-foreground">Email</Label>);
    expect(screen.getByText('Email')).toHaveClass('text-muted-foreground');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Email</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });
});
