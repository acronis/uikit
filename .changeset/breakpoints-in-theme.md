---
'@acronis-platform/ui-react': minor
---

Pin the design team's viewport breakpoint scale in `src/styles/index.css`'s `@theme`
block, replacing Tailwind's stock `lg`/`xl`/`2xl` values and adding new `3xl`/`4xl`
steps:

| Breakpoint | Before (Tailwind default) | After              |
| ---------- | ------------------------- | ------------------ |
| `lg`       | 1024px                    | 1024px (unchanged) |
| `xl`       | 1280px                    | 1280px (unchanged) |
| `2xl`      | 1536px                    | **1440px**         |
| `3xl`      | n/a                       | **1680px** (new)   |
| `4xl`      | n/a                       | **1920px** (new)   |

**Breaking for consumers relying on Tailwind's default `2xl` (1536px)**: any
`2xl:`-prefixed utility, and the built-in `.container` utility's `2xl` step, now
activates at 1440px instead of 1536px. `sm`/`md` are unchanged. A
`Foundations/Breakpoints` Storybook story documents the full scale.
