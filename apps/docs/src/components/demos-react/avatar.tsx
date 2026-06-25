'use client';

import { Avatar, AvatarFallback, AvatarGroup } from '@acronis-platform/ui-react';

export function AvatarDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
        <Avatar color="orange">
          <AvatarFallback>OR</AvatarFallback>
        </Avatar>
      </div>
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
      </AvatarGroup>
    </div>
  );
}
