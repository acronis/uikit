// Figma Code Connect — status: COMPLETE
// Mapped to the "Tag" component set in the shadcn-uikit Figma file. The Figma
// "AI" variant is intentionally unmapped — it's not shipped yet (pending an
// upstream `--ui-background-status-ai` token).
import figma from '@figma/code-connect';

import { Tag } from './tag';

figma.connect(
  Tag,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=907-257669',
  {
    props: {
      variant: figma.enum('Variant', {
        Info: 'info',
        Success: 'success',
        Warning: 'warning',
        Critical: 'critical',
        Danger: 'danger',
        Neutral: 'neutral',
      }),
      size: figma.enum('Size', {
        Default: 'default',
        Small: 'sm',
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
