---
'@acronis-platform/ui-react': minor
---

Add `Popover` (initial version ported from ui-legacy). A floating panel anchored to a trigger — `Popover`, `PopoverTrigger`, `PopoverContent` (+ `PopoverPortal`) — built on the Base UI Popover primitive (positioning, focus management, outside-press / Esc dismissal). `PopoverContent` accepts `side` / `align` / `sideOffset`, `portal`, and `portalContainer` (for isolated-style mounts). Themed from the shared semantic surface tokens (`bg-background` / `text-foreground` / `border-border`); enter/exit animations use `tw-animate-css`. Design-pending until a `--ui-popover-*` tier exists.
