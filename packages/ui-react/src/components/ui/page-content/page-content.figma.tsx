// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node — the page content
// gutter region. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component PageContent <url> --update`.
import figma from '@figma/code-connect';

import { PageContent } from './page-content';

figma.connect(PageContent, 'FIGMA_NODE_URL', {
  example: () => <PageContent>{/* page body */}</PageContent>,
});
