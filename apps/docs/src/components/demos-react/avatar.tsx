'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from '@acronis-platform/ui-react';
import { UserIcon } from '@acronis-platform/icons-react/stroke-mono';

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
        <Avatar color="gray" variant="icon" icon={<UserIcon size={16} />} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
        <span style={{ fontSize: 14 }}>On this ticket</span>
      </div>
    </div>
  );
}
