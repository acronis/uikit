# Visual regression baselines

PNG baselines for the Storybook visual regression suite, captured by
`@storybook/test-runner` + `jest-image-snapshot` (see
`../../.storybook/test-runner.ts`):

- light mode: `<story-id>.png`
- dark mode: `<story-id>--dark.png`

**Baselines are committed and must be generated in Docker (Linux)** so they match
the CI environment — never commit baselines rendered on macOS/Windows, they will
not match the Linux renderer.

## Generate / update baselines

```bash
# From the repo root (Docker must be running):
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update

# Dark mode baselines:
STORYBOOK_COLOR_MODE=dark pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update
```

Review the resulting PNGs, then commit them alongside the component change.

## Check against baselines (what CI runs)

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker
STORYBOOK_COLOR_MODE=dark pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker
```

On failure, diff images are written to `__diff_output__/` (gitignored) and, in
CI, uploaded as `visual-regression-diffs-ui-react-{light|dark}` artifacts.
