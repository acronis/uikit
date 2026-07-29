import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import { cn } from '@/lib/utils';

import { Button } from '../button';
import {
  DialogClose,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '../dialog';
import {
  DialogFooterCarousel2,
  type DialogFooterCarousel2Variant,
} from '../dialog-footer-carousel-2';

// Experimental — parallel to a future onboarding-dialog primitive, not yet
// named/kept. Ports Figma's "DialogWelcome" component (node 7162:26459,
// variants carousel/single): a `Container` (reuses the generic `DialogContent`
// popup chrome — bg/radius/shadow already match the `--ui-dialog-container-*`
// tier) around a `DialogBody` (Image + Title + Description) and, for
// `variant="carousel"`, a `DialogFooterCarousel2` driven by a real Embla
// instance built from scratch here — no import from any existing carousel
// implementation.

export interface DialogWelcome2Slide {
  /** Illustration/media for the slide. Falls back to a placeholder surface when omitted. */
  image?: React.ReactNode;
  title: string;
  description: string;
}

export type DialogWelcome2Variant = 'carousel' | 'single';

interface DialogWelcome2SlideBodyProps {
  image?: React.ReactNode;
  title: string;
  description: string;
  /** Whether this slide currently owns the dialog's accessible name/description. */
  active: boolean;
  /**
   * Whether this renders the DialogBody's own bottom padding (Figma's
   * `py-16` applied around the whole body). `false` when more DialogBody
   * content (e.g. the `single` variant's buttons) follows, so the caller can
   * apply the correct `gap-12` between them instead of stacking padding on
   * top of a gap.
   */
  withBottomPadding?: boolean;
}

function DialogWelcome2SlideBody({
  image,
  title,
  description,
  active,
  withBottomPadding = true,
}: DialogWelcome2SlideBodyProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-3 pt-4',
        withBottomPadding && 'pb-4'
      )}
    >
      <div className="w-full overflow-hidden rounded-lg px-4">
        <div className="flex h-[272px] w-full items-center justify-center rounded bg-[var(--ui-background-surface-active)]">
          {image}
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-1 px-4 text-center">
        {active ? (
          <DialogTitle className="w-full flex-none text-center">
            {title}
          </DialogTitle>
        ) : (
          <p className="w-full text-2xl font-normal leading-8 text-foreground">
            {title}
          </p>
        )}
        {active ? (
          <DialogDescription className="w-full flex-none text-center text-sm leading-6 text-foreground">
            {description}
          </DialogDescription>
        ) : (
          <p className="w-full text-sm leading-6 text-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

const DEFAULT_SLIDES: DialogWelcome2Slide[] = [
  { title: 'Title', description: 'Feature description.' },
  { title: 'Title', description: 'Feature description.' },
  { title: 'Title', description: 'Feature description.' },
];

interface UseDialogWelcome2CarouselOptions {
  slideCount: number;
  selectedIndexProp?: number;
  onSelectedIndexChange?: (index: number) => void;
}

function useDialogWelcome2Carousel({
  slideCount,
  selectedIndexProp,
  onSelectedIndexChange,
}: UseDialogWelcome2CarouselOptions) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [internalIndex, setInternalIndex] = React.useState(0);
  const isControlled = selectedIndexProp !== undefined;
  const selectedIndex = Math.min(
    selectedIndexProp ?? internalIndex,
    Math.max(slideCount - 1, 0)
  );

  // `onSelectedIndexChange` is read from a ref, not a `useEffect` dependency,
  // so an inline (non-memoized) consumer callback can't force this effect to
  // re-subscribe — which would call `onSelect()` again on the same slide and,
  // if the consumer's callback triggers a re-render, loop indefinitely.
  const onSelectedIndexChangeRef = React.useRef(onSelectedIndexChange);
  React.useEffect(() => {
    onSelectedIndexChangeRef.current = onSelectedIndexChange;
  }, [onSelectedIndexChange]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setInternalIndex(index);
      onSelectedIndexChangeRef.current?.(index);
    };
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  React.useEffect(() => {
    if (selectedIndexProp === undefined || !emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== selectedIndexProp) {
      // `jump: true` — a controlled `selectedIndex` change snaps instantly
      // rather than animating. Without it, the initial sync on mount races
      // the smooth-scroll animation, so an immediate screenshot (e.g. VR)
      // can catch a mid-scroll frame instead of the settled slide.
      emblaApi.scrollTo(selectedIndexProp, true);
    }
  }, [emblaApi, selectedIndexProp]);

  // Controlled mode never drives Embla directly from Back/Next/dot clicks —
  // only the resync effect above (keyed to `selectedIndexProp`) does. This
  // keeps Embla's physical position from drifting away from the prop when a
  // consumer passes `selectedIndex` without wiring `onSelectedIndexChange`.
  const handleSelectIndex = React.useCallback(
    (index: number) => {
      if (isControlled) {
        onSelectedIndexChange?.(index);
      } else {
        emblaApi?.scrollTo(index);
      }
    },
    [isControlled, emblaApi, onSelectedIndexChange]
  );
  const handleBack = React.useCallback(() => {
    if (isControlled) {
      onSelectedIndexChange?.(Math.max(selectedIndex - 1, 0));
    } else {
      emblaApi?.scrollPrev();
    }
  }, [isControlled, emblaApi, onSelectedIndexChange, selectedIndex]);
  const handleNext = React.useCallback(() => {
    if (isControlled) {
      onSelectedIndexChange?.(Math.min(selectedIndex + 1, slideCount - 1));
    } else {
      emblaApi?.scrollNext();
    }
  }, [isControlled, emblaApi, onSelectedIndexChange, selectedIndex, slideCount]);

  // Check `slideCount - 1` first: for a single-slide carousel, index 0 is
  // both the first AND last slide, and 'end' (unlocking the primary action)
  // must win.
  const footerVariant: DialogFooterCarousel2Variant =
    selectedIndex === slideCount - 1
      ? 'end'
      : selectedIndex === 0
        ? 'start'
        : 'middle';

  return {
    emblaRef,
    selectedIndex,
    handleSelectIndex,
    handleBack,
    handleNext,
    footerVariant,
  };
}

interface ContainerCarouselProps {
  slides: DialogWelcome2Slide[];
  selectedIndex: number;
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  footerVariant: DialogFooterCarousel2Variant;
  onSelectIndex: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  onPrimaryAction?: () => void;
  backLabel?: string;
  nextLabel?: string;
  primaryLabel?: string;
  goToSlideLabel?: (index: number, count: number) => string;
}

function ContainerCarousel({
  slides,
  selectedIndex,
  emblaRef,
  footerVariant,
  onSelectIndex,
  onBack,
  onNext,
  onPrimaryAction,
  backLabel,
  nextLabel,
  primaryLabel,
  goToSlideLabel,
}: ContainerCarouselProps) {
  const slideCount = slides.length;
  return (
    <>
      <div ref={emblaRef} className="w-full overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0 basis-full"
              aria-hidden={index !== selectedIndex || undefined}
              inert={index !== selectedIndex}
            >
              <DialogWelcome2SlideBody
                image={slide.image}
                title={slide.title}
                description={slide.description}
                active={index === selectedIndex}
              />
            </div>
          ))}
        </div>
      </div>
      {slideCount > 0 && (
        <DialogFooterCarousel2
          variant={footerVariant}
          slideCount={slideCount}
          selectedIndex={selectedIndex}
          onSelectIndex={onSelectIndex}
          onBack={onBack}
          onNext={onNext}
          onPrimaryAction={onPrimaryAction}
          backLabel={backLabel}
          nextLabel={nextLabel}
          primaryLabel={primaryLabel}
          goToSlideLabel={goToSlideLabel}
        />
      )}
    </>
  );
}

