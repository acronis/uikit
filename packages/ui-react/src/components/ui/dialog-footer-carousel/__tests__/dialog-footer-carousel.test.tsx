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

  it('caps the dot indicator at 5 and warns when the ambient slide count exceeds 5', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    mockCarousel.selectedIndex = 7;
    mockCarousel.slideCount = 11;
    render(<DialogFooterCarousel />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('expected between 1 and 5 slides, received 11')
    );
    consoleError.mockRestore();
  });

  it('does not warn when the ambient slide count is within [1, 5]', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockCarousel.slideCount = 5;
    render(<DialogFooterCarousel />);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('both-disabled state (single slide): resolves to last, with Close reachable', () => {
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
