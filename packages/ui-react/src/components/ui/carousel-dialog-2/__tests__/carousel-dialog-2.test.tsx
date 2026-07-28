import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CarouselDialog2 } from '../carousel-dialog-2';

describe('CarouselDialog2', () => {
  it('hides the Back button and renders Next on the first slide', () => {
    render(
      <CarouselDialog2 variant="first" slideCount={3} selectedIndex={0} />
    );
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('shows Back and Next on a middle slide', () => {
    render(
      <CarouselDialog2 variant="middle" slideCount={3} selectedIndex={1} />
    );
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('shows Back and the call-to-action label on the last slide', () => {
    render(
      <CarouselDialog2
        variant="last"
        slideCount={3}
        selectedIndex={2}
        primaryLabel="Get started"
      />
    );
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('renders one dot per slide and marks the active one', () => {
    render(
      <CarouselDialog2 variant="middle" slideCount={3} selectedIndex={1} />
    );
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots).toHaveLength(3);
    expect(dots[1]).toHaveAttribute('aria-current', 'true');
    expect(dots[0]).not.toHaveAttribute('aria-current');
  });

  it('fires onSelectIndex with the clicked dot index', async () => {
    const user = userEvent.setup();
    const onSelectIndex = vi.fn();
    render(
      <CarouselDialog2
        variant="first"
        slideCount={3}
        selectedIndex={0}
        onSelectIndex={onSelectIndex}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Go to slide 3 of 3' }));
    expect(onSelectIndex).toHaveBeenCalledWith(2);
  });

  it('fires onBack and onNext', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onNext = vi.fn();
    render(
      <CarouselDialog2
        variant="middle"
        slideCount={3}
        selectedIndex={1}
        onBack={onBack}
        onNext={onNext}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Back' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('fires onPrimaryAction on the last slide instead of onNext', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onPrimaryAction = vi.fn();
    render(
      <CarouselDialog2
        variant="last"
        slideCount={2}
        selectedIndex={1}
        onNext={onNext}
        onPrimaryAction={onPrimaryAction}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Call to action' }));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<CarouselDialog2 ref={ref} slideCount={1} selectedIndex={0} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
