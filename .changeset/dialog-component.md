---
'@acronis-platform/ui-react': minor
---

Add `Dialog` (initial version ported from ui-legacy; design reconciliation pending). A modal overlay built on the Base UI Dialog primitive, composed from `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogCloseButton`, `DialogBody`, `DialogDescription`, `DialogFooter`, plus the lower-level `DialogOverlay` / `DialogPortal` / `DialogClose` parts. Focus trap, scroll lock, and `Esc`/outside-press dismissal come from Base UI; `DialogContent` accepts a `size` prop (six widths — `xs`/`sm`/`md`/`lg`/`xl`/`2xl`, 464–1136px, default `sm`) and `portalContainer` for isolated-style mounts. Colors resolve to the shared semantic tokens (overlay/surface/text/border); enter/exit animations use `tw-animate-css` (overlay fade, popup fade + zoom); a `--ui-dialog-*` token tier is deferred to a Figma pass.
