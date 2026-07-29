---
'@acronis-platform/ui-react': minor
---

Add `DialogWelcome`, a two-layout onboarding dialog (`carousel` — a multi-slide
feature tour driven by a real Embla carousel engine — and `single`), with its
`DialogFooterCarousel` footer. Also fixes the shared `Dialog`/`DialogContent`
popup to keep the Figma-defined 48px minimum viewport edge-inset, which
affects every `Dialog` consumer.
