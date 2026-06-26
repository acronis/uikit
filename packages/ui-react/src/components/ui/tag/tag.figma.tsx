// Figma Code Connect — status: COMPLETE
// Mapped to the "Tag" component set in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Tag } from './tag';

figma.connect(
  Tag,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=907-257669',
  {
    props: {
      variant: figma.enum('variant', {
        info: 'info',
        success: 'success',
        warning: 'warning',
        critical: 'critical',
        danger: 'danger',
        neutral: 'neutral',
        ai: 'ai',
      }),
      size: figma.enum('size', {
        md: 'default',
        sm: 'sm',
      }),
      icon: figma.instance('Icon#907:0'),
    },
    example: ({ variant, size, icon }) => (
      <Tag variant={variant} size={size} icon={icon}>
        Label
      </Tag>
    ),
  }
);
