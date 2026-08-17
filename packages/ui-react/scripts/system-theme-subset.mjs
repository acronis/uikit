#!/usr/bin/env node
// packages/ui-react/scripts/system-theme-subset.mjs
//
// The curated story subset run by the four non-baseline capture profiles —
// `system-dark`, `system-light`, `forced-light`, `forced-dark` (see
// `.storybook/visual-regression.ts` for what those profiles assert).
//
// ── WHY A SUBSET, AND WHY IT IS SOUND ────────────────────────────────────────
// Those profiles do not commit baselines. They re-render an existing baseline
// from a DIFFERENT theme input and assert the pixels are unchanged — a property
// that holds per story, independently. So a sample tests the same claim the full
// corpus would; it just tests it on fewer stories. That is unlike the light/dark
// profiles, which OWN their baselines and must therefore be exhaustive.
//
// ── WHY TITLES, NOT STORY IDS ────────────────────────────────────────────────
// `@storybook/test-runner` in index-json mode writes ONE generated test file per
// story *title* — `getIndexTempDir` does `tmpDir/${titleId}.test.js`, with every
// story in that title a `test()` inside it. jest's test-path filter therefore
// selects titles; there is no path-level handle on an individual story.
//
// ── HOW THE TITLES WERE CHOSEN ───────────────────────────────────────────────
// Not "the popular components". One title per DISTINCT MECHANISM that can render
// differently when the theme arrives via the OS rather than via `[data-theme]`.
// Adding another button-like component would add stories but no new mechanism.

/**
 * @typedef {{ id: string, title: string, type: string }} IndexEntry
 */

/**
 * Storybook titles in the subset, grouped by the mechanism each group probes.
 * Keep the grouping — it is the argument for why the sample is representative,
 * and it is what tells a future reader whether their new component needs adding.
 */
export const SUBSET_GROUPS = [
  {
    mechanism: 'chart inline <style>',
    // `ChartStyle` (src/components/ui/chart/chart.tsx) emits a per-series colour
    // block scoped by a LITERAL `[data-theme='dark']` selector — `THEMES` in that
    // file — not by a token. It is the one place in the library where dark
    // styling provably cannot follow the OS, so it anchors the whole sample.
    titles: ['Widgets/Chart'],
  },
  {
    mechanism: 'UA-rendered form controls',
    // `<input>`, the native date bits, checkbox and switch are painted by the
    // browser from the USED value of `color-scheme` — not from any `--ui-*`
    // token. They are the widgets most likely to disagree when `color-scheme`
    // comes from the stylesheet instead of an inline style.
    titles: [
      'UI/InputText',
      'UI/InputSelect',
      'UI/Checkbox',
      'UI/Switch',
      'UI/InputDatePicker',
    ],
  },
  {
    mechanism: 'portaled overlays',
    // Rendered outside `#storybook-root`, so they inherit theme state from the
    // document root by a different path than in-tree content. A root-level
    // attribute that never reached the portal shows up here first.
    titles: [
      'UI/Tooltip',
      'UI/Select',
      'UI/Dialog',
      'UI/Popover',
      'UI/DropdownMenu',
    ],
  },
  {
    mechanism: 'UA-rendered scrollbars',
    // Scrollbar colour is another direct consumer of `color-scheme`'s used value.
    titles: ['UI/ScrollArea'],
  },
  {
    mechanism: 'broad token surfaces',
    // Ordinary components whose every colour resolves through `light-dark()`.
    // These are the control group: they MUST be identical, and if they are not,
    // the defect is in the token layer rather than in one component's CSS.
    titles: [
      'UI/Button',
      'UI/Table',
      'UI/Alert',
      'UI/Tag',
      'UI/Avatar',
      'UI/Card',
      'UI/Tabs',
    ],
  },
  {
    mechanism: 'whole-screen integration',
    // One full application frame. A per-component sample cannot see a defect that
    // only appears where many components meet a page background.
    titles: ['UI/AppShell'],
  },
];

export const SUBSET_TITLES = SUBSET_GROUPS.flatMap((g) => g.titles);

/**
 * Resolve subset titles to the `titleId`s that name the generated test files.
 *
 * **Derived from the live index rather than by re-implementing Storybook's
 * `sanitize()`.** A local copy of that slug rule would be a second source of
 * truth that drifts silently: the pattern would simply stop matching, jest would
 * run fewer tests, and the run would go GREEN. Reading the ids Storybook actually
 * emitted makes that impossible.
 *
 * Throws — never returns a partial list — on:
 *   - a title with no stories in the index (renamed, deleted, or a typo here), and
 *   - a title whose stories disagree about their id prefix (the `--` split below
 *     is an assumption; this is where it gets checked rather than trusted).
 *
 * Both are the same failure in the end: a filter that matches nothing looks
 * exactly like a suite that passed.
 *
 * @param {IndexEntry[]} entries `Object.values(index.entries)` from index.json
 * @param {string[]} titles
 * @returns {string[]} titleIds, in the order the titles were given
 */
