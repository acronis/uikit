import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as React from 'react';

import { useRestoreFocusOnUnmount } from '../use-restore-focus-on-unmount';

function Harness({
  showA,
  showB,
  showC,
}: {
  showA: boolean;
  showB: boolean;
  showC: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const aRef = React.useRef<HTMLButtonElement>(null);
  const bRef = React.useRef<HTMLButtonElement>(null);
  const cRef = React.useRef<HTMLButtonElement>(null);
  useRestoreFocusOnUnmount(containerRef, [aRef, bRef, cRef]);

  return (
    <div ref={containerRef}>
      {showA && <button ref={aRef}>A</button>}
      {showB && <button ref={bRef}>B</button>}
      {showC && <button ref={cRef}>C</button>}
    </div>
  );
}

describe('useRestoreFocusOnUnmount', () => {
  it('moves focus to the first available fallback when the focused control unmounts', () => {
    const { rerender } = render(<Harness showA showB showC />);
    screen.getByRole('button', { name: 'A' }).focus();

    rerender(<Harness showA={false} showB showC />);

    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
  });

  it('skips absent fallbacks and focuses the next available one, in order', () => {
    const { rerender } = render(<Harness showA showB={false} showC />);
    screen.getByRole('button', { name: 'A' }).focus();

    rerender(<Harness showA={false} showB={false} showC />);

    expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();
  });

  it('does nothing when the unmounted control did not hold focus', () => {
    const { rerender } = render(<Harness showA showB showC />);
    screen.getByRole('button', { name: 'B' }).focus();

    rerender(<Harness showA={false} showB showC />);

    expect(screen.getByRole('button', { name: 'B' })).toHaveFocus();
  });

  it('does nothing when focus was already outside the container', () => {
    const { rerender } = render(
      <>
        <button>Outside</button>
        <Harness showA showB showC />
      </>
    );
    screen.getByRole('button', { name: 'Outside' }).focus();

    rerender(
      <>
        <button>Outside</button>
        <Harness showA={false} showB showC />
      </>
    );

    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });

  it('does not throw when no fallback is available', () => {
    const { rerender } = render(<Harness showA showB={false} showC={false} />);
    screen.getByRole('button', { name: 'A' }).focus();

    expect(() =>
      rerender(<Harness showA={false} showB={false} showC={false} />)
    ).not.toThrow();
  });
});
