// Figma Code Connect — status: COMPLETE
// Mapped to the "Avatar" component (an avatar group) in the shadcn-uikit Figma file.
import figma from '@figma/code-connect';

import { Avatar, AvatarFallback, AvatarGroup } from './avatar';

figma.connect(
  AvatarGroup,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/shadcn-uikit?node-id=3332-4943',
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
