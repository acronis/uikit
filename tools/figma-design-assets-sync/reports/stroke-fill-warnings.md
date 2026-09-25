# Stroke-Mono Fill Integrity Warnings

Icons in `assetsGroups.stroke-mono` of `packs/icons.json` whose binary (under `packs/icons/`) contains hardcoded `fill="#..."` attributes.
These icons have outlined (expanded) strokes in Figma instead of live stroke paths.
The fix must be applied in the Figma source file.

**Total affected: 5** · Fully outlined: 0 · Mixed (fill + stroke): 5

---

## Mixed (fill + stroke)

These icons use both fills and strokes. The fills may be intentional (e.g. screen bezels,
rack details) or may indicate partial outlining. Review case-by-case.

| Preview                                                                                  | Name             |
| ---------------------------------------------------------------------------------------- | ---------------- |
| <img src="../../../packages/design-assets/packs/icons/Crosshair.svg" height="24" />      | `Crosshair`      |
| <img src="../../../packages/design-assets/packs/icons/DiamondWarning.svg" height="24" /> | `DiamondWarning` |
| <img src="../../../packages/design-assets/packs/icons/NodePyramid.svg" height="24" />    | `NodePyramid`    |
| <img src="../../../packages/design-assets/packs/icons/Patch.svg" height="24" />          | `Patch`          |
| <img src="../../../packages/design-assets/packs/icons/Watch.svg" height="24" />          | `Watch`          |
