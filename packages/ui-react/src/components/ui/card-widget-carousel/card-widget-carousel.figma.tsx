// Figma Code Connect — status: COMPLETE
// Figma: "CardWidgetCarousel" component set, node 9031:135455.
// The `state` variant ("empty" / "live") is a design preview state for the
// inner action cards, not a React prop — the carousel accepts generic children.
import figma from '@figma/code-connect';

import { CardWidgetCarousel } from './card-widget-carousel';

figma.connect(
  CardWidgetCarousel,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=9031-135455',
  {
    example: () => (
      <CardWidgetCarousel>
        {/* action cards go here */}
      </CardWidgetCarousel>
    ),
  }
);
