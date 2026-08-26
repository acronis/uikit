// Figma Code Connect — status: NEEDS_FIGMA_URL (closest existing marker; the
// status enum has no "intentionally undesigned" value — see
// context/figma-code-connect.md)
// **No design is expected — this is not a TODO.** Grid is an intentionally
// headless CSS-grid layout primitive: it renders no visuals, only column/gap
// structure, so there is nothing for a designer to draw as a component. Figma
// expresses the same thing with auto-layout on whatever frame uses it. There is
// no Figma node for Grid and no effort to get one; the placeholder URL below
// exists only so the example mapping is recorded.
import figma from '@figma/code-connect';

import { Grid } from './grid';

figma.connect(Grid, 'FIGMA_NODE_URL', {
  example: () => <Grid cols={3} />,
});
