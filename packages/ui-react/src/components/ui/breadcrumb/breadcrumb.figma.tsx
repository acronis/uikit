// Figma Code Connect — status: COMPLETE
// The Figma "Breadcrumb" is composed from three published primitives —
// `_BreadcrumbLink` (a component set with idle/hover/active/focus interaction
// states), `_BreadcrumbPage` (the current page), and `_BreadcrumbSeparator`
// (the chevron). Each maps to its code counterpart below; the interaction
// `state` variant on the link has no prop (it's handled in CSS).
import figma from '@figma/code-connect';

import {
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

figma.connect(
  BreadcrumbLink,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2238-42071',
  {
    props: {
      label: figma.string('label'),
    },
    example: ({ label }) => <BreadcrumbLink href="#">{label}</BreadcrumbLink>,
  }
);

figma.connect(
  BreadcrumbPage,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2238-43556',
  {
    props: {
      label: figma.string('label'),
    },
    example: ({ label }) => <BreadcrumbPage>{label}</BreadcrumbPage>,
  }
);

figma.connect(
  BreadcrumbSeparator,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=2238-43588',
  {
    example: () => <BreadcrumbSeparator />,
  }
);
