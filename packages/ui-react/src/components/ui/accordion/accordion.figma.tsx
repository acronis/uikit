// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. A Figma node would
// map the accordion item (header + panel). Replace 'FIGMA_NODE_URL' and flip to
// COMPLETE via `/figma-component Accordion <url> --update`.
import figma from '@figma/code-connect';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

figma.connect(Accordion, 'FIGMA_NODE_URL', {
  example: () => (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>Section</AccordionTrigger>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
});
