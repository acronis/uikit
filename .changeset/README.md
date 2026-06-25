# Changesets

This folder is used by [changesets](https://github.com/changesets/changesets)
to coordinate versioning and publishing of the packages in this monorepo.

## TL;DR

When you make a change that should be released, run from the repo root:

```bash
pnpm changeset
```

Answer the prompts (which package(s), what kind of bump, summary for the
changelog). A new `.md` file is created in this folder — commit it with your
change.

On merge to `main`, the Release workflow opens (or updates) a
"Version Packages" PR that bumps versions and rewrites `CHANGELOG.md`.
Merging that PR triggers the actual publish to npm and GitHub Packages.

Published workspaces are:

- `@acronis-platform/shadcn-uikit` (`packages/ui-legacy`)
- `@acronis-platform/ui-react`
- `@acronis-platform/icons-react`
- `@acronis-platform/icons-sprite`
- `@acronis-platform/tokens-pd`
- `@acronis-platform/design-tokens`
- `@acronis-platform/design-assets`

The apps in `apps/*` are listed as ignored in `config.json`, so changesets
won't try to publish them or insist on bumps for app-only changes.

For details, see [the changesets docs](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md).
