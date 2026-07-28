import * as React from 'react';

import { Button } from '../button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselProps,
} from '../carousel';
import {
  DialogFooterCarousel,
  type DialogFooterCarouselProps,
} from '../dialog-footer-carousel';
import {
  DialogClose,
  DialogContent,
  DialogRoot,
  type DialogContentProps,
} from '../dialog';

// Figma node 7162:26459 ("DialogWelcome", fileKey lrU3ydIyvPYQNE6ixdsKtJ), a
// second Dialog "recipe" alongside the existing `Dialog` (DialogDefault):
// headerless, its body is an image + a centered title/description, and its
// footer is either omitted (`single`) or the existing `DialogFooterCarousel`
// (`carousel`) — the exact component already built against and Code-Connected
// to its own separately-linked Figma node (6353:5864).
//
// `variant` IS a real Figma component property (confirmed via
// get_context_for_code_connect's `variantOptions: ["carousel", "single"]`) —
// mirrored here as an *optional* override, not the primary driver: by
// default (variant omitted) the layout is still derived from how many real
// `<DialogWelcomeSlide>` children are passed (exactly one → `single`; two or
// more → `carousel`), so a caller never has to keep an explicit prop in sync
// with their own children. Passing `variant` explicitly forces that layout
// regardless of slide count — e.g. `variant="carousel"` keeps the carousel
// chrome (and its footer) for a single-slide step, matching
// DialogFooterCarousel's own single-slide support. Forcing `variant="single"`
// with more than one real slide silently renders only the first — the rest
// are dropped.
//
// Each slide keeps its own image + text (Figma only shows one static frame
// per variant, so its footer-contains-only-controls / body-sits-outside-the-
// carousel nesting is an artifact of that single-frame view, not an
// instruction to split body and slide data apart in code — every real
// slide's content must travel with it). The carousel's own Embla-driven
// scroll animates the slide-to-slide transition; no separate transition code
// is needed.
//
// Built on DialogRoot/DialogContent directly (Dialog's own primitive parts)
// — never the `Dialog` recipe, which always renders its own header/body/
// footer chrome. Wrapping `Dialog` here would mount a *second*, independent
// Base UI Dialog/Portal instance around the real one (confirmed during
// development on an earlier, now-removed `CarouselDialog` composite that made
// exactly this mistake — the outer recipe's default header/footer rendered
// fully, then went `aria-hidden`/inert once the inner popup opened on top,
// never actually removed). DialogWelcome has no header by design in either
// layout, so it skips the recipe entirely.
const MAX_SLIDES = 5;

export interface DialogWelcomeSlideProps {
  /** The slide's illustration/media. Sized to fill a 272px-tall frame — pass an `<img className="size-full object-cover" />` or similar. */
  image: React.ReactNode;
  /** The slide's title. */
  title: string;
  /** The slide's description. */
  description: string;
}

// Renders just the image + title/description — no outer vertical padding, so
// `DialogWelcome` can put it in the same padded, gap'd flex column as the
// `single` layout's CTA/Close pair (see Figma's own "DialogBody", whose
// gap-12 spaces Image/Text/ListButton uniformly) or, in the `carousel`
// layout, as the sole child of its own padded wrapper per `CarouselItem`.
function DialogWelcomeSlide({
  image,
  title,
  description,
}: DialogWelcomeSlideProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="w-full overflow-clip rounded-lg px-4">
        <div className="h-[272px] w-full overflow-clip rounded bg-[var(--ui-background-surface-active)]">
          {image}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-1 px-4 text-center">
        <p className="w-full text-2xl leading-8 text-[var(--ui-text-on-surface-primary)]">
          {title}
        </p>
        <p className="w-full text-sm leading-6 text-[var(--ui-text-on-surface-primary)]">
          {description}
        </p>
      </div>
    </div>
  );
}
DialogWelcomeSlide.displayName = 'DialogWelcomeSlide';

interface DialogWelcomeSingleBodyProps {
  slide: React.ReactNode;
  primaryLabel: string;
  onPrimaryAction: (() => void) | undefined;
  closeLabel: string;
}

// The `single` layout: the lone slide plus the CTA/Close pair, in one padded,
// gap'd flex column (Figma's own "DialogBody").
function DialogWelcomeSingleBody({
  slide,
  primaryLabel,
  onPrimaryAction,
  closeLabel,
}: DialogWelcomeSingleBodyProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3 py-4">
      {slide}
      <div className="flex w-full flex-col items-center gap-2 px-4">
        <Button variant="default" onClick={onPrimaryAction}>
          {primaryLabel}
        </Button>
        <DialogClose render={<Button variant="ghost">{closeLabel}</Button>} />
      </div>
    </div>
  );
}
DialogWelcomeSingleBody.displayName = 'DialogWelcomeSingleBody';

interface DialogWelcomeBaseProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DialogRoot>,
  'children'
