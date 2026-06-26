// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy (Sonner) without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' with the component link and flip to COMPLETE via
// `/figma-component Toast <url> --update`, then validate with `figma:connect`.
// Maps the single-toast visual; the imperative `toast(...)` API has no Figma node.
import figma from '@figma/code-connect';

import { Toaster } from './toast';

figma.connect(Toaster, 'FIGMA_NODE_URL', {
  example: () => <Toaster />,
});
