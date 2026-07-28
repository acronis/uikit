import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Carousel, CarouselContent, CarouselItem } from '../../carousel';
import { DialogFooterCarousel } from '../dialog-footer-carousel';

// Unlike dialog-footer-carousel.test.tsx / dialog-welcome.test.tsx, this file
// does NOT mock useCarousel() — it exercises the real Carousel/useEmblaCarousel
// mount sequence, since only the real hook can reproduce the race Carousel
// seeds its `selectedIndex`/`slideCount` context state with `useState(0)`/
// `useState(0)`, only synced to Embla's real values inside a useEffect that
// fires once Embla's own passive effect constructs the API — so before this
// fix, `slideCount` was 0 on the first render of every multi-slide mount.
describe('DialogFooterCarousel mount race (real Carousel, no mock)', () => {
  it('shows Next (not Close) and the real slide count on the very first render', () => {
    // `loop: true` because Embla reports zero-size scroll snaps under
    // jsdom/happy-dom regardless of slide count without it (see Carousel's
    // own tests) — this keeps Embla's own eventual correction meaningful, so
    // the test can't mistake "still 0" for "corrected to a bogus value".
    // `initialSlideCount` is exactly what DialogWelcome threads through in
    // real usage (see dialog-welcome.tsx) — supplying it here is what this
    // fix is actually about.
    //
    // DialogFooterCarousel isn't wrapped in a <DialogRoot> here on purpose:
    // before this fix, slideCount starting at 0 makes getFooterState()
    // (dialog-footer-carousel.tsx) misread the mount as a single-slide
    // dialog and render `DialogClose` instead of `Next` — and `DialogClose`
    // requires dialog context it doesn't have here, so the misread throws
    // outright instead of merely mismatching. That's what makes this test
    // fail hard, not just flake, if the mount race regresses.
    render(
      <Carousel opts={{ loop: true }} initialSlideCount={2}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <DialogFooterCarousel />
      </Carousel>
    );

    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
