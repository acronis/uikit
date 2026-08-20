# Visual regression baselines

PNG baselines for the Storybook visual regression suite, captured by
`@storybook/test-runner` + `jest-image-snapshot` (see
`../../.storybook/test-runner.ts`):

- light mode: `<story-id>.png`
- dark mode: `<story-id>--dark.png`

**Baselines are committed and must be generated in Docker (Linux)** so they match
the CI environment — never commit baselines rendered on macOS/Windows, they will
not match the Linux renderer.

## Six capture profiles, two baseline families

Light/dark has **two** inputs — `[data-theme]` on the root element, and the OS
`prefers-color-scheme`, which the `tokens-pd` bundle's `color-scheme: light dark`
defers to when no `[data-theme]` is set. The `light`/`dark` profiles pin the
attribute and leave the OS at light, so they only ever covered two of the six
states the pair can be in. The profiles are that cross product in full:

| profile        | `[data-theme]` | OS pref  | compares against | stories |
| -------------- | -------------- | -------- | ---------------- | ------- |
| `light`        | `light`        | light    | `<id>.png`       | all     |
| `dark`         | `dark`         | light    | `<id>--dark.png` | all     |
| `system-dark`  | **absent**     | dark     | `<id>--dark.png` | subset  |
| `system-light` | **absent**     | light    | `<id>.png`       | subset  |
| `forced-light` | `light`        | **dark** | `<id>.png`       | subset  |
| `forced-dark`  | `dark`         | **dark** | `<id>--dark.png` | subset  |

The name is the mechanism, not the colour: a `system-*` profile removes the
attribute so the OS decides; a `forced-*` profile sets an attribute the OS
**contradicts**. `forced-dark` is therefore not a duplicate of `dark` — `dark`
leaves the OS at light and pins `color-scheme` inline, so it never exercises the
token bundle's `[data-theme='dark']` rule against a dark machine, and never sees a
`prefers-color-scheme` fallback fire on top of an explicit attribute.
`system-light` is the control for `system-dark`: a fallback that over-reaches or
inverts its condition renders dark here, and `system-dark` passing cannot tell
that apart from a correct implementation.

**The four subset profiles own no PNGs of their own** — that is the point.
`light-dark()` resolves from the _used_ value of `color-scheme`, which is
identical within each baseline family above, so every token-driven colour must
come out the same and the render has to reproduce the committed baseline byte for
byte. Anything that differs is styling keyed on `[data-theme]` directly instead of
resolving through a token, which is precisely the defect that makes a component
render half-dark for a user whose OS is set to dark. `chart.tsx`'s `THEMES` block
is the known instance in this library — it scopes its dark series colours under a
literal `[data-theme='dark']` selector.

Because they assert a per-story property rather than record anything, they run a
curated ~15% sample — 20 titles chosen one per rendering mechanism, listed with
their rationale in `../../scripts/system-theme-subset.mjs`.

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:system-dark
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:system-light
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:forced-light
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:forced-dark

# all four in one run (`--mode themes`); `--mode all` adds light + dark
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:themes
```

There is deliberately **no `:update` variant**: the capture script refuses
`--update` for these profiles, and the runner refuses to create a missing baseline
from them. Both guards exist because "update" here would mean overwriting the
light/dark corpus with renders taken under a different theme input — silently
baking in the exact difference the profiles exist to catch. Add a story, run
`…:docker:update:all` first, then these.

### The sample on PRs, the whole corpus on a schedule

The ~15% sample is what runs per PR. `.github/workflows/visual-regression-themes-full.yml`
runs the same four profiles over the **full corpus** every Monday 03:00 UTC (and on
`workflow_dispatch`), which is what catches a component that keys off `[data-theme]`
and is not in the sample. Locally that is `--full`:

```bash
node scripts/visual-capture.mjs --full --mode themes
```

The cost sits almost entirely in setup, not in the extra stories: 112 stories take
~12 s of jest, 761 take ~68 s, against ~5 min of install + Storybook build per CI
leg. Latency, not compute, is why the sample is the PR default.

### Accepted deviations

A story that is **known** to render differently under one of these profiles goes in
`../../.storybook/theme-deviations.json` — never into a new baseline. The entry
**inverts** the assertion: that story MUST differ, and the run FAILS the moment it
stops differing, telling you to delete the row. A profile-owned PNG would do the
opposite — freeze the deviation as ground truth and pass forever, including on the
run where it gets worse.

```jsonc
{
  "story": "widgets-chart--default",
  "profiles": ["system-dark"],
  "reason": "why this is accepted rather than fixed",
  "approvedBy": "name",
  "date": "2026-08-20",
  "expires": "2026-11-01", // optional; past this date the run refuses the entry
}
```

The registry ships **empty** and should stay that way — a failing profile means a
component resolved a colour through `[data-theme]` instead of a token, and the
default response is to fix it. The capture script also refuses to start when an
entry names a story the run does not capture, because a waiver that never executes
looks like tracked coverage and asserts nothing.

## Generate / update baselines

```bash
# From the repo root (Docker must be running):
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update

# Dark mode baselines:
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update:dark

# Both families in one run — every profile runs even if an earlier one fails:
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update:all
```

Review the resulting PNGs, then commit them alongside the component change.

## Check against baselines (what CI runs)

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:dark

# one story only — anything after `--` is forwarded to test-storybook
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker -- ui-avatar
```

Every run is driven by `../../scripts/visual-capture.mjs`, which takes an
exclusive lock (two captures in one checkout would interleave writes into this
directory), writes each profile's full output to `../../.visual-capture/`, and
reads its verdict from jest's own summary lines rather than an exit code — a
profile that printed no `Tests:` line at all is reported as **DID NOT RUN** and
fails the result, because "no news" must not read as success.

On failure, diff images are written to `__diff_output__/` (gitignored) and, in
CI, uploaded as `visual-regression-diffs-ui-react-<profile>` artifacts (one per
matrix leg).
