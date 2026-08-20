// Figma Code Connect — status: COMPLETE
// Node 10012:195993 ("Card"). `isCollapsable` (`false` / `true-expanded` /
// `true-collapsed`) maps to composing `AccordionContainer` around the header
// and content/footer, with `collapsible`/`defaultOpen` derived from the
// variant.
import figma from '@figma/code-connect';

import { AccordionContainer } from '../accordion-container';
import { Card, CardContent, CardFooter, CardHeader } from './card';

figma.connect(
  Card,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=10012-195993',
  {
    props: {
      hasError: figma.enum('hasError', { true: true, false: false }),
      title: figma.string('↳title'),
      description: figma.string('↳description'),
      hasDescription: figma.boolean('↳hasDescription'),
      isDraggable: figma.boolean('↳isDraggable'),
      isSwitchable: figma.boolean('↳isSwitchable'),
      hasAvatar: figma.boolean('↳hasAvatar'),
      hasRename: figma.boolean('↳hasRename'),
      extras: figma.instance('↳extras'),
      actions: figma.instance('↳actions'),
      content: figma.instance('↳content'),
      footer: figma.instance('↳footer'),
      collapsible: figma.enum('isCollapsable', {
        false: false,
        'true-expanded': true,
        'true-collapsed': true,
      }),
      defaultOpen: figma.enum('isCollapsable', {
        false: false,
        'true-expanded': true,
        'true-collapsed': false,
      }),
    },
    example: ({
      hasError,
      title,
      description,
      hasDescription,
      isDraggable,
      isSwitchable,
      hasAvatar,
      hasRename,
      extras,
      actions,
      content,
      footer,
      collapsible,
      defaultOpen,
    }) => (
      <Card hasError={hasError}>
        <AccordionContainer collapsible={collapsible} defaultOpen={defaultOpen}>
          <CardHeader
            title={title}
            description={description}
            hasDescription={hasDescription}
            isDraggable={isDraggable}
            isSwitchable={isSwitchable}
            hasAvatar={hasAvatar}
            hasRename={hasRename}
            extras={extras}
            actions={actions}
            isCollapsible={collapsible}
          />
          <AccordionContainer.Content>
            <CardContent>{content}</CardContent>
            <CardFooter>{footer}</CardFooter>
          </AccordionContainer.Content>
        </AccordionContainer>
      </Card>
    ),
  }
);
