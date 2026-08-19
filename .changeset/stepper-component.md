---
'@acronis-platform/ui-react': minor
---

Add `Stepper`: the root of a step sequence, composing `StepperItem`. It renders
both of the design's layouts and lets a real viewport media query pick one — a
start-aligned, wrapping row of steps at 1024px and above, and a two-line text summary
("Step 3 of 5: …" / "Next: …") below it. No `ResizeObserver` and no measuring
pass: both subtrees stay in the DOM and only one is ever displayed, so exactly
one is announced to assistive tech. Wrapped lines pack to the top of the row
rather than being distributed across any leftover container height, so a second
line sits flush under the first. The "Next: …" line is omitted entirely when
no `next` step is supplied, and every string the component generates itself
(`stepLabel`, `ofLabel`, `nextLabel`, `separatorLabel`) is a prop so it can be
translated.
