// Curated prop surface for the docs `<AutoTypeTable>`. `DialogWelcomeProps` in
// dialog-welcome.tsx extends Base UI's Dialog Root props (via `Omit<DialogRootProps,
// 'children'>`), which expand to a large, noisy table; this companion documents only
// the props callers set directly. (The runtime types live in dialog-welcome.tsx; this
// file is never bundled.)

/** Props for `DialogWelcome` — the onboarding/announcement dialog recipe. */
export interface DialogWelcomeProps {
  /** Selects the Figma-defined layout. Defaults to `'carousel'`. */
  variant?: 'carousel' | 'single';
  /** Slides shown one at a time (`variant="carousel"`). Defaults to a 3-slide placeholder. */
  slides?: Array<{ image?: unknown; title: string; description: string }>;
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
  image?: unknown;
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
  portalContainer?: HTMLElement | null;
  /** Keep the content mounted while closed (forwarded to `DialogContent`). */
  keepMounted?: boolean;
  /** Extra classes merged onto the popup container. */
  className?: string;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Open on mount, uncontrolled. */
  defaultOpen?: boolean;
  /** Modal behavior — focus trap and scroll lock while open. Defaults to `true`. */
  modal?: boolean | 'trap-focus';
  /** Fires when the dialog opens or closes. */
  onOpenChange?: (open: boolean, eventDetails: unknown) => void;
}
