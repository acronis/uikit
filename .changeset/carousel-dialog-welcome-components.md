---
'@acronis-platform/ui-react': minor
---

Add `DialogFooterCarousel` and `DialogWelcome`, backed internally by a new `Carousel` primitive.

- `DialogWelcome`: a second Dialog "recipe" alongside `Dialog` (DialogDefault) — headerless, its body is an image plus a centered title/description. Layout is derived from how many `DialogWelcomeSlide` children are passed, not a prop: exactly one renders the `single` layout (a call-to-action button + a "Close" button); 2–5 render the `carousel` layout, each slide keeping its own image/text, navigated by `DialogFooterCarousel`. Outside the [1, 5] range this is handled silently: 0 real slides render nothing, and above 5 only the first 5 render. `opts`/`setApi` are forwarded to the inner Carousel for external slide-position sync (e.g. from a URL param). Built directly on `DialogRoot`/`DialogContent` rather than the `Dialog` recipe, since `Dialog` always renders its own header/body/footer chrome and DialogWelcome has no header in either layout.

- `DialogFooterCarousel`: a Back/Next/Close footer (plus a slide-position indicator with one dot per slide, kept dead-center via Figma's own symmetric two-spacer layout) that derives its first/middle/last treatment, and its dot count/active index, from the ambient Carousel context (Embla's `scrollSnapList()`/`selectedScrollSnap()`), closing on the last slide via `DialogClose`, and enforcing 1–5 slides. Backed by Figma nodes `6353:4858`/`6353:5864` (fileKey `lrU3ydIyvPYQNE6ixdsKtJ`) with a complete Code Connect mapping. Its geometry and fill are themed via the `Footer` and `Carousel` `tokens-pd` tiers. All visible/accessible text (Back/Next/Close labels, the position indicator's `aria-label`) is overridable via props, defaulting to English copy, since there's no i18n library in this repo. Named to match its Figma node and sibling dialog parts (`DialogFooterDefault`, `DialogWelcome`, `Dialog`), which all mirror Figma's `Dialog<Type>`/`Dialog<Part><Variant>` naming.

- `Carousel`: an internal, Embla-driven slider (root, content, item, previous/next controls, `useCarousel`). **Not** part of the public API — a design-pending v1 kept under Storybook's `Internal/` group, meant only to back `DialogWelcome`'s carousel layout. Only the `CarouselApi` type is exported, for `setApi` consumers; `Carousel`, `CarouselItem`, and the rest of the parts stay unexported.

`CarouselDialog`, an earlier whole-modal composite superseded by `DialogWelcome`'s carousel layout, has been removed — it was never published, so no breaking-change note is needed for its removal.
