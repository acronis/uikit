---
'@acronis-platform/ui-react': patch
---

Fix RadarChart category labels clipping at the box edges and colliding with the legend. The chart now centres its web on the plot band the legend leaves rather than on the whole box, and widens its default height when `showLabels` pushes the category labels further out.
