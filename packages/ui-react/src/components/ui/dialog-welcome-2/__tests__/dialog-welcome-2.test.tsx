import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DialogWelcome2 } from '../dialog-welcome-2';

// `embla-carousel-react` measures `offsetWidth`/`offsetLeft` to compute scroll
// snaps, which happy-dom always reports as 0 — every slide would collapse to
// the same snap point and `scrollNext`/`scrollTo` would be no-ops. Replace the
// hook with a minimal fake that tracks the selected index and dispatches the
// same `select`/`reInit` events `DialogWelcome2` subscribes to, so the test
// exercises this component's own wiring rather than Embla's DOM measurement.
const { emblaState } = vi.hoisted(() => ({
  emblaState: {
    selected: 0,
    listeners: {} as Record<string, Array<() => void>>,
    // The real `useEmblaCarousel` keeps a stable `api` reference across
    // re-renders of the same mount (it's backed by `useState`, not created
    // fresh every call) — cache it here too, or an effect keyed to `emblaApi`
    // would spuriously re-run on every render, masking bugs the real hook
    // never exhibits.
    api: undefined as
      | undefined
      | {
          selectedScrollSnap: () => number;
          scrollTo: (index: number) => void;
          scrollNext: () => void;
          scrollPrev: () => void;
          on: (event: string, cb: () => void) => void;
          off: (event: string, cb: () => void) => void;
        },
  },
}));

vi.mock('embla-carousel-react', () => ({
  default: () => {
    if (!emblaState.api) {
      const emit = (event: string) =>
        emblaState.listeners[event]?.forEach((cb) => cb());
      emblaState.api = {
        selectedScrollSnap: () => emblaState.selected,
        scrollTo: (index: number) => {
          emblaState.selected = index;
          emit('select');
        },
        scrollNext: () => {
          emblaState.selected += 1;
          emit('select');
        },
        scrollPrev: () => {
          emblaState.selected -= 1;
          emit('select');
        },
        on: (event: string, cb: () => void) => {
          (emblaState.listeners[event] ??= []).push(cb);
        },
        off: (event: string, cb: () => void) => {
          emblaState.listeners[event] = (
            emblaState.listeners[event] ?? []
          ).filter((fn) => fn !== cb);
        },
      };
    }
    return [() => {}, emblaState.api];
  },
}));

beforeEach(() => {
  emblaState.selected = 0;
  emblaState.listeners = {};
  emblaState.api = undefined;
});

const SLIDES = [
  { title: 'First feature', description: 'First description.' },
  { title: 'Second feature', description: 'Second description.' },
  { title: 'Third feature', description: 'Third description.' },
];

describe('DialogWelcome2', () => {
  it('renders the first slide with a start footer (no Back, Next visible)', () => {
    render(<DialogWelcome2 open slides={SLIDES} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('First feature')).toBeInTheDocument();
    expect(screen.getByText('First description.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('hides non-active slides from assistive tech', () => {
    render(<DialogWelcome2 open slides={SLIDES} />);
    const secondSlide = screen.getByText('Second feature');
    expect(secondSlide.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('advances to the next slide and updates the footer to middle', async () => {
    const user = userEvent.setup();
    render(<DialogWelcome2 open slides={SLIDES} />);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('shows the call-to-action button and fires onPrimaryAction on the last slide', async () => {
    const user = userEvent.setup();
    const onPrimaryAction = vi.fn();
    render(
      <DialogWelcome2
        open
        slides={SLIDES}
        primaryLabel="Get started"
        onPrimaryAction={onPrimaryAction}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
    const cta = screen.getByRole('button', { name: 'Get started' });
    await user.click(cta);
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });

  it('jumps to a slide when its dot is activated', async () => {
    const user = userEvent.setup();
    render(<DialogWelcome2 open slides={SLIDES} />);
    await user.click(screen.getByRole('button', { name: 'Go to slide 3 of 3' }));
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument();
  });

  it('calls onSelectedIndexChange as the slide changes', async () => {
    const user = userEvent.setup();
    const onSelectedIndexChange = vi.fn();
    render(
      <DialogWelcome2
        open
        slides={SLIDES}
        onSelectedIndexChange={onSelectedIndexChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onSelectedIndexChange).toHaveBeenCalledWith(1);
  });

  it('renders the single variant with an image body, primary action, and Close', () => {
    render(
      <DialogWelcome2
        open
        variant="single"
        title="All set"
        description="You're ready to go."
        primaryLabel="Get started"
      />
    );
    expect(screen.getByText('All set')).toBeInTheDocument();
    expect(screen.getByText("You're ready to go.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('closes the dialog when Close is activated in the single variant', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogWelcome2
        open
        variant="single"
        onOpenChange={onOpenChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<DialogWelcome2 ref={ref} open slides={SLIDES} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('reaches the end footer variant with a single slide (call-to-action reachable)', () => {
    render(
      <DialogWelcome2
        open
        slides={[{ title: 'Only feature', description: 'Only description.' }]}
        primaryLabel="Get started"
      />
    );
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('falls back to the default slides when slides is explicitly empty', () => {
    render(<DialogWelcome2 open slides={[]} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('does not move a controlled carousel when onSelectedIndexChange is not wired', async () => {
    const user = userEvent.setup();
    render(<DialogWelcome2 open slides={SLIDES} selectedIndex={2} />);
    expect(screen.getByText('Third feature')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    // Embla never physically moved (no callback to update the prop), so the
    // rendered slide/footer must still match the untouched `selectedIndex`.
    expect(screen.getByText('Third feature')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('moves a controlled carousel once the consumer applies onSelectedIndexChange', async () => {
    const user = userEvent.setup();
    function ControlledWrapper() {
      const [selectedIndex, setSelectedIndex] = useState(2);
      return (
        <DialogWelcome2
          open
          slides={SLIDES}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={setSelectedIndex}
        />
      );
    }
    render(<ControlledWrapper />);
    expect(screen.getByText('Third feature')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByText('Second feature')).toBeInTheDocument();
  });

  it('does not re-invoke onSelectedIndexChange merely because its identity changed', () => {
    const calls: number[] = [];
    const renderWithInlineCallback = () => (
      <DialogWelcome2
        open
        slides={SLIDES}
        onSelectedIndexChange={(index) => calls.push(index)}
      />
    );
    const { rerender } = render(renderWithInlineCallback());
    expect(calls).toEqual([0]);

    // A fresh inline callback each render (a new identity) must not force the
    // subscription effect to re-run and re-report the unchanged slide index.
    rerender(renderWithInlineCallback());
    rerender(renderWithInlineCallback());

    expect(calls).toEqual([0]);
  });
});
