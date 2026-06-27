// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. A Figma node would
// map the toggle group (segmented pressable buttons). Replace 'FIGMA_NODE_URL' and
// flip to COMPLETE via `/figma-component ToggleGroup <url> --update`.
import figma from '@figma/code-connect';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

figma.connect(ToggleGroup, 'FIGMA_NODE_URL', {
  example: () => (
    <ToggleGroup>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>
  ),
});
