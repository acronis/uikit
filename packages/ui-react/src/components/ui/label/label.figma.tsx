// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' with the component link and flip to COMPLETE via
// `/figma-component Label <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Label } from './label';

figma.connect(Label, 'FIGMA_NODE_URL', {
  props: {
    text: figma.string('text'),
  },
  example: ({ text }) => <Label>{text}</Label>,
});