interface ContainerNoSlidesProps {
  image?: React.ReactNode;
  title: string;
  description: string;
  primaryLabel?: string;
  onPrimaryAction?: () => void;
  closeLabel: string;
  onCloseAction?: () => void;
}

function ContainerNoSlides({
  image,
  title,
  description,
  primaryLabel,
  onPrimaryAction,
  closeLabel,
  onCloseAction,
}: ContainerNoSlidesProps) {
  return (
    <div className="flex w-full flex-col items-center gap-3 pb-4">
      <DialogWelcome2SlideBody
        image={image}
        title={title}
        description={description}
        active
        withBottomPadding={false}
      />
      <div className="flex w-full flex-col items-center gap-2 px-4">
        <Button onClick={onPrimaryAction}>
          {primaryLabel ?? 'Call to action'}
        </Button>
        <DialogClose
          onClick={onCloseAction}
          render={<Button variant="ghost">{closeLabel}</Button>}
        />
      </div>
    </div>
  );
}

type DialogRootProps = React.ComponentPropsWithoutRef<typeof DialogRoot>;

export interface DialogWelcome2Props extends Omit<DialogRootProps, 'children'> {
  /** Selects the Figma-defined layout. Defaults to `'carousel'`. */
  variant?: DialogWelcome2Variant;
  /** Slides shown one at a time (`variant="carousel"`). Defaults to a 3-slide placeholder. */
  slides?: DialogWelcome2Slide[];
  /** Controls the active slide (`variant="carousel"`). Uncontrolled when omitted. */
  selectedIndex?: number;
  /** Fires whenever the active slide changes (`variant="carousel"`). */
  onSelectedIndexChange?: (index: number) => void;
  /** `Back` button label (`variant="carousel"`). Defaults to `'Back'`. */
  backLabel?: string;
  /** `Next` button label (`variant="carousel"`). Defaults to `'Next'`. */
  nextLabel?: string;
  /** Builds each carousel dot's accessible name (`variant="carousel"`). */
  goToSlideLabel?: (index: number, count: number) => string;
  /** Illustration/media (`variant="single"`). */
  image?: React.ReactNode;
  /** Title (`variant="single"`). Defaults to `'Title'`. */
  title?: string;
  /** Description (`variant="single"`). Defaults to `'Feature description.'`. */
  description?: string;
  /** `Close` link label (`variant="single"`). Defaults to `'Close'`. */
  closeLabel?: string;
  /** Fires when `Close` (`variant="single"`) is activated, before the dialog closes. */
  onCloseAction?: () => void;
  /**
   * Call-to-action button label — the last carousel slide's button
   * (`variant="carousel"`) or the single body's primary button
   * (`variant="single"`). Defaults to `'Call to action'`.
   */
  primaryLabel?: string;
  /** Fires when the call-to-action button is activated. */
  onPrimaryAction?: () => void;
  /** Render inside a portal (forwarded to `DialogContent`). Defaults to `true`. */
  portal?: boolean;
  /** Portal container (forwarded to `DialogContent`). */
  portalContainer?: DialogContentProps['portalContainer'];
  /** Keep the content mounted while closed (forwarded to `DialogContent`). */
  keepMounted?: DialogContentProps['keepMounted'];
  /** Extra classes merged onto the popup container. */
  className?: string;
}

