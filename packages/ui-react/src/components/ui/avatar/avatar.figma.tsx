// Figma Code Connect — status: COMPLETE
import figma from '@figma/code-connect';

import { Avatar, AvatarFallback, AvatarGroup } from './avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7423-7629',
  {
    props: {
      color: figma.enum('Color', {
        Teal: 'teal',
        Violet: 'violet',
        Red: 'red',
        Yellow: 'yellow',
        Orange: 'orange',
        Blue: 'blue',
        Gray: 'gray',
        Green: 'green',
      }),
      variant: figma.enum('Variant', {
        Text: 'text',
        Icon: 'icon',
      }),
      label: figma.string('Label#7423:11'),
    },
    example: ({ color, variant, label }) => (
      <Avatar color={color} variant={variant} label={label} />
    ),
  }
);

// Mapped to the "AvatarGroup" component (an overlapping row of avatars) in Figma.
figma.connect(
  AvatarGroup,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=3332-4943',
  {
    props: {},
    // `variant` encodes how many avatars stack; the example shows a representative
    // group. The optional trailing text label is composed by the consumer.
    example: () => (
      <AvatarGroup>
        <Avatar color="teal">
          <AvatarFallback>SN</AvatarFallback>
        </Avatar>
        <Avatar color="violet">
          <AvatarFallback>GA</AvatarFallback>
        </Avatar>
        <Avatar color="red">
          <AvatarFallback>SI</AvatarFallback>
        </Avatar>
        <Avatar color="yellow">
          <AvatarFallback>IG</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    ),
  }
);
