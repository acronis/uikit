# How big is a token change?

These token files are the master source for how Acronis looks — change one, and
every product eventually uses the new value. So before you record a change, size
it: **how much could it disrupt the people building with these tokens?**

Every change is recorded as one of three version bumps — **major**, **minor**, or
**patch**. Picking the right one is the only label you need to get right.

## The three sizes

| Bump                    | What it means for the products using the tokens                                                                       | The kinds of change that go here                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 **major** (breaking) | Something they relied on **broke** — their screens won't look or behave right until a developer updates.              | • **Removing** a token<br>• **Renaming** a token<br>• **Changing what a token means** (e.g. the "error" color is now green)                                                   |
| 🟡 **minor** (additive) | Something **new** is available and **nothing old changed** — safe; they adopt it when ready.                          | • **Adding** a new token<br>• **Adding** a new brand or theme                                                                                                                 |
| 🟢 **patch** (cosmetic) | **Nothing breaks and nothing new** — a value changed but kept its meaning, or you fixed something products never see. | • Tweaking a shade (a bluer blue)<br>• Tuning a light / dark value<br>• **Fixing** a wrong value<br>• Fixing internal data a product never sees (e.g. the link back to Figma) |

> **The size is about effect, not how big your edit is.** Recolor _every_ token
> and it's still a **patch** (as long as the meanings hold); add _one tiny_ token
> and it's a **minor**. The only question: did you **break**, **add**, or
> **safely change**?

## The one trap: meaning, not looks

The catch is hidden inside **major**. It's not about how different something
_looks_ — it's about whether its **meaning** changed:

- A slightly different primary blue → still "the primary brand color" → **patch** ✅
- The **"danger" color turned green** → still a color, but now it means the
  opposite of what every product expects → **major** ⚠️ — even though you renamed
  nothing.

If a change quietly makes a token mean something new, it's **major**: it breaks
what people expect without breaking the name.

## Recording the change

Every change ships with a short note — a **changeset** — saying what changed and
which size it is.

- **Syncing from Figma with the agent?** It writes the changeset for you; just
  check the size matches what really changed.
- **Editing by hand?** See [`CONTRIBUTING.md`](../CONTRIBUTING.md). Start the note
  with the action — "Added…", "Fixed…" — and for a **major** change, say what
  people must do ("renamed `X` → `Y`").

Pick the size, write the note. That's the whole job.

---

New to a word here (token, brand, theme, alias)? The
[`glossary`](./glossary.md) explains them in plain terms.
