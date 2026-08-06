---
'@acronis-platform/ui-react': patch
---

Put a floor under the gap between a chart tooltip row's name and its value. The shared `ChartTooltipContent` row separated the two with `justify-between` alone, which only spaces them while the tooltip's `min-w-[8rem]` leaves free space to distribute — so a short value (`275`) read fine while a longer one (a currency tick formatter, a `labelFormatter` with units, a value alongside its share) grew the row past that width and left the name and value touching. Affects every chart that renders the default tooltip row.
