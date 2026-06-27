// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. A Figma node would
// map the slider (track + indicator + thumb). Replace 'FIGMA_NODE_URL' and flip to
// COMPLETE via `/figma-component Slider <url> --update`.
import figma from '@figma/code-connect';

import { Slider } from './slider';

figma.connect(Slider, 'FIGMA_NODE_URL', {
  example: () => <Slider defaultValue={40} />,
});
