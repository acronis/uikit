// Figma Code Connect — status: COMPLETE
// Mapped to the "TagIcon" component set (under the "Avatar" frame) in the
// ui-react Figma file.
//
// The set declares one variant property, `Color`, with eight options. Only
// `Violet` is mapped: the other seven have no `--ui-avatar-*` token in
// @acronis-platform/tokens-pd (blue/gray/green are absent entirely), so the
// component exposes only the scheme it can actually paint. Unmapped options
// resolve to `undefined` and fall back to the component default.
//
// The nested `Icon` layer is a plain nested instance — the set defines no
// INSTANCE_SWAP property — so it is read with `figma.children`, not
// `figma.instance`.
import figma from '@figma/code-connect';

import { TagIcon } from './tag-icon';

figma.connect(
  TagIcon,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=5144-27622',
  {
    props: {
      color: figma.enum('Color', {
        Violet: 'violet',
      }),
      icon: figma.children('Icon'),
    },
    example: ({ color, icon }) => <TagIcon color={color} icon={icon} />,
  }
);
