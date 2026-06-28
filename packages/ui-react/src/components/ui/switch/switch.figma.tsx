// Figma Code Connect — status: NEEDS_FIGMA_URL
// Props are mapped to the code component; the Figma node URL below is a
// placeholder. See context/figma-code-connect.md for how to complete it.
import figma from '@figma/code-connect';

import { Switch } from './switch';

figma.connect(Switch, 'FIGMA_NODE_URL', {
  props: {
    // Figma variant property names are case-sensitive — verify them in the
    // component's Properties panel and adjust the left-hand keys if needed.
    checked: figma.boolean('Checked'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ checked, disabled }) => (
    <Switch defaultChecked={checked} disabled={disabled} />
  ),
});
