---
'@acronis-platform/ui-react': patch
---

Fix `Calendar`'s `Chevron` override forwarding `react-day-picker`'s numeric `size` onto the icon, which overrode the intended `size={16}` for the dropdown (`captionLayout="dropdown"`) caption chevron (rendering it at 18px). `react-day-picker`'s `size` is now dropped, so all calendar chevrons render at the fixed design size (16) — aligning with `@acronis-platform/icons-react`'s strict `16 | 24` size axis.
