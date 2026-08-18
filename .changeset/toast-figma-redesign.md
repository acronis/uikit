---
'@acronis-platform/ui-react': major
---

**Breaking:** rebuild `Toast` against the Figma redesign (node `7421:126262`) and
its own `--ui-toast-*` token tier.

The card is now the `Alert` banner plus a drop shadow — a neutral surface with the
severity carried by a 1px status-colored border, a 6px status line down the leading
edge, and a fixed multicolor status icon — with every color, geometry, and spacing
value coming from the `Toast` tier instead of the previous semantic-token
approximation (`bg-background` / `border-border` / `shadow-md` and a tinted
monochrome icon). The delivery mechanism is unchanged: one `<Toaster />` at the app
root plus the imperative `toast(...)` API.

Breaking changes:

- **`toast.error` is gone.** The severity vocabulary now matches the Figma:
  `toast.info` / `success` / `warning` / `critical` / `danger`. Replace
  `toast.error(…)` with `toast.danger(…)`. `toast.critical` is new, and a bare
  `toast(…)` is now `info` (it previously rendered without a status icon).
  `toast.promise`'s failure branch still resolves to the danger visual.
- **`options.action` is replaced by `options.actions`.** Pass an array of
  `{ label, onClick?, variant? }` descriptors instead of a single
  `{ label, onClick }`. They render as real `Button`s in a wrapping row — the first
  `secondary`, the rest `ghost` — matching the Figma's `actionsList`, instead of the
  previous single text link. Replace `action: { label, onClick }` with
  `actions: [{ label, onClick }]`.
- `ToastType` gains `critical` and `danger` and loses `error`; `ToastVariant`,
  `ToastAction`, and `toastVariants` are newly exported.

Also in this change:

- `options.dismissable` (default `true`) mirrors the Figma's `dismissable` boolean,
  which binds the close ButtonIcon's visibility. Setting it `false` also revokes
  Base UI's swipe-to-dismiss — that is on by default, so hiding the control alone
  would have hidden the affordance while leaving the capability.

- `<Toaster>` takes `label` and `closeAriaLabel` so the region's and the dismiss
  control's accessible names can be localized — they were hardcoded.
- The dismiss control is a real ghost `ButtonIcon`, as the Figma specifies.
- Descriptions clamp to three lines with an ellipsis (the Figma text node's
  truncation), and the enter/exit slide now mirrors under `dir="rtl"`.
- The `Toast` token tier is imported in `src/styles/index.css`; without it the new
  `--ui-toast-*` references would not resolve.
