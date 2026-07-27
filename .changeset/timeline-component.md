---
'@acronis-platform/ui-react': minor
---

Add `Timeline` — a presentational, chronological event list (`Timeline` +
`Timeline.Item`) for activity feeds, audit logs, and status history. Renders a
semantic `<ol>`/`<li>` with a connector line, status markers (a dot, or an icon
in a status-tinted badge), and a timestamp / title / description hierarchy, plus
optional metadata, actions, and expandable `children`. `size` and `density` come
from `Timeline` via context; `status`
(neutral/info/success/warning/danger/critical) tints only the marker; `current`
rings it and `disabled` dims the item. Purely presentational — it never sorts,
groups, fetches, or interprets events, and ships no domain event types or icons.
Composes with Tag / Link / Accordion. Initial version (design + token-tier
reconciliation pending).
