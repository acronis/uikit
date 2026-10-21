---
'@acronis-platform/ui-react': patch
---

Tooltip: `TooltipContent` now wraps long unbroken tokens (emails, URLs, UUIDs) inside its bounded popup instead of letting them run past the popup's edge. The popup sets `overflow-wrap: break-word` (`break-words`) alongside its max-width token (PLTFRM-96827).
