// Figma Code Connect — status: COMPLETE
// Mapped to the "Breadcrumb" item component in the shadcn-uikit Figma file.
// The node is a single breadcrumb item with a `state` variant
// (idle/hover/pressed/focus/active). `state=active` is the current page —
// rendered as a non-link BreadcrumbPage with no trailing separator; every
// other state is an interactive link followed by a chevron separator.
import figma from '@figma/code-connect';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

figma.connect(
  BreadcrumbItem,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=1017-2852',
  {
    props: {
      current: figma.enum('state', {
        active: true,
      }),
    },
    example: ({ current }) =>
      current ? (
        <BreadcrumbItem>
          <BreadcrumbPage>Item</BreadcrumbPage>
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Item</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
      ),
  }
);
