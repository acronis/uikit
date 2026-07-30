---
'@acronis-platform/ui-react': minor
---

Add `ChatHeaderExpanded`: the header bar of the expanded AI-chat panel (Figma node 7329-24759). A 64px band with a bottom hairline, a composed pill tab group on the inline-start side, and icon actions on the inline-end side — a `Plus` "new chat" button plus an optional conversation-history button behind `hasHistory`. Both actions reuse the existing `ButtonIcon`; tab counters reuse the existing `Tag`. Themed by the newly imported `--ui-chat-*` token tier.

Tab content is composed via `ChatHeaderExpandedTabs` / `ChatHeaderExpandedTab` children rather than a flattened `tabs` prop, so labels stay consumer-owned and localizable. Those two parts are a documented, temporary placeholder for the standalone `SegmentControl` component (still in progress in Figma) — they are styled from the real, already-shipped `--ui-segment-control-*` tier and will be deleted once `SegmentControl` lands.
