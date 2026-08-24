export type VisualColorMode = 'light' | 'dark';

/**
 * A capture profile: how the runner puts the page into a theme state, and which
 * committed baseline family that state must reproduce.
 *
 * ── WHY THIS IS NOT JUST A COLOUR MODE ───────────────────────────────────────
 * Light/dark here is driven by TWO independent inputs, and the pair — not either
 * one — decides what a user sees:
 *
 *   1. `[data-theme]` on the root element (what a consumer sets explicitly, and
 *      what ui-react's `dark:` variant and `chart.tsx`'s `THEMES` selector key
 *      off), and
 *   2. the OS `prefers-color-scheme`, which `color-scheme: light dark` in the
 *      `@acronis-platform/tokens-pd` bundle defers to when NO `[data-theme]` is
 *      present.
 *
 * The `light` and `dark` profiles pin input 1 and leave input 2 at its default,
 * so between them they cover two of the six states the pair can be in. The
 * profiles below are that cross product in full — `[data-theme]` ∈ {light, dark,
 * absent} × OS ∈ {light, dark}:
 *
 *   | profile        | [data-theme] | OS pref | tokens resolve | must equal    |
 *   | -------------- | ------------ | ------- | -------------- | ------------- |
 *   | light          | light        | light   | light          | `<id>`        |
 *   | dark           | dark         | light   | dark           | `<id>--dark`  |
 *   | system-dark    | (absent)     | dark    | dark           | `<id>--dark`  |
 *   | system-light   | (absent)     | light   | light          | `<id>`        |
 *   | forced-light   | light        | dark    | light          | `<id>`        |
 *   | forced-dark    | dark         | dark    | dark           | `<id>--dark`  |
 *
 * The naming is the mechanism, not the colour: a `system-*` profile removes the
 * attribute so the OS decides, a `forced-*` profile sets an attribute the OS
 * CONTRADICTS. So `forced-dark` is not a duplicate of `dark` — `dark` leaves the
 * OS at light and pins `color-scheme` inline, so it never exercises the token
 * bundle's `[data-theme='dark']` rule against a dark machine, and never sees a
 * `prefers-color-scheme` fallback fire on top of an explicit attribute.
 *
 * **The four non-baseline profiles write no new baselines.** `light-dark()`
 * resolves from the *used* value of `color-scheme`, which is `dark` under `dark`,
 * `system-dark` and `forced-dark` alike (and `light` under the other three) — so
 * every token-driven colour is identical by construction, and the render MUST
 * match the baseline the owning profile already committed. Anything that differs
 * is, by definition, styling that keyed off `[data-theme]` directly instead of
 * resolving through a token — which is exactly the defect these profiles exist to
 * find, and which this library has at least one known instance of by design
 * (`chart.tsx`'s per-series `<style>` block).
 *
 * That is why `baseline` is a separate field from `name`: it is the assertion.
 *
 * ── WHY `emulate` IS SET EVEN FOR `light` AND `dark` ──────────────────────────
 * Those two profiles otherwise rely on Chromium's *default* `prefers-color-scheme`
 * being light. That assumption is unstated and load-bearing: were the default ever
 * to flip, both baseline families would silently shift with no code change to
 * point at. Pinning it costs one Playwright call and turns the assumption into a
 * declaration.
 */
export interface VisualProfile {
  /** Profile name, as passed in `STORYBOOK_COLOR_MODE`. */
  name: VisualProfileName;
  /**
   * `[data-theme]` to set on `<html>`, or `null` to REMOVE the attribute so the
   * token bundle's `color-scheme: light dark` defers to the OS.
   */
  themeAttribute: VisualColorMode | null;
  /**
   * Whether to also set `html.style.color-scheme` inline.
   *
   * `false` leaves it to the stylesheet's own rule. That is the honest path for
   * the `forced-*` profiles: a real consumer sets only the attribute, and an
   * inline `color-scheme` would bypass the very rule under test.
   */
  inlineColorScheme: boolean;
  /** OS-level `prefers-color-scheme` to emulate for this capture. */
  emulate: VisualColorMode;
  /** The committed baseline family this profile must reproduce, byte for byte. */
  baseline: VisualColorMode;
  /**
   * Run only the curated story subset (`scripts/system-theme-subset.mjs`).
   *
   * The four non-baseline profiles assert a property that holds per story,
   * independently, so a representative sample tests the same claim a full corpus
   * would — at ~15% of the cost each. `light`/`dark` stay exhaustive because they
   * own the baselines, and a sample cannot own a corpus: the stories it skipped
   * would have no baseline at all.
   */
  subset: boolean;
}

export type VisualProfileName =
  | 'light'
  | 'dark'
  | 'system-dark'
  | 'system-light'
  | 'forced-light'
  | 'forced-dark';

