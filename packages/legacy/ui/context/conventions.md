# Coding conventions — `packages/legacy/ui`

Workspace-specific conventions for the published UI library. These
build on the repo-wide rules in `<repo-root>/context/conventions.md`
(TypeScript, file naming, editing rules, catalog versions) — they do
not repeat them.

These choices are specific to this workspace. A future non-legacy
package may pick a different framework, styling system, or layout.

## React + TypeScript

- React **functional components** only. No class components.
- Use `React.forwardRef` for components that accept refs (most UI
  primitives do).
- Define prop interfaces that extend the appropriate HTML attribute type:
  ```ts
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { ... }
  ```
- Use `VariantProps<typeof buttonVariants>` from
  `class-variance-authority` for variant typing.
- **Components**: PascalCase (`Button`, `Card`, `DataTable`).

## Styling

- **Tailwind CSS v4** utility classes. No CSS modules, no
  styled-components.
- **CSS variables** for themeable values, prefixed `--av-` (e.g.
  `var(--av-primary)`). Full list and theme files: see
  [`./theming.md`](./theming.md).
- Use `cn()` (from `lib/utils`) to merge class names with conditional
  logic. It wraps `clsx` + `tailwind-merge`.
- Variant management: **`class-variance-authority` (CVA)**. Define a
  `xxxVariants` CVA function next to the component; expose its variants
  via `VariantProps`.

## Accessibility

- Build on **Radix UI** and **Base UI** (`@base-ui/react`) primitives —
  both are peer dependencies of the published library and handle
  keyboard nav, focus management, and ARIA attributes. The library
  pulls a couple of Radix primitives as direct deps (`react-slot`,
  `react-navigation-menu`); everything else comes from peers.
- Don't reinvent dialogs, popovers, menus, etc. from scratch.
- A11y is verified in Storybook via `@storybook/addon-a11y` — see
  [`./testing.md`](./testing.md).

## File layout per component

```
src/components/ui/<component>/
├── <component>.tsx           # component source
├── <component>.docs.ts       # optional: explicit type interfaces for AutoTypeTable
├── __tests__/
│   └── <component>.test.tsx
└── __stories__/
    └── <component>.stories.tsx
```

The `.docs.ts` companion is only added when `AutoTypeTable` in
`apps/docs` cannot resolve types from the source alone (compound
components, re-exported Radix/Base UI types, complex CVA generics).
8 of them exist today — only add a new one when `AutoTypeTable`
produces an unhelpful table.

`tsconfig.build.json` excludes `*.test.tsx` and `*.stories.tsx` from
the published type output. Keep test/story filenames using those exact
suffixes so the exclusion globs catch them.
