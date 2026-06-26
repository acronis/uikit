// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Replace
// 'FIGMA_NODE_URL' with the component link and flip to COMPLETE via
// `/figma-component WidgetPlaceholder <url> --update`, then validate with
// `figma:connect`. (Legacy referenced Charts-anatomy / Placeholders, 229:73962.)
import figma from '@figma/code-connect';

import {
  WidgetPlaceholder,
  WidgetPlaceholderContent,
  WidgetPlaceholderHeader,
  WidgetPlaceholderImage,
  WidgetPlaceholderText,
  WidgetPlaceholderTitle,
} from './widget-placeholder';

figma.connect(WidgetPlaceholder, 'FIGMA_NODE_URL', {
  props: {
    interactive: figma.boolean('interactive'),
  },
  example: ({ interactive }) => (
    <WidgetPlaceholder interactive={interactive}>
      <WidgetPlaceholderHeader>
        <WidgetPlaceholderTitle>Widget title</WidgetPlaceholderTitle>
      </WidgetPlaceholderHeader>
      <WidgetPlaceholderContent>
        <WidgetPlaceholderImage>{/* icon */}</WidgetPlaceholderImage>
        <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>
      </WidgetPlaceholderContent>
    </WidgetPlaceholder>
  ),
});
