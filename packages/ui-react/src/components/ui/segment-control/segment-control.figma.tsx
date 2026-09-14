// Figma Code Connect — status: COMPLETE
import figma from '@figma/code-connect';

import { SegmentControl, SegmentControlItem } from './segment-control';

figma.connect(
  SegmentControl,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=9458-47627',
  {
    props: {
      variant: figma.enum('variant', {
        hug: 'hug',
        fill: 'fill',
      }),
      hasScroll: figma.boolean('hasScroll'),
    },
    example: ({ variant, hasScroll }) => (
      <SegmentControl
        variant={variant}
        hasScroll={hasScroll}
        defaultValue="first"
        aria-label="View"
      >
        <SegmentControlItem value="first">First</SegmentControlItem>
        <SegmentControlItem value="second">Second</SegmentControlItem>
      </SegmentControl>
    ),
  }
);

figma.connect(
  SegmentControlItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7305-19670',
  {
    props: {
      children: figma.string('value'),
      hasCounter: figma.boolean('hasCounter'),
    },
    example: ({ children, hasCounter }) => (
      <SegmentControlItem value="first" hasCounter={hasCounter}>
        {children}
      </SegmentControlItem>
    ),
  }
);
