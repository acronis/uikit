---
'@acronis-platform/ui-react': patch
---

**Visual regression**: capture the full `[data-theme]` × OS `prefers-color-scheme`
matrix, and drive every Docker capture through one runner.

Light/dark is decided by two independent inputs — the `[data-theme]` attribute a
consumer sets, and the OS preference that `tokens-pd`'s `color-scheme: light dark`
defers to when that attribute is absent. Six states are reachable; only two were
captured, because the `light`/`dark` profiles pin the attribute and leave the OS
at light. The four new profiles are the rest of the cross product:

| profile        | `[data-theme]` | OS pref | compares against |
| -------------- | -------------- | ------- | ---------------- |
| `system-dark`  | absent         | dark    | `<id>--dark.png` |
| `system-light` | absent         | light   | `<id>.png`       |
| `forced-light` | `light`        | dark    | `<id>.png`       |
| `forced-dark`  | `dark`         | dark    | `<id>--dark.png` |

The name is the mechanism, not the colour: `system-*` removes the attribute so the
OS decides; `forced-*` sets an attribute the OS contradicts. None of them own
baselines — each re-renders an existing baseline under a different theme input and
must reproduce it byte for byte, because `light-dark()` resolves from the _used_
value of `color-scheme` and that is identical within a family. A diff is therefore
styling keyed on `[data-theme]` directly instead of resolving through a token —
`chart.tsx`'s `THEMES` block being the known instance in this library. They run a
curated ~15% sample (20 titles, one per rendering mechanism, 112 stories), so each
leg costs a fraction of a full one. Verified against the current corpus: all four
pass 112/112 with 0 snapshots written.

Two guards make "owns no baselines" real: the capture script refuses `--update` for
these profiles, and the runner refuses to create a _missing_ baseline from them
(`jest-image-snapshot` writes one by default, which would record the untested state
as ground truth and stay green forever).

The Docker scripts now run through `scripts/visual-capture.mjs` instead of
`pnpm storybook:build && docker compose …` chains. It builds Storybook once for all
profiles, takes an exclusive lock (two captures in one checkout interleave writes
into `test/__snapshots__` and can retarget each other's preview via Storybook's
`setCurrentStory` broadcast), runs **every** requested profile even when an earlier
one fails — a `&&` chain drops the dark half of the corpus on any non-zero light
exit, including an unrelated timeout — writes each profile's full output to
`.visual-capture/`, and reads its verdict from jest's own summary lines rather than
an exit code, so a profile that never printed `Tests:` is reported as DID NOT RUN
and fails the result.

New/changed scripts: `…:docker:system-dark`, `…:docker:system-light`,
`…:docker:forced-light`, `…:docker:forced-dark`, `…:docker:themes` (all four in one
run). `--mode all` runs all six; `--mode both` still means light + dark. Anything
after `--` is forwarded to `test-storybook`, so a single-story check is
`…:docker -- ui-avatar`.

Coverage is tuned in two places rather than by minting more PNGs. The curated
sample is the **PR** default (latency, not compute: 112 stories are ~12 s of jest
against the ~5 min of install + Storybook build a leg pays anyway), and
`.github/workflows/visual-regression-themes-full.yml` runs the same four profiles
over the **full corpus** weekly and on `workflow_dispatch` — one job, one Storybook
build, all four profiles — which is what catches a component that keys off
`[data-theme]` and is not in the sample. Locally: `--full`.

A story that is knowingly different under one of these profiles goes in
`.storybook/theme-deviations.json`, never into a new baseline. The entry **inverts**
the assertion — the story MUST differ, and the run fails the moment it stops
differing, so the waiver cannot outlive its cause (a profile-owned PNG does the
opposite: freezes the deviation as ground truth and passes forever, including on the
run where it gets worse). Entries carry a reason, an approver, a date and an optional
expiry; the capture script also refuses to start when an entry names a story the run
never captures, since a waiver that cannot execute looks like tracked coverage and
asserts nothing.

The registry holds one entry, which is also the first finding of the new profiles:
the shadow-DOM popover story renders from the OS preference rather than the app's
`[data-theme]`, because the token bundle declares `color-scheme: light dark` on
`:host` as well as `:root` and that lands on the shadow host (acronis/uikit#674).
The fix belongs in `tools/style-dictionary` + regenerated `tokens-pd` and affects
`ui-legacy` too, so it is tracked separately.
