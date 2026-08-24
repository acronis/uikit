// Figma Code Connect — status: COMPLETE
// `EmptyOverlay` exposes no Figma component properties (no variant/instance
// swap) — the icon, title, and description are all baked into the one
// example instance, so there's nothing to map via `figma.enum`/`figma.instance`.
import figma from '@figma/code-connect';
import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';

import { EmptyOverlay } from './empty-overlay';

figma.connect(
  EmptyOverlay,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7461-40875',
  {
    example: () => (
      <EmptyOverlay
        icon={<InboxIcon />}
        title="No object yet"
        description="Short description."
      />
    ),
  }
);
