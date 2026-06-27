// Figma Code Connect — status: NEEDS_FIGMA_URL
// The linked Cyber-Compliance node 2396-186059 is a table *instance* of the ring,
// not the component master. Locate the ProgressCircle/ProgressRadial master node,
// replace 'FIGMA_NODE_URL', and flip to COMPLETE via
// `/figma-component ProgressCircle <url> --update`.
import figma from '@figma/code-connect';

import { ProgressCircle } from './progress-circle';

figma.connect(ProgressCircle, 'FIGMA_NODE_URL', {
  props: {
    size: figma.enum('size', {
      tiny: 'tiny',
      small: 'sm',
      medium: 'md',
      large: 'lg',
    }),
  },
  example: ({ size }) => <ProgressCircle value={75} size={size} showValue />,
});
