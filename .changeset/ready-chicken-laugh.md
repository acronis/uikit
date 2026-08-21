---
---

No release impact. Removes `packages/ui-legacy`
(`@acronis-platform/shadcn-uikit`) from the repository and unwires it from CI,
the Pages deploy and the docs. The package is not republished or unpublished —
versions up to `0.36.3` stay on npm and are deprecated there. Other published
packages are unaffected.
