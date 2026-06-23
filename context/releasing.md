# Releasing

Releases are automated via
[Changesets](https://github.com/changesets/changesets). The flow below
applies to **any** published workspace in this monorepo. The published
packages are `@acronis-platform/shadcn-uikit` (ui-legacy), `ui-react`,
`icons-react`, `icons-sprite`, `tokens-pd`, `design-tokens`, and
`design-assets`; the `apps/` and `tools/` workspaces are private (listed
in `.changeset/config.json`'s `ignore` list).

## When to add a Changeset

Any PR that changes the **published surface** of a published workspace
must include a `.changeset/*.md` file. "Published surface" generally
means anything in:

- the workspace's `src/`
- the workspace's `package.json` (deps, exports, scripts that affect build)
- the workspace's build config (`tsconfig.build.json`, `vite.config.*`,
  etc.)

Each published workspace's `CONTRIBUTING.md` spells out exactly what
counts for that workspace. Pure repo-tooling changes (root config, CI,
`./context/`, `AGENTS.md`, READMEs) do not need a Changeset.

## How to add one

```bash
pnpm changeset
```

The interactive prompt asks for the bump type (`patch` / `minor` /
`major`) and a one-line summary. It writes a markdown file under
`.changeset/`. Commit that file alongside the code change.

## Bump type guidance

- **patch** — bug fixes, internal refactors, dependency updates that
  don't affect consumers.
- **minor** — additive, backwards-compatible: new exports, new
  options, new props.
- **major** — breaking changes (removed exports, renamed identifiers,
  changed defaults). Avoid until a major release is planned.

## What happens on merge to `main`

1. The **Release** workflow opens (or updates) a single "Version
   Packages" PR aggregating all pending changesets. It bumps the
   affected workspace's `package.json` version, updates its
   `CHANGELOG.md`, and deletes the consumed `.changeset/*.md` files.
2. Merging the Version Packages PR triggers `release.yml` to publish the
   bumped packages to **npm** (with provenance) and create a **GitHub
   Release**. See _Publishing paths_ below for how the publish itself is
   authenticated (OIDC by default; a token workflow bootstraps brand-new
   packages).

Do not bump versions manually. Do not delete `.changeset/*.md` files by
hand; Changesets owns them.

## Publishing paths: OIDC (default) and token (bootstrap)

Two workflows can publish to npm; both attach build provenance.

- **`release.yml` — OIDC Trusted Publishing (the default).** Runs on every
  push to `main`; on a Version Packages PR merge it runs `changeset publish`
  with **no npm token** — GitHub's OIDC token is exchanged for a short-lived
  npm credential. This is the normal path for packages that **already exist on
  npm**. Requirements (all in place): the job has `permissions: id-token:
write`, npm is upgraded to a Trusted-Publishing-capable version, and each
  package declares a `repository` field (provenance validates `repository.url`
  against `https://github.com/acronis/uikit` — an empty/missing one fails with
  `E422`).

- **`release-token.yml` — token auth (manual; bootstrap / fallback).**
  Dispatched manually (`workflow_dispatch`). Publishes an explicit, fixed list
  of packages with a static automation token (`NPM_PUBLISH_TOKEN_2`) and a
  per-package skip-if-already-published guard, so it is safe to re-run. Use it
  for a package's **first-ever publish** — OIDC Trusted Publishing cannot
  bootstrap a package that doesn't exist on npm yet — or if OIDC config is
  missing. It deliberately does **not** publish `shadcn-uikit` (ui-legacy),
  which stays on the OIDC path.

### Putting a new package on the OIDC path (one-time)

1. Publish its first version via `release-token.yml` (the package must exist on
   npm before OIDC will work).
2. On npmjs.com → the package → **Settings → Trusted Publisher → GitHub
   Actions**, set: organization `acronis`, repository `uikit`, workflow
   filename `release.yml`, environment blank.
3. Done — later versions publish automatically through `release.yml` on the
   Version-Packages-PR merge, no token.

The trusted-publisher binding is exact: renaming `release.yml` or the repo
requires updating the npm config, or OIDC publishes will `403`. Keep
`release-token.yml` as the documented fallback either way.

## Root release scripts (rarely run manually)

These exist for the Release workflow; you typically don't run them locally:

- `pnpm version` → `changeset version` (rewrites versions + changelogs)
- `pnpm release` → `changeset publish` (publishes to registries)