export const VISUAL_PROFILES: Record<VisualProfileName, VisualProfile> = {
  light: {
    name: 'light',
    themeAttribute: 'light',
    inlineColorScheme: true,
    emulate: 'light',
    baseline: 'light',
    subset: false,
  },
  dark: {
    name: 'dark',
    themeAttribute: 'dark',
    inlineColorScheme: true,
    emulate: 'light',
    baseline: 'dark',
    subset: false,
  },
  // The bug case: OS says dark, nothing says otherwise. Tokens go dark via
  // `light-dark()`; anything keyed on `[data-theme='dark']` stays light.
  'system-dark': {
    name: 'system-dark',
    themeAttribute: null,
    inlineColorScheme: false,
    emulate: 'dark',
    baseline: 'dark',
    subset: true,
  },
  // The other half of the system case, and the control for the one above: a
  // stylesheet that ignores the OS entirely still passes this, because the value
  // it falls back to IS light. What it catches is a `prefers-color-scheme`
  // fallback that over-reaches — matching when it should not, or inverting its
  // condition — which renders dark here while `system-dark` stays green and
  // therefore cannot distinguish it from a correct implementation.
  'system-light': {
    name: 'system-light',
    themeAttribute: null,
    inlineColorScheme: false,
    emulate: 'light',
    baseline: 'light',
    subset: true,
  },
  // The guard case: a user on a dark machine who deliberately picked light. The
  // first thing a `prefers-color-scheme` fallback breaks if its
  // `:not([data-theme='light'])` escape hatch is wrong.
  'forced-light': {
    name: 'forced-light',
    themeAttribute: 'light',
    inlineColorScheme: false,
    emulate: 'dark',
    baseline: 'light',
    subset: true,
  },
  // The attribute and the OS AGREE on dark — and the inline `color-scheme` is
  // withheld, unlike the `dark` profile. So this is the only profile where a
  // `prefers-color-scheme: dark` fallback and the `[data-theme='dark']` rule are
  // both live at once: a fallback that fights the attribute (a double-applied
  // inversion, or a UA-painted control taking its `color-scheme` from the media
  // query rather than the rule) shows up here and nowhere else.
  'forced-dark': {
    name: 'forced-dark',
    themeAttribute: 'dark',
    inlineColorScheme: false,
    emulate: 'dark',
    baseline: 'dark',
    subset: true,
  },
};

const DEFAULT_PROFILE: VisualProfileName = 'light';

/**
 * Resolve `STORYBOOK_COLOR_MODE` into a profile.
 *
 * **An unrecognised non-empty value throws rather than falling back to light.**
 * With two modes the cost of a typo was bounded: you got a light run filed under
 * light baselines — mislabelled, but not destructive. Four of the six profiles
 * file against a baseline family they do not own, two of them against the
 * *opposite* family, so the same typo in an `--update` run would overwrite the
 * whole light corpus with dark renders. A default is only safe while every branch
 * is harmless.
 *
 * Empty/unset still means light: docker-compose passes
 * `${STORYBOOK_COLOR_MODE:-light}`, and an empty string is "nobody asked", not a
 * typo.
 */
export function resolveVisualProfile(name: string | undefined): VisualProfile {
  if (name === undefined || name === '')
    return VISUAL_PROFILES[DEFAULT_PROFILE];

  const profile = VISUAL_PROFILES[name as VisualProfileName];
  if (!profile) {
    throw new Error(
      `Unknown STORYBOOK_COLOR_MODE '${name}'. Expected one of: ` +
        `${Object.keys(VISUAL_PROFILES).join(', ')}.\n` +
        'Refusing to fall back to light: four profiles compare against a ' +
        'baseline family they do not own, so a typo in an --update run would ' +
        'overwrite those baselines with renders from the wrong theme.'
    );
  }
  return profile;
}

export function getSnapshotIdentifier(
  storyId: string,
  colorMode: VisualColorMode
): string {
  return colorMode === 'dark' ? `${storyId}--dark` : storyId;
}

/**
 * What `<html>` must look like for a profile. `null` means the attribute /
 * property must be **absent**, not merely unset by us.
 */
export interface RootThemeState {
  dataTheme: VisualColorMode | null;
  inlineColorScheme: VisualColorMode | null;
}

/**
 * The profile → DOM-state decision, as data.
 *
 * **Deliberately not a function that mutates the DOM.** The mutation happens
 * inside `page.evaluate`, whose callback is serialized and run in the browser —
 * it cannot close over an import, so a shared helper would have to be either
 * `toString()`-smuggled across a module boundary or copy-pasted (two sources of
 * truth for the one thing no unit test can see). Returning state instead keeps
 * the branching here, under test, and leaves the runner two unconditional writes.
 *
 * Both fields are always specified, never "leave it alone". Storybook's preview
 * decorator (`globals.ts`'s `applyColorMode`) has already set BOTH the attribute
 * and an inline `color-scheme` by the time the runner acts, so a profile that
 * merely declined to set them would inherit the decorator's — and the `system-*`
 * profiles, whose whole premise is that neither is present, would silently
 * capture the attribute path under a different name.
 */
export function rootThemeState(
  profile: Pick<VisualProfile, 'themeAttribute' | 'inlineColorScheme'>
): RootThemeState {
  return {
    dataTheme: profile.themeAttribute,
    inlineColorScheme:
      profile.inlineColorScheme && profile.themeAttribute !== null
        ? profile.themeAttribute
        : null,
  };
}
