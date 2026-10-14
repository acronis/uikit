---
'@acronis-platform/ui-react': patch
---

Dialog: fix nested dialogs visually merging with their parent. A dialog opened from inside another dialog's content is flagged as "nested" by Base UI (by React-tree position) and deliberately renders without its own backdrop — ui-react previously added no compensating treatment, so the two popups sat flush against each other with no depth separation. Keyed to Base UI's `data-nested-dialog-open` attribute, the parent popup (`DialogContent` / `dialogContentVariants`) now recedes while a nested dialog is open: slight scale-down plus a dim scrim derived from the `--ui-background-backdrop-screen` token (36% in light, 80% in dark). In dark theme the nested popup additionally rises one tonal step of the Dialog token tier (header surface plus the tier's hairline border), because the dark container sits at the black floor and no amount of dimming can separate it from another one.
