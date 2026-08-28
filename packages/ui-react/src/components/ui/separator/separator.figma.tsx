// Figma Code Connect — status: COMPLETE
// DividerHorizontal component set (node 788:15147, page "DividerHorizontal").
// Figma models only the horizontal orientation; `orientation="vertical"` has
// no Figma counterpart yet and is left at its ui-react default.
import figma from '@figma/code-connect';

import { Separator } from './separator';

figma.connect(
  Separator,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=788-15147',
  {
    props: {
      size: figma.enum('Size', {
        S1: 'S1',
        S2: 'S2',
        S3: 'S3',
      }),
    },
    example: ({ size }) => <Separator size={size} />,
  }
);