const DialogWelcome2 = React.forwardRef<HTMLDivElement, DialogWelcome2Props>(
  (
    {
      variant = 'carousel',
      slides = DEFAULT_SLIDES,
      selectedIndex: selectedIndexProp,
      onSelectedIndexChange,
      backLabel,
      nextLabel,
      goToSlideLabel,
      image,
      title = 'Title',
      description = 'Feature description.',
      closeLabel = 'Close',
      onCloseAction,
      primaryLabel,
      onPrimaryAction,
      portal,
      portalContainer,
      keepMounted,
      className,
      ...rootProps
    },
    ref
  ) => {
    const isCarousel = variant === 'carousel';
    // An explicit `slides={[]}` would otherwise mount no Title/Description
    // and suppress the footer, leaving the dialog with no accessible name —
    // fall back to the default placeholder slides instead.
    const resolvedSlides = slides.length > 0 ? slides : DEFAULT_SLIDES;
    const slideCount = resolvedSlides.length;

    const {
      emblaRef,
      selectedIndex,
      handleSelectIndex,
      handleBack,
      handleNext,
      footerVariant,
    } = useDialogWelcome2Carousel({
      slideCount,
      selectedIndexProp,
      onSelectedIndexChange,
    });

    return (
      <DialogRoot {...rootProps}>
        <DialogContent
          ref={ref}
          size="sm"
          portal={portal}
          portalContainer={portalContainer}
          keepMounted={keepMounted}
          className={className}
        >
          {isCarousel ? (
            <ContainerCarousel
              slides={resolvedSlides}
              selectedIndex={selectedIndex}
              emblaRef={emblaRef}
              footerVariant={footerVariant}
              onSelectIndex={handleSelectIndex}
              onBack={handleBack}
              onNext={handleNext}
              onPrimaryAction={onPrimaryAction}
              backLabel={backLabel}
              nextLabel={nextLabel}
              primaryLabel={primaryLabel}
              goToSlideLabel={goToSlideLabel}
            />
          ) : (
            <ContainerNoSlides
              image={image}
              title={title}
              description={description}
              primaryLabel={primaryLabel}
              onPrimaryAction={onPrimaryAction}
              closeLabel={closeLabel}
              onCloseAction={onCloseAction}
            />
          )}
        </DialogContent>
      </DialogRoot>
    );
  }
);
DialogWelcome2.displayName = 'DialogWelcome2';

export { DialogWelcome2 };
