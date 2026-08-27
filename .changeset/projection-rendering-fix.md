---
'@acronis-platform/ui-react': patch
---

fix(charts): smooth projection rendering in AreaChart & LineChart

- Fixed sharp break at projection boundary — actual and projection segments
  now connect smoothly via connectNulls
- Fixed legend duplication — projection series are filtered from the legend payload
- Fixed tooltip duplication — projection series are filtered from the tooltip payload
- Added a dashed vertical separator line at the projection boundary
