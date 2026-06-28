# Releasing

Releases are automated via
[Changesets](https://github.com/changesets/changesets). The flow below
applies to **any** published workspace in this monorepo. Currently
`@acronis-platform/shadcn-uikit` is the only one published; the apps
under `apps/` are private and listed in `.changeset/config.json`'s
`ignore` list.

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
2. Merging the Version Packages PR triggers publish to **npm** and
   **GitHub Packages**, and creates a **GitHub Release**.

Do not bump versions manually. Do not delete `.changeset/*.md` files by
hand; Changesets owns them.

## Root release scripts (rarely run manually)

These exist for the Release workflow; you typically don't run them locally:

- `pnpm version` → `changeset version` (rewrites versions + changelogs)
- `pnpm release` → `changeset publish` (publishes to registries)
