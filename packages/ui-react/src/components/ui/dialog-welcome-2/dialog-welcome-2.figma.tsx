// Figma Code Connect — status: COMPLETE
// Maps the "DialogWelcome" component set's `variant` (carousel / single) 1:1
// onto this component's own `variant` prop. Neither the per-slide `Title`/
// `Description` text nor the carousel's slide count are exposed as component
// properties in Figma (they're plain nested text layers) — the example uses
// the design's own placeholder copy.
import figma from '@figma/code-connect';

import { DialogWelcome2 } from './dialog-welcome-2';

figma.connect(
  DialogWelcome2,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7162-26459',
  {
    props: {
      variant: figma.enum('variant', {
        carousel: 'carousel',
        single: 'single',
      }),
    },
    example: ({ variant }) =>
      variant === 'single' ? (
        <DialogWelcome2
          variant="single"
          title="Title"
          description="Feature description."
          primaryLabel="Call to action"
          defaultOpen
        />
      ) : (
        <DialogWelcome2
          variant="carousel"
          slides={[
            { title: 'Title', description: 'Feature description.' },
            { title: 'Title', description: 'Feature description.' },
            { title: 'Title', description: 'Feature description.' },
          ]}
          defaultOpen
        />
      ),
  }
);
