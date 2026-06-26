// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Empty is a
// compositional component (no variant/size props), so there are no property
// mappings to verify — only the node URL is missing. Replace 'FIGMA_NODE_URL'
// with the component-set link and flip the status to COMPLETE via
// `/figma-component Empty <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './empty';

figma.connect(Empty, 'FIGMA_NODE_URL', {
  example: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>There is no data to display.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
});
