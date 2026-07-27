// Figma Code Connect — status: NEEDS_FIGMA_URL
// Timeline is a design-pending v1 presentational primitive (a chronological
// event list with markers, a connector, and status). There is no "ready for
// dev" Figma node yet. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Timeline <url> --update` once a mockup lands.
import figma from '@figma/code-connect';

import { Timeline } from './timeline';

figma.connect(Timeline, 'FIGMA_NODE_URL', {
  example: () => (
    <Timeline>
      <Timeline.Item timestamp="Today, 10:30" title="Event title" status="success" />
    </Timeline>
  ),
});
