// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Card is a
// compositional component (no variant/size props), so there are no property
// mappings to verify — only the node URL is missing. Replace 'FIGMA_NODE_URL'
// with the component-set link and flip the status to COMPLETE via
// `/figma-component Card <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Card, CardContent, CardHeader, CardTitle } from './card';

figma.connect(Card, 'FIGMA_NODE_URL', {
  example: () => (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>Content</CardContent>
    </Card>
  ),
});
