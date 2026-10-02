---
'@acronis-platform/ui-react': patch
---

Keep normal chart legends to three wrapped rows and scroll overflow. Keep list
legends to eight complete rows before scrolling. Add `legendAriaLabel` to charts
with legends so consumers can localize or distinguish each legend group. A
legend joins the tab order only when its content actually overflows.
