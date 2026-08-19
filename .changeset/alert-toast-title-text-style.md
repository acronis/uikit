---
'@acronis-platform/ui-react': patch
---

Drive `Alert` and `Toast` titles from their own component token tier.

Both titles borrowed the semantic `ui-typography-headings-lead` class because
their tiers emitted one only for the description. The tiers now emit a title
text style too, so each component reads its own — matching what the description
already did, and letting a brand re-style just the Alert or Toast title. The two
classes resolve identically today (Inter Regular 18 / 24), so nothing renders
differently.
