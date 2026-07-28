import * as React from 'react';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ArrowLeftIcon, ArrowRightIcon } from '@acronis-platform/icons-react/stroke-mono';

import { cn } from '@/lib/utils';
import { mergeRefs } from '@/lib/merge-refs';
import { ButtonIcon } from '@/components/ui/button-icon';

// Initial version ported from `@acronis-platform/shadcn-uikit`'s `carousel`
// (packages/ui-legacy/src/components/ui/carousel.tsx). No Figma node exists yet
// and no `--ui-carousel-*` token tier exists in tokens-pd — the track/item/root
// are pure layout (flex + embla), carrying no color of their own, same as
// legacy. The only themed pieces are the nav arrows, which reuse the existing,
// already-tokenized `ButtonIcon` component (`--ui-button-icon-*`) rather than
// inventing carousel-specific styling — legacy's `variant="outline"` maps to
// `ButtonIcon`'s `secondary` variant. Reconcile against the real design with
// `/figma-component Carousel <url> --update` once a mockup lands.

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  /**
   * Seeds the `slideCount` context value before Embla's own effect reports
   * the real count (which then confirms/overwrites it via the existing
   * `onSelect` sync — no behavior change once Embla settles). Without this,
   * `slideCount` starts at 0 for the first render(s) of every mount, which
   * `DialogFooterCarousel` misreads as a single-slide dialog.
   */
  initialSlideCount?: number;
}

interface CarouselContextProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  orientation: 'horizontal' | 'vertical';
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  /** Current 0-based scroll snap, from Embla's `selectedScrollSnap()`. */
  selectedIndex: number;
  /** Total scroll snaps, from Embla's `scrollSnapList().length`. */
  slideCount: number;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

// The DOM's `dir` can be set on any ancestor (the app shell, not this
// component — see context/conventions.md#rtl), so it's read from computed
// style on the carousel's own root rather than assumed to live on
// `document.documentElement`. Guessed once synchronously (matches whatever
// `document.documentElement.dir` already is) so the very first Embla init
// already gets it right in the common case; `useLayoutEffect` below corrects
// the guess from the actual rendered node before paint if a nearer ancestor
// disagrees. Embla's own `direction` option (distinct from `axis`) drives its
// internal scroll-position math — the CSS track mirrors on its own via
// logical utilities, but drag direction and scroll targets do not.
function getInitialDirection(): 'ltr' | 'rtl' {
  return typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
    ? 'rtl'
    : 'ltr';
}

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      orientation = 'horizontal',
      opts,
      setApi,
      plugins,
      initialSlideCount,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [direction, setDirection] = React.useState<'ltr' | 'rtl'>(getInitialDirection);

    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y', direction },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(opts?.startIndex ?? 0);
    const [slideCount, setSlideCount] = React.useState(initialSlideCount ?? 0);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setSelectedIndex(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (orientation === 'vertical') {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            scrollPrev();
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            scrollNext();
          }
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [orientation, scrollPrev, scrollNext]
    );

    React.useLayoutEffect(() => {
      const node = rootRef.current;

      if (!node) {
        return;
      }

      setDirection(window.getComputedStyle(node).direction === 'rtl' ? 'rtl' : 'ltr');
    }, []);

    // Memoized so the callback ref's identity is stable across renders
    // unless the forwarded `ref` itself changes — otherwise React would
    // detach (null) and reattach the DOM node on every commit.
    const mergedRef = React.useMemo(() => mergeRefs(rootRef, ref), [ref]);

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);

      return () => {
        api?.off('select', onSelect);
        api?.off('reInit', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          slideCount,
        }}
      >
        <div
          ref={mergedRef}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ms-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'ps-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

interface CarouselPreviousProps
  extends React.ComponentPropsWithoutRef<typeof ButtonIcon> {
  previousLabel?: string;
}

const CarouselPrevious = React.forwardRef<
  React.ElementRef<typeof ButtonIcon>,
  CarouselPreviousProps
>(({ className, variant = 'secondary', previousLabel = 'Previous slide', ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <ButtonIcon
      ref={ref}
      variant={variant}
      aria-label={previousLabel}
      className={cn(
        'absolute',
        orientation === 'horizontal'
          ? '-start-12 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeftIcon className={orientation === 'horizontal' ? 'rtl:rotate-180' : undefined} />
    </ButtonIcon>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

interface CarouselNextProps
  extends React.ComponentPropsWithoutRef<typeof ButtonIcon> {
  nextLabel?: string;
}

const CarouselNext = React.forwardRef<
  React.ElementRef<typeof ButtonIcon>,
  CarouselNextProps
>(({ className, variant = 'secondary', nextLabel = 'Next slide', ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <ButtonIcon
      ref={ref}
      variant={variant}
      aria-label={nextLabel}
      className={cn(
        'absolute',
        orientation === 'horizontal'
          ? '-end-12 top-1/2 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRightIcon className={orientation === 'horizontal' ? 'rtl:rotate-180' : undefined} />
    </ButtonIcon>
  );
});
CarouselNext.displayName = 'CarouselNext';

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
