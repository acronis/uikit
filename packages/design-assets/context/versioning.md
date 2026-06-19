# How big is an asset change?

These pack manifests are the master source for how Acronis icons and illustrations are served —
change one, and every product eventually uses the new data. So before you record a change, size
it: **how much could it disrupt the consumers of these assets?**

Every change is recorded as one of three version bumps — **major**, **minor**, or **patch**.
Picking the right one is the only label you need to get right.

## The three sizes

| Bump                    | What it means for the products using the assets                                                | The kinds of change that go here                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 **major** (breaking) | Something they relied on **broke** — their builds won't resolve until a developer updates.     | • **Removing** a pack<br>• **Removing** an asset<br>• **Renaming** an asset id (breaks `<pack>.<id>` references)<br>• **Removing** a rule |
| 🟡 **minor** (additive) | Something **new** is available and **nothing old changed** — safe to adopt when ready.         | • **Adding** a pack<br>• **Adding** assets to an existing pack<br>• **Adding** a new rule<br>• **Adding** a group (`assetsGroups`)        |
| 🟢 **patch** (cosmetic) | **Nothing breaks and nothing new** — a value changed but kept its meaning, or an internal fix. | • Updating a binary (same asset, new artwork)<br>• Fixing a `$file` path<br>• Tweaking Figma metadata (`com.figma.nodeId`)                |

> **The size is about effect, not how big your edit is.** Update every icon binary and it's
> still a **patch** (the ids and structure held); add _one_ new asset and it's a **minor**. The
> only question: did you **break**, **add**, or **safely change**?

## Two version numbers

An asset change bumps two version numbers in sync:

- **The pack's `"version"` field** in `packs/<pack>.json` — the pack's own semver.
- **The npm package version** — driven by the Changesets file you create (see below).

Both follow the same bump size for the same change.

## Recording the change

Every change ships with a short note — a **changeset** — saying what changed and which size it is.

Create one with:

```bash
pnpm changeset          # from the repo root
```

Start the note with the action — "Added…", "Removed…", "Fixed…" — and for a **major** change,
say what consumers must update (e.g. "Renamed `add` → `plus` in `icons.solid-mono` — update any
reference from `icons.solid-mono.add` to `icons.solid-mono.plus`").

See [`../../context/releasing.md`](../../context/releasing.md) for the full Changesets workflow.

---

New to a word here (asset, pack, group, rule)? The
[`glossary`](./glossary.md) explains them in plain terms.