export function resolveTitleIds(entries, titles) {
  const stories = entries.filter((e) => e.type === 'story');

  /** @type {Map<string, Set<string>>} */
  const byTitle = new Map();
  for (const entry of stories) {
    const separator = entry.id.indexOf('--');
    if (separator <= 0) {
      throw new Error(
        `Story id '${entry.id}' has no '--' separator, so its title id cannot ` +
          "be derived. Storybook's id format has changed; fix this resolver " +
          'before trusting any subset run.'
      );
    }
    const titleId = entry.id.slice(0, separator);
    if (!byTitle.has(entry.title)) byTitle.set(entry.title, new Set());
    byTitle.get(entry.title).add(titleId);
  }

  const missing = titles.filter((t) => !byTitle.has(t));
  if (missing.length) {
    throw new Error(
      `The system-theme subset lists ${missing.length} title(s) that no longer ` +
        `exist in Storybook's index:\n` +
        missing.map((t) => `  - ${t}`).join('\n') +
        '\n\nA stale title silently shrinks the subset — jest matches fewer ' +
        'test files and the run still passes. Update SUBSET_GROUPS in ' +
        'scripts/system-theme-subset.mjs.'
    );
  }

  return titles.map((title) => {
    const ids = [...byTitle.get(title)];
    if (ids.length !== 1) {
      throw new Error(
        `Title '${title}' maps to ${ids.length} id prefixes (${ids.join(', ')}). ` +
          'The subset resolver assumes one prefix per title; it is wrong here.'
      );
    }
    return ids[0];
  });
}

/** Story ids the subset covers — used to report and assert the expected count. */
export function subsetStoryIds(entries, titles = SUBSET_TITLES) {
  const wanted = new Set(titles);
  return entries
    .filter((e) => e.type === 'story' && wanted.has(e.title))
    .map((e) => e.id);
}

/**
 * jest test-path patterns selecting exactly the subset's generated test files —
 * **one per title**, because jest ORs all of its positional path patterns.
 *
 * ── WHY NOT ONE `(a|b|c)` ALTERNATION ────────────────────────────────────────
 * These arguments cross at least two shells before reaching jest's argv: the
 * compose `sh -c` that expands `$VISUAL_TEST_ARGS`, and the runner's own
 * re-invocation, which parses the already-expanded string as source. A `(`, `|`
 * or `\` that survives the first is a syntax error in the second, and the number
 * of passes is not knowable from here — so any single-pass escaping would be a
 * guess about a layer we do not control.
 *
 * Hence an ALLOWLIST of characters that are inert to a shell no matter how many
 * times they are parsed: letters, digits, `/`, `.`, `_`, `-`. Two consequences,
 * both deliberate:
 *   - **`.` stays a regex wildcard** rather than the escaped `\.` we would
 *     prefer. It over-matches only a path spelled like `/ui-chartXtest.js`, and
 *     the directory being matched contains nothing but `<titleId>.test.js` files
 *     that Storybook itself just wrote.
 *   - **No trailing `$`.** The leading `/` still prevents `ui-chart` matching
 *     `xui-chart.test.js`, which is the collision that actually threatens us.
 */
export function buildTestPathPatterns(titleIds) {
  if (!titleIds.length) {
    throw new Error(
      'Refusing to build an empty test-path pattern: it would match every test.'
    );
  }
  return titleIds.map((titleId) => assertShellInert(`/${titleId}.test.js`));
}

/** Characters that survive an arbitrary number of shell parses unchanged. */
const SHELL_INERT = /^[A-Za-z0-9/._-]+$/;

export function assertShellInert(pattern) {
  if (!SHELL_INERT.test(pattern)) {
    const offenders = [
      ...new Set([...pattern].filter((c) => !SHELL_INERT.test(c))),
    ];
    throw new Error(
      `Test-path pattern ${JSON.stringify(pattern)} contains ` +
        `${offenders.length} character(s) a shell may reinterpret: ` +
        `${JSON.stringify(offenders.join(''))}.\n` +
        'These arguments cross at least two shells before reaching jest (the ' +
        "compose `sh -c`, then the runner's own re-invocation), so only an " +
        'allowlist is safe — escaping guesses at a layer we do not control.'
    );
  }
  return pattern;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
// `node scripts/system-theme-subset.mjs --print-pattern [storybook-static-dir]`
// prints the pattern on stdout and the story count on stderr, exiting non-zero if
// the subset no longer matches the index.
async function main(argv) {
  const { readFileSync } = await import('node:fs');
  const { dirname, join, resolve } = await import('node:path');
  const { fileURLToPath } = await import('node:url');

  const packageDir = dirname(dirname(fileURLToPath(import.meta.url)));
  const dirArg = argv.find((a) => !a.startsWith('--'));
  const indexPath = join(
    dirArg ? resolve(dirArg) : join(packageDir, 'storybook-static'),
    'index.json'
  );

  let entries;
  try {
    entries = Object.values(
      JSON.parse(readFileSync(indexPath, 'utf8')).entries
    );
  } catch (error) {
    console.error(
      `Cannot read Storybook's index at ${indexPath} — build Storybook first ` +
        `(pnpm --filter @acronis-platform/ui-react storybook:build).\n${error.message}`
    );
    process.exit(2);
  }

  const titleIds = resolveTitleIds(entries, SUBSET_TITLES);
  const storyIds = subsetStoryIds(entries);
  console.error(
    `system-theme subset: ${SUBSET_TITLES.length} titles, ${storyIds.length} stories ` +
      `(of ${entries.filter((e) => e.type === 'story').length}).`
  );
  process.stdout.write(buildTestPathPatterns(titleIds).join(' '));
}

if (
  process.argv[1] &&
  (await import('node:url')).pathToFileURL(process.argv[1]).href ===
    import.meta.url
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exit(2);
  });
}
