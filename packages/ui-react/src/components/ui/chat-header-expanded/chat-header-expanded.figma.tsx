// Figma Code Connect — status: COMPLETE
// Mapped to the "ChatHeaderExpanded" component set in the ui-react Figma file
// (node 7329:24759). Property names verified via get_context_for_code_connect:
// `hasHistory` (BOOLEAN, key hasHistory#7329:12) and `variant` (VARIANT,
// options chat | tasks).
import figma from '@figma/code-connect';

import {
  ChatHeaderExpanded,
  ChatHeaderExpandedTab,
  ChatHeaderExpandedTabs,
} from './chat-header-expanded';

figma.connect(
  ChatHeaderExpanded,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7329-24759',
  {
    props: {
      hasHistory: figma.boolean('hasHistory'),
      // The Figma `variant` (chat | tasks) is NOT a React prop. It encodes
      // *which tab is selected* — which this component takes as composed
      // children (`active` on a `ChatHeaderExpandedTab`) rather than as a
      // flattened enum — plus which trailing action icon shows (chat → Plus,
      // tasks → BarsFilter; only Plus is implemented). See the spec's
      // packages/ui-spec/components/chat-header-expanded/index.yaml description.
    },
    example: ({ hasHistory }) => (
      <ChatHeaderExpanded hasHistory={hasHistory}>
        {/* PLACEHOLDER tabs — swapped for `SegmentControl` once that component
            ships in Figma. */}
        <ChatHeaderExpandedTabs>
          <ChatHeaderExpandedTab active>Acronis AI</ChatHeaderExpandedTab>
          <ChatHeaderExpandedTab counter={7}>Tasks</ChatHeaderExpandedTab>
        </ChatHeaderExpandedTabs>
      </ChatHeaderExpanded>
    ),
  }
);
