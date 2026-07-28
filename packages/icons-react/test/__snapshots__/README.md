# Visual regression baselines

PNG baselines for the Storybook visual regression suite, captured by
`@storybook/test-runner` + `jest-image-snapshot` (see
`../../.storybook/test-runner.ts`). Each pack's gallery story (plus the
`stroke-mono` stories) is screenshotted so the whole icon set is covered.

This suite renders **light mode only** — icons paint via `currentColor`, so
their appearance is fixed by each story's own color, not by the theme; a dark
pass would add no signal. (Contrast with `packages/ui-react`, whose components
theme per mode and therefore snapshot in both.)

**Baselines are committed and must be generated in Docker (Linux)** so they
match the CI environment — never commit baselines rendered on macOS/Windows,
they will not match the Linux renderer.

## Generate / update baselines

```bash
# From the repo root (Docker must be running):
pnpm --filter @acronis-platform/icons-react storybook:test:visual:docker:update
```

Review the resulting PNGs, then commit them alongside the icon/generator change.

## Check against baselines (what CI runs)

```bash
pnpm --filter @acronis-platform/icons-react storybook:test:visual:docker
```

On failure, diff images are written to `__diff_output__/` (gitignored) and, in
CI, uploaded as the `visual-regression-diffs-icons-react` artifact.

## Complementary check

`src/__tests__/icons-markup.test.tsx` snapshots the **rendered SVG markup** of
every icon at every size (no Docker). It catches path / stroke / linecap /
color / scale changes with a readable per-icon text diff; this pixel suite adds
the "does it actually look right" visual confirmation on top.
