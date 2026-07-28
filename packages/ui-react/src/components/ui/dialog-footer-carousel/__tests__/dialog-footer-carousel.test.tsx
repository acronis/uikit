import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DialogContent, DialogRoot } from '../../dialog';
import { DialogFooterCarousel } from '../dialog-footer-carousel';

// Embla reports zero-size scroll snaps under jsdom/happy-dom regardless of
// slide count (see Carousel's own tests, which work around this with
// `opts.loop`), so canScrollPrev/canScrollNext/selectedIndex/slideCount can't
// be driven through real navigation here. DialogFooterCarousel's contract is
// "reads these values from useCarousel()" — mocking that hook tests exactly
// that contract, independent of Embla's DOM measurement.
const mockCarousel = {
  canScrollPrev: false,
  canScrollNext: false,
  selectedIndex: 0,
  slideCount: 3,
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
};

vi.mock('../../carousel', () => ({
  useCarousel: () => mockCarousel,
}));

beforeEach(() => {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = false;
  mockCarousel.selectedIndex = 0;
  mockCarousel.slideCount = 3;
  mockCarousel.scrollPrev = vi.fn();
  mockCarousel.scrollNext = vi.fn();
});

function renderFirst() {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = true;
  mockCarousel.selectedIndex = 0;
  return render(<DialogFooterCarousel />);
}

function renderMiddle() {
  mockCarousel.canScrollPrev = true;
  mockCarousel.canScrollNext = true;
  mockCarousel.selectedIndex = 1;
  return render(<DialogFooterCarousel />);
}

function renderLast(onOpenChange?: (open: boolean) => void) {
  mockCarousel.canScrollPrev = true;
  mockCarousel.canScrollNext = false;
  mockCarousel.selectedIndex = 2;
  return render(
    <DialogRoot open onOpenChange={onOpenChange}>
      <DialogContent aria-label="Carousel dialog">
        <DialogFooterCarousel />
      </DialogContent>
    </DialogRoot>
  );
}

// canScrollPrev/canScrollNext both false: a single-slide dialog. getFooterState
// special-cases slideCount <= 1 to 'last' so Close always renders — otherwise
// there'd be no reachable way to close a single-slide dialog.
function renderBothDisabled() {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = false;
  mockCarousel.selectedIndex = 0;
  mockCarousel.slideCount = 1;
  return render(
    <DialogRoot open>
      <DialogContent aria-label="Carousel dialog">
        <DialogFooterCarousel />
      </DialogContent>
    </DialogRoot>
  );
}

function dotStates() {
  return screen
    .getAllByRole('listitem')
    .map((dot) => dot.getAttribute('aria-current') === 'true');
}

describe('DialogFooterCarousel', () => {
  it('first state: no Back, shows Next, dot 1 active', () => {
    renderFirst();
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument();
    expect(dotStates()).toEqual([true, false, false]);
  });

  it('middle state: shows Back and Next, dot 2 active', () => {
    renderMiddle();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument();
    expect(dotStates()).toEqual([false, true, false]);
  });

  it('last state: shows Back and Close (no Next), dot 3 active', () => {
    renderLast();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(dotStates()).toEqual([false, false, true]);
  });

  it('still shows Close on the last slide when the ambient Carousel loops (canScrollPrev/canScrollNext always true)', () => {
    // opts={{ loop: true }} on the ambient <Carousel> pins Embla's
    // canScrollPrev/canScrollNext at true forever — state must come from
    // selectedIndex/slideCount instead, or Close never renders.
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 2;
    mockCarousel.slideCount = 3;
    render(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('with exactly 2 slides, never reaches middle: first slide shows Next, second shows Close', () => {
    mockCarousel.canScrollPrev = false;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 0;
    mockCarousel.slideCount = 2;
    const { rerender } = render(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument();
    expect(dotStates()).toEqual([true, false]);

    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = false;
    mockCarousel.selectedIndex = 1;
    rerender(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(dotStates()).toEqual([false, true]);
  });

  it('renders one dot per slide, not a fixed count', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 3;
    mockCarousel.slideCount = 5;
    render(<DialogFooterCarousel />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(dotStates()).toEqual([false, false, false, true, false]);
  });

  it('renders exactly 1 dot for a single-slide carousel', () => {
    mockCarousel.canScrollPrev = false;
    mockCarousel.canScrollNext = false;
    mockCarousel.selectedIndex = 0;
    mockCarousel.slideCount = 1;
    render(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(dotStates()).toEqual([true]);
  });

  it('caps the dot indicator at 5 when the ambient slide count exceeds 5', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 7;
    mockCarousel.slideCount = 11;
    render(<DialogFooterCarousel />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
  });

  it('both-disabled state (single slide): resolves to last, no Back, Close reachable', () => {
    renderBothDisabled();
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(dotStates()).toEqual([true]);
  });

  it('calls scrollPrev when Back is activated', async () => {
    const user = userEvent.setup();
    renderMiddle();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockCarousel.scrollPrev).toHaveBeenCalledTimes(1);
  });

  it('calls scrollNext when Next is activated', async () => {
    const user = userEvent.setup();
    renderFirst();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockCarousel.scrollNext).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog when Close is activated, via Base UI compose (not a manual onClick)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderLast(onOpenChange);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('gives each dot an accessible name', () => {
    renderMiddle();
    const dots = screen.getAllByRole('listitem');
    expect(dots.map((dot) => dot.getAttribute('aria-label'))).toEqual([
      'Slide 1 of 3',
      'Slide 2 of 3',
      'Slide 3 of 3',
    ]);
  });

  it('builds each dot accessible name via the dotAriaLabel prop override', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    render(
      <DialogFooterCarousel
        dotAriaLabel={(index, count) => `Diapositive ${index} sur ${count}`}
      />
    );
    const dots = screen.getAllByRole('listitem');
    expect(dots.map((dot) => dot.getAttribute('aria-label'))).toEqual([
      'Diapositive 1 sur 3',
      'Diapositive 2 sur 3',
      'Diapositive 3 sur 3',
    ]);
  });

  it('moves focus from Next to Close when the swap happens while Next is focused', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 1;
    mockCarousel.slideCount = 3;
    const { rerender } = render(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    screen.getByRole('button', { name: 'Next' }).focus();

    mockCarousel.canScrollNext = false;
    mockCarousel.selectedIndex = 2;
    rerender(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('moves focus from Close to Next when the swap reverses while Close is focused', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = false;
    mockCarousel.selectedIndex = 2;
    mockCarousel.slideCount = 3;
    const { rerender } = render(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    screen.getByRole('button', { name: 'Close' }).focus();

    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 1;
    rerender(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('moves focus from Back to Next when Back unmounts while it holds focus', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 1;
    mockCarousel.slideCount = 3;
    const { rerender } = render(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    screen.getByRole('button', { name: 'Back' }).focus();

    mockCarousel.canScrollPrev = false;
    mockCarousel.selectedIndex = 0;
    rerender(
      <DialogRoot open>
        <DialogContent aria-label="Carousel dialog">
          <DialogFooterCarousel />
        </DialogContent>
      </DialogRoot>
    );
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('overrides Back/Next/Close labels and the position list name via props', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    render(
      <DialogFooterCarousel
        backLabel="Précédent"
        nextLabel="Suivant"
        closeLabel="Fermer"
        positionLabel="Position de la diapositive"
      />
    );
    expect(
      screen.getByRole('button', { name: 'Précédent' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Position de la diapositive' })
    ).toBeInTheDocument();
  });
});
