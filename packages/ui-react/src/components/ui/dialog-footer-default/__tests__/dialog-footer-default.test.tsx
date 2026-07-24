import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../../button';
import { Link } from '../../link';
import { DialogFooterDefault } from '../dialog-footer-default';

describe('DialogFooterDefault', () => {
  it('renders actions end-aligned when no description or link is given', () => {
    render(
      <DialogFooterDefault data-testid="footer">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </DialogFooterDefault>
    );
    expect(screen.getByTestId('footer')).toHaveClass('justify-end');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders a truncated description and drops the end-aligned fallback', () => {
    render(
      <DialogFooterDefault
        data-testid="footer"
        description="Some context about this action"
      >
        <Button>Save</Button>
      </DialogFooterDefault>
    );
    expect(screen.getByTestId('footer')).not.toHaveClass('justify-end');
    expect(screen.getByText('Some context about this action')).toHaveClass(
      'truncate'
    );
  });

  it('renders a link slot', () => {
    render(
      <DialogFooterDefault link={<Link href="#">Learn more</Link>}>
        <Button>Save</Button>
      </DialogFooterDefault>
    );
    expect(
      screen.getByRole('link', { name: 'Learn more' })
    ).toBeInTheDocument();
  });

  it('is mutually exclusive: description takes precedence when both are given', () => {
    render(
      <DialogFooterDefault
        description="Some context about this action"
        link={<Link href="#">Learn more</Link>}
      >
        <Button>Save</Button>
      </DialogFooterDefault>
    );
    expect(
      screen.getByText('Some context about this action')
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Learn more' })
    ).not.toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DialogFooterDefault ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
