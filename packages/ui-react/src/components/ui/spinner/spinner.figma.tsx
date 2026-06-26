// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' with the component link and flip to COMPLETE via
// `/figma-component Spinner <url> --update`, then validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Spinner } from './spinner';

figma.connect(Spinner, 'FIGMA_NODE_URL', {
  props: {
    size: figma.enum('size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: 'xl',
    }),
  },
  example: ({ size }) => <Spinner size={size} />,
});
