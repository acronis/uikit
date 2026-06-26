---
name: sync-tokens
description: >
  Sync design tokens from Figma into the repo end-to-end: pull the Figma
  variable/style snapshot with the repo's figma-token-exporter plugin
  (figma-console MCP as fallback), run the orphan-coverage gate, re-emit the
  canonical tiers/*.json, validate, rebuild tokens-pd, fix any broken downstream
  consumers (ui-react components + visual baselines), and verify no
  unexpected drift — then commit. Use when a token/brand/mode changed in Figma,
  when the repo snapshot looks stale, or when asked to refresh tokens. Invoke
  with /sync-tokens [optional: what changed].
---

# Sync tokens (Figma → repo → tokens-pd → consumers)

Automates the **Figma → repo** token sync as one repeatable runbook. This skill is
the **orchestration layer**; the authoritative reference for the mapping, snapshot
files, helper scripts, and orphan-ID rules is
[`packages/design-tokens/context/figma-sync.md`](../../../packages/design-tokens/context/figma-sync.md).
**Read it before acting** — this skill tells you _what to run in what order_, that
doc tells you _why and how_. On conflict the doc wins **except** the script paths:
figma-sync.md writes `node ../.tmp/scripts/…`, but from `packages/design-tokens/`
the working path is **`node .tmp/scripts/…`** (the `../` is an off-by-one).

Related contracts you must not violate:

- [`packages/design-tokens/AGENTS.md`](../../../packages/design-tokens/AGENTS.md)
  — **never hand-fabricate snapshot data**; `tiers/*.json` is the source of truth
  but a Figma-originated change must come through a real pull.
- [`packages/design-tokens/context/token-contract.md`](../../../packages/design-tokens/context/token-contract.md)
  — classify the change (breaking / additive / cosmetic) for the changeset(s).
- [`packages/tokens-pd/AGENTS.md`](../../../packages/tokens-pd/AGENTS.md)
  — generated output is committed; CI gates on drift.
- [`tools/figma-token-exporter/AGENTS.md`](../../../tools/figma-token-exporter/AGENTS.md)
  — the exporter plugin + receiver that produces the snapshot.

## Backends — evaluated, don't re-litigate

The org is **not** on Figma Enterprise, so the REST Variables API
(`/v1/files/:key/variables/local`) is unavailable — reading variables needs the
Plugin API (something running inside Figma). Bulk-export options:

| Surface                                                         | Bulk export?     | Notes                                                                                                                                                                                                        |
| --------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`tools/figma-token-exporter`**                                | ✅ **preferred** | Repo-owned Figma plugin + local receiver. No third-party MCP. Resolves cross-library alias orphans in-plugin, so the orphan gate passes first try.                                                           |
| **figma-console MCP** (`figma_export_tokens` / `figma_execute`) | ✅ fallback      | Needs the Desktop Bridge plugin connected. Gotcha: two concurrent Claude sessions each spawn a WS server (ports 9223+) and the bridge grabs the lowest — drive the sync from the session that owns the port. |
| **Dev Mode MCP `use_figma`**                                    | ❌ no            | Sandbox: no `fetch`/disk, ~20 KB cap. Reserve `get_variable_defs` for the per-component `/figma-component` path.                                                                                             |
| **REST `/variables/local`**                                     | ❌ no            | Enterprise-gated; this org isn't Enterprise.                                                                                                                                                                 |

## Invocation

```
/sync-tokens [what changed]
```

The optional argument is a hint (e.g. "new telstra brand mode", "danger red
retuned") used to scope the diff review and word the changeset — it does **not**
change the steps.

## Preconditions (stop if unmet)

1. **Figma Desktop** with the **Acronis Token Exporter** plugin imported
   (`tools/figma-token-exporter/manifest.json` via Plugins → Development → Import
   plugin from manifest). Required to run a local plugin.
2. **`FIGMA_ACCESS_TOKEN_ACRONIS`** in the environment (the plugin reads variables
   via the Plugin API; the token is for completeness).
3. `.tmp/scripts/` is present (committed). `.tmp/figma-tokens/` may be absent on a
   fresh clone — the pull populates it.

If you can't get a snapshot, **stop and ask the user** — do not fabricate snapshot
data, and do not hand-patch `tiers/*.json` to stand in for a pull.

## Runbook

Run script steps from `packages/design-tokens/`. Paths below are relative to it.

### 1. Pull the snapshot (figma-token-exporter)

- Start the receiver (from anywhere in the repo):
  `pnpm --filter @acronis-platform/figma-token-exporter receive` — it listens on
  `localhost:3333` and writes into `packages/design-tokens/.tmp/figma-tokens/`.
- In Figma Desktop, open the target file, run **Acronis Token Exporter**, click
  **Send snapshot to repo**. It writes `variables.tokens.json`,
  `variables-meta.json`, and `styles-{text,color,effect}.json`.
- **Fallback (figma-console MCP):** `figma_export_tokens` (`format: dtcg`,
  `scope: file`, `modes: all`, `outputPath: '.tmp/figma-tokens/'`) + a
  `figma_execute` of `getLocalVariablesAsync()` → `variables-meta.json` + style
  pulls. See `figma-sync.md` → _Pull workflow_.

> **Shortcut for steps 2–4:** `pnpm --filter @acronis-platform/design-tokens emit`
> runs the gate → three emitters → validate, fail-fast. Run the steps
> individually (below) only when it fails and you need to see which stage / fix a
> `lib/` map. (It does **not** rebuild tokens-pd or touch consumers — steps 6–8.)

### 2. Orphan-coverage gate (loop until clean)

```bash
node .tmp/scripts/figma-pull-postprocess.mjs
```

Renames `tokens.tokens.json` → `variables.tokens.json` and diffs VariableID
coverage. **Exit 0** → go to step 3. **Exit 1** → it prints a paste-ready
`figma_execute` snippet for the missing IDs (figma-console fallback only — the
exporter already resolves orphans, so it should exit 0 first try); run it, merge
into `variables-meta.json`, re-run until clean.

### 3. Re-emit the canonical JSON (dependency order)

```bash
node .tmp/scripts/figma-to-primitives.mjs
node .tmp/scripts/figma-to-semantic.mjs
node .tmp/scripts/figma-to-components.mjs
```

Order matters (semantic reads primitives; components reads both). These are the
**canonical formatters** — don't reformat their output. If an emitter throws on an
unknown palette name or alias target, extend the right `lib/` map
(`palette-map.mjs` / `alias-map.mjs`) — never bypass it.

Expected, non-fatal `figma-to-components` warnings (do **not** "fix" by editing the
emitter unless told): skipped unmodeled `*/label/typography` **string** tokens;
kept-both flat/nested duplicate groups (e.g. `sidebar.secondary.background`);
inlined raw-value gaps. Components are sourced from the `brand.componentLegacy`
Figma group (the next-gen `brand.components` set is not emitted yet).

### 4. Validate

```bash
pnpm --filter @acronis-platform/design-tokens validate
```

### 5. Review the diff — correctness, not just schema

ajv validates shape, not intent. **The raw `git diff tiers/` is mostly noise** —
the emitters use a canonical mixed layout, so re-emitting reflows lines even when
values are unchanged. Diff by **value**, not text — flatten old vs new to leaf
paths and compare (ignore `com.figma.variableId`/`scopes` churn). A quick approach:

```bash
# for each tier: list ADDED / REMOVED / CHANGED leaf paths vs HEAD
node -e 'const cp=require("child_process"),fs=require("fs");const rel=process.argv[1];
const o=JSON.parse(cp.execSync("git show HEAD:packages/design-tokens/"+rel));const n=JSON.parse(fs.readFileSync(rel));
const f=(x,p,a)=>{if(x&&typeof x=="object"&&!Array.isArray(x))for(const k in x)f(x[k],p?p+"."+k:k,a);else a[p]=JSON.stringify(x);return a};
const A=f(o,"",{}),B=f(n,"",{}),m=k=>!/com\.figma\.(variableId|scopes)/.test(k),s=k=>k.replace(/\.(values|platforms|\$extensions)\b.*/,"");
const u=(x,y)=>[...new Set(Object.keys(x).filter(k=>!(k in y)).filter(m).map(s))].sort();
console.log(rel,"\n ADD",u(B,A),"\n REM",u(A,B),"\n CHG",[...new Set(Object.keys(A).filter(k=>k in B&&A[k]!=B[k]).filter(m).map(s))].sort())' tiers/semantic.json
```

Cross-check against the hint and the Figma change. **A component/semantic
_restructure_ (renamed or removed tokens) is the dangerous case** — it breaks
downstream consumers (step 7). Unexpected diffs → re-pull or investigate first.

### 6. Rebuild tokens-pd + drift check

```bash
pnpm --filter @acronis-platform/tokens-pd build
git status --short ../tokens-pd
```

- A **new brand mode** → a new `css/<brand>.css`, **no code change** (data-driven,
  see `brand-matrix.md`).
- `tiers/` changed but `tokens-pd` didn't → suspicious; confirm intentional.
- The Tailwind builder **skips unroutable component-tier color tokens** with a
  warning (semantic tokens still must route) — expected for the known
  `sidebar.secondary.background-*` / `switch.{container.color-inactive,toggle.color-*}`
  authoring quirks.

### 7. Fix downstream consumers (only if tokens were renamed/removed)

Renames/removals of **component** tokens (leaf names are pass-through from Figma —
not canonicalized) or **semantic** tokens break consumers. **Fix forward** (don't
revert the refresh). Find every broken reference:

```bash
defined=$(grep -rhoE "\-\-ui-[a-z0-9-]+" packages/tokens-pd/css/ | sort -u)
refs=$(grep -rhoE "var\(\s*--ui-[a-z0-9-]+" packages/ui-react/src --include='*.tsx' | sed -E 's/var\(\s*//' | sort -u)
comm -23 <(echo "$refs") <(echo "$defined")   # referenced but undefined = broken
```

- **`packages/ui-react/src/components/ui/<c>/<c>.tsx`** reference `--ui-<c>-*`
  directly; re-theme to the new names and update the component's test assertions.
  (Same pattern used for Switch and Tooltip in this PR.)
- A removed component → delete its consumers; a new one → wire it in.

Then regenerate **visual-regression baselines** in Docker (see ui-react AGENTS.md):

```bash
pnpm --filter @acronis-platform/ui-react storybook:test:visual:docker:update
```

⚠️ **Apple-Silicon caveat:** the compose has no platform pin, so on an M-series Mac
this renders **aarch64** while CI is **x86_64**. Solid-fill components stay under
the 0.5% threshold, but shadow/blur ones (tooltip) diverge ~0.8% → CI rejects an
ARM baseline. So: for a component whose **render is unchanged** by the refresh,
**keep main's baselines** (don't regenerate — `git checkout origin/main -- <png>`);
only regenerate components whose render genuinely changed, and if a blur-heavy one
fails CI, generate with `DOCKER_DEFAULT_PLATFORM=linux/amd64` (QEMU) or let CI
produce them.

### 8. Commit + changeset

- Commit `tiers/*.json` **and** the `tokens-pd` output together (and any consumer
  fixes from step 7). `.tmp/figma-tokens/` stays gitignored — never commit it.
- Changeset **per affected published package** (`design-tokens`, `tokens-pd`, and
  `ui-react` if you re-themed components), category per
  [`token-contract.md`](../../../packages/design-tokens/context/token-contract.md)
  (pre-1.0: breaking → `minor`, additive/cosmetic → `patch`; lead the summary with
  `Add …` / `Adjust …` / `Fix …`).
- Conventional Commit, e.g. `feat(tokens): add telstra brand mode`.

## Gotchas

- **`packages/design-tokens/tiers` must be in `.prettierignore`.** The tiers use a
  canonical emitter layout; the pre-commit `prettier --write` reflows them and
  causes CI drift if not ignored (tokens-pd is already ignored).
- **AI gradients are hardcoded** in `figma-to-semantic.mjs` (`AI_GRADIENT_TRANSFORM`
  - stops), **not pulled live** (`styles-color.json` is not consumed). The Figma
    `Ai/*` paint styles report a 90°-rotated (vertical) transform that doesn't match
    the intended **horizontal** look, so the constant is pinned to identity
    (→ `linear-gradient(90deg, …)`). If the gradient looks wrong, it's this constant
    vs the Figma style — re-orient the Figma styles and revisit making it data-driven.
- **Component token leaf names are pass-through** (only space→hyphen normalized),
  so any Figma component-token rename breaks ui-react in lockstep — there's no
  canonicalization layer for them (unlike palette/semantic aliases).

## Output checklist (done = all green)

- [ ] Snapshot pulled into `.tmp/figma-tokens/` (exporter preferred).
- [ ] Orphan gate exits 0.
- [ ] Three emitters run in order (paths `.tmp/scripts/…`); `tiers/*.json` re-emitted, not reformatted.
- [ ] `design-tokens validate` passes.
- [ ] **Value-level** diff reviewed — only intended tokens changed.
- [ ] `tokens-pd` rebuilt; generated diff is the expected one; no drift.
- [ ] If tokens were renamed/removed: broken ui-react refs fixed forward; VR baselines handled (Apple-Silicon caveat).
- [ ] Changeset(s) added per token-contract; `tiers/` + `tokens-pd` (+ `ui-react`) committed together; `.tmp/` not committed.

## When NOT to use this skill

- **Repo → Figma** (push) — designer-driven, not automated (`figma-sync.md`).
- **One component's tokens** — use `get_variable_defs` in `/figma-component`.
- **A pure code edit to `tiers/*.json`** not mirroring Figma — allowed by
  `AGENTS.md`, but then validate + rebuild tokens-pd by hand; skip the pull steps.
