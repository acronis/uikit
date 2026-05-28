---
'@acronis-platform/shadcn-uikit': patch
---

Fix: `./components/*` subpath exports now ship the `types` condition
explicitly. Under `moduleResolution: "bundler"` (and `"node16"`/`"nodenext"`),
TypeScript previously couldn't resolve `.d.ts` files via the wildcard's
bare-string mapping and silently fell back to the JS sibling — so deep
imports like `@acronis-platform/shadcn-uikit/components/ui/sonner`
appeared to consumers as "Cannot find module". The runtime resolution is
unchanged.