> {
  /** One `<DialogWelcomeSlide>` per slide. Exactly one renders the `single` layout (CTA + Close); 2–5 render the `carousel` layout (Back/Next/Close + position dots), dropping the CTA/Close pair. */
  children: React.ReactNode;
  /**
   * Forces the `single` or `carousel` layout instead of deriving it from the
   * number of `<DialogWelcomeSlide>` children. Optional — when omitted, the
   * layout is inferred from slide count (exactly 1 → `single`, 2+ →
   * `carousel`). Pass `"carousel"` to keep the carousel chrome for a single
   * slide; passing `"single"` with more than one real slide renders only the
   * first, dropping the rest.
   */
  variant?: 'carousel' | 'single';
  /** The `single` layout's primary (call-to-action) button label. Ignored in the `carousel` layout. */
  primaryLabel?: string;
  /** Fires when the `single` layout's primary button is clicked. Does not close the dialog itself — pair with `open`/`onOpenChange` if the action should close it. Ignored in the `carousel` layout. */
  onPrimaryAction?: () => void;
  /** The close control's accessible label/text — the `single` layout's "Close" link and the `carousel` layout's last-slide "Close" button. */
  closeLabel?: string;
  /** Forwarded to the inner `DialogFooterCarousel`'s `positionLabel`. Ignored in the `single` layout. */
  positionLabel?: DialogFooterCarouselProps['positionLabel'];
  /** Forwarded to the inner `DialogFooterCarousel`'s `backLabel`. Ignored in the `single` layout. */
  backLabel?: DialogFooterCarouselProps['backLabel'];
  /** Forwarded to the inner `DialogFooterCarousel`'s `nextLabel`. Ignored in the `single` layout. */
  nextLabel?: DialogFooterCarouselProps['nextLabel'];
  /** Forwarded to the inner `Carousel` (e.g. `{ startIndex }`). Ignored in the `single` layout. */
  opts?: CarouselProps['opts'];
  /** Forwarded to the inner `Carousel`, called once with the Embla API instance. Ignored in the `single` layout. */
  setApi?: CarouselProps['setApi'];
  /** Forwarded to `DialogContent` (popup max-width). */
  size?: DialogContentProps['size'];
  /** Extra classes merged onto the popup container. */
  className?: string;
  /** Render inside a portal (forwarded to `DialogContent`). Defaults to `true`. */
  portal?: DialogContentProps['portal'];
  /** Portal container (forwarded to `DialogContent`). */
  portalContainer?: DialogContentProps['portalContainer'];
  /** Keep the content mounted while closed (forwarded to `DialogContent`). */
  keepMounted?: DialogContentProps['keepMounted'];
}

// There is no `DialogTitle` slot here (this dialog has no header), so
// `aria-label`/`aria-labelledby` can't be optional the way Dialog's own props
// are — one of the two must be supplied for the dialog to have an accessible
// name.
type DialogWelcomeAccessibleNameProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type DialogWelcomeProps = DialogWelcomeBaseProps &
  DialogWelcomeAccessibleNameProps;

function DialogWelcome({
  children,
  variant,
  primaryLabel = 'Call to action',
  onPrimaryAction,
  closeLabel = 'Close',
  positionLabel,
  backLabel,
  nextLabel,
  opts,
  setApi,
  size,
  className,
  portal,
  portalContainer,
  keepMounted,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rootProps
}: DialogWelcomeProps) {
  // Only real <DialogWelcomeSlide> elements count as slides — a stray
  // non-slide child (or a falsy one from a conditional like `cond &&
  // <DialogWelcomeSlide />`) must not be counted, and 0 real slides must not
  // fall through to rendering `slides[0]` (undefined) as the single layout.
  const slides = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<DialogWelcomeSlideProps> =>
      React.isValidElement(child) && child.type === DialogWelcomeSlide
  );

  if (slides.length === 0) {
    return null;
  }

  const isCarousel = variant ? variant === 'carousel' : slides.length > 1;

  return (
    <DialogRoot {...rootProps}>
      <DialogContent
        size={size}
        className={className}
        portal={portal}
        portalContainer={portalContainer}
        keepMounted={keepMounted}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {isCarousel ? (
          <Carousel opts={opts} setApi={setApi}>
            <CarouselContent>
              {slides.slice(0, MAX_SLIDES).map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="flex w-full flex-col py-4">{slide}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <DialogFooterCarousel
              positionLabel={positionLabel}
              backLabel={backLabel}
              nextLabel={nextLabel}
              closeLabel={closeLabel}
            />
          </Carousel>
        ) : (
          <DialogWelcomeSingleBody
            slide={slides[0]}
            primaryLabel={primaryLabel}
            onPrimaryAction={onPrimaryAction}
            closeLabel={closeLabel}
          />
        )}
      </DialogContent>
    </DialogRoot>
  );
}
DialogWelcome.displayName = 'DialogWelcome';

export { DialogWelcome, DialogWelcomeSlide };
