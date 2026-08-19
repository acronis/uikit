// Figma Code Connect — status: COMPLETE
// Node 10012:195993 ("Card"). Only the `isCollapsable=false` shape is mapped —
// the collapsible variant (`true-expanded` / `true-collapsed`) isn't
// implemented yet.
import figma from '@figma/code-connect';

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
    }) => (
      <Card hasError={hasError}>
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
        />
        <CardContent>{content}</CardContent>
        <CardFooter>{footer}</CardFooter>
      </Card>
    ),
  }
);
