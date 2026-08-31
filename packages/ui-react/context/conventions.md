# Coding conventions — `packages/ui-react`

Workspace-specific conventions for the Base-UI-based component library.
These build on the repo-wide rules in `<repo-root>/context/conventions.md`
(TypeScript, file naming, editing rules, catalog versions) — they do not
repeat them.

## React + TypeScript

- React **functional components** only. No class components.
- Use `React.forwardRef` for components that accept refs.
- Define prop interfaces extending the appropriate HTML attribute type, or
  the Base UI primitive's own props (`React.ComponentPropsWithoutRef<typeof
Primitive.Root>`).
- Use `VariantProps<typeof xxxVariants>` from `class-variance-authority`
  for variant typing.
- **Components**: PascalCase. **Files**: kebab-case.

## Composition

- This package is the **Base UI** implementation. Wrap `@base-ui/react`
  primitives for anything stateful/interactive (switch, dialog, menu, …).
- For plain elements that need polymorphism (e.g. Button rendering as `<a>`
  or composing with another component), use Base UI's **`useRender`** hook
  with **`mergeProps`** and expose a `render` prop. Do **not** pull in
  `@radix-ui/react-slot` / `asChild` — that's the legacy pattern.

## Styling

- **Tailwind CSS v4** utility classes. Merge with `cn()` from
  `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`).
- **Never hard-code a hex/hsl value.** Every color must resolve to a generated
  `@acronis-platform/tokens-pd` token (`--ui-*`). This is the one hard rule;
  the next two points are about _how_ you reference the token.

### Bridged names vs. direct token references

There are two valid ways to drive a color from a token. Pick by **how shared
the token is**, not by habit:

- **Shared semantic vocabulary → bridge a name.** Colors reused across many
  components (`bg-primary`, `text-foreground`, `border-border`, …) are bridged
  to the `--ui-*` tokens in `src/styles/index.css`'s `@theme inline` block, and
  components use the short Tailwind name. The bridge exists so a token is
  renamed/re-pointed **once** and every consumer follows. If a shared color
  isn't bridged yet, add it there.
- **Component-specific tokens → reference the token directly** with an
  arbitrary-value utility: `bg-[var(--ui-button-primary-background-idle)]`,
  `hover:border-[var(--ui-button-secondary-border-hover)]`. Use this for the
  dense, single-component token sets (`--ui-button-*`, `--ui-switch-*`, …) whose
  names are already systematic. Bridging these would be a 1:1 mechanical rename
  used in exactly one place — pure indirection that just adds a second naming
  layer to keep in sync. Arbitrary values are first-class Tailwind and still
  carry `hover:`/`active:`/`disabled:` variants.

  Rule of thumb: **bridge what's reused; reference component-local tokens
  directly.** A 1:1 alias consumed by a single component is a smell — skip it.

- Because both forms compile to `var(--ui-*)` references resolved at paint time,
  brand/theme overrides (the `[data-theme]` attribute, brand `:root` overrides)
  are honored automatically. Corollary for **stateful** colors: wire **each
  state to its own token** (`hover:` → `*-hover`, `disabled:` → `*-disabled`)
  even when the default brand's value happens to match `*-idle` — another brand
  may define a distinct per-state value, and only the referenced token is
  honored. See `components/ui/button/button.tsx`.

## Storybook story titles

A story's `title` puts it in one of these top-level sections — pick by what the
component _is_, not by where its files live:

- **`UI/<Component>`** — the default. Every primitive and composite control:
  buttons, inputs, overlays, layout primitives, navigation, feedback.
- **`Widgets/<Component>`** — dashboard/data-display widgets: every chart
  (`Chart` primitives + the per-type charts), plus the small dashboard readouts
  built to sit next to them (`Metric`, `TrendIndicator`, `CategoryBar`,
  `ChartState`). These are read-only data presentations composed for a dashboard
  surface, not controls a user operates.
- **`Foundations/*`**, **`Themes/*`**, **`Icons/*`** — token/theme/icon
  catalogues, not components.

The section is the only thing that differs; everything else (one `__stories__/`
directory per component, autodocs, VR baselines) is the same. Renaming a title
renames every VR baseline file for that component, so regenerate the baselines
in the same change.

`WidgetPlaceholder` (a dashboard widget's empty state, so arguably `Widgets/`)
still sits under `UI/`. Moving it is a rename of its eight baselines with no
behavior change — worth doing on its own, not folded into an unrelated PR.

## Accessibility

- Lean on Base UI primitives for keyboard nav, focus management, and ARIA.
- A11y is checked in Storybook via `@storybook/addon-a11y`.

## Localization — no hardcoded labels

There is no i18n library in this repo (no `react-intl`/`i18next`). Consumers
localize by controlling the text they pass in — `children`, a `label` prop,
an `aria-label` prop, a render prop. A component is only "hardcoded" when
**the component itself** bakes in a string the consumer has no way to
override:

- Every piece of user-facing text the component renders on its own —
  `aria-label`/`aria-labelledby` fallback text, `sr-only` helper text,
  placeholder copy, empty-state/error copy, a tooltip string — must come from
  a prop, with the literal only ever used as that prop's **default value**
  (`ariaLabel = 'More pages'`), never inlined directly in the JSX output.
- Consumer-supplied content (`<Button>Submit</Button>`, a `children` render
  prop, a `label` prop's value) is **not** a violation — the consumer already
  controls it and can localize at their layer.
- Static demo/story/Figma-fixture text (`.stories.tsx`, `.figma.tsx`) is
  exempt — it's example data, not shipped UI.
- Applies **to every change that touches component source**, not just new
  components — a one-line fix that introduces a literal string is the same
  violation as shipping it on day one.

## RTL / bidirectional layout

Every component must render correctly under `dir="rtl"` (Base UI/the app
shell sets `dir` on an ancestor; components don't set it themselves). The one
exception is a component that wraps a primitive whose own keyboard handling
only mirrors when `dir` reaches it directly rather than via CSS/ancestor
inheritance — `calendar-panel.tsx`'s `dir` prop forwards to `react-day-picker`
for exactly this reason (its Arrow Left/Right roaming otherwise stays LTR).
Add a `dir` prop only for this reason, not as a general pattern.

- **Use logical Tailwind utilities** (`ms-`/`me-`, `ps-`/`pe-`, `start-`/
  `end-`) for anything that should mirror in RTL — never physical ones
  (`ml-`/`mr-`, `pl-`/`pr-`, `left-`/`right-`). See `switch.tsx`,
  `breadcrumb.tsx`, `sidebar-secondary.tsx`, `avatar.tsx`, `input-text.tsx`
  for the existing pattern.
- **Directional icons/artwork that should flip** (e.g. a "next"/"back"
  chevron) need an explicit `rtl:`/`ltr:` Tailwind variant (e.g.
  `rtl:rotate-180`) — logical positioning alone doesn't mirror the artwork
  itself. Icons that are direction-**agnostic** (e.g. a checkmark, an
  external-link glyph) must not be flipped.
- Applies **to every change that touches component source**, not just new
  components — a follow-up fix that reintroduces a physical `ml-`/`pr-`/
  `left-` utility is a regression even if the original component was correct.

## Theming source of truth

`@acronis-platform/design-tokens` (upstream source package; raw Design Tokens
Community Group (DTCG) format) → `@acronis-platform/tokens-pd` (generated CSS
output package, built by `tools/style-dictionary`) → this package's `@theme`
bridge → component utilities. Change colors in `design-tokens` and rebuild
`tokens-pd`; don't fork values here.
