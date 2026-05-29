import { Avatar, AvatarFallback } from '@acronis-platform/shadcn-uikit/react'

interface MessageAvatarProps {
  type: 'user' | 'ai' | 'loading'
  size?: 'sm' | 'md'
}

export function MessageAvatar({ type, size = 'md' }: MessageAvatarProps) {
  const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'
  const textSizeClass = size === 'sm' ? 'text-[10px]' : 'text-xs'

  if (type === 'user') {
    return (
      <Avatar className={`${sizeClass} flex-shrink-0`}>
        <AvatarFallback className={`${textSizeClass} bg-primary text-primary-foreground`}>
          U
        </AvatarFallback>
      </Avatar>
    )
  }

  if (type === 'ai') {
    return (
      <Avatar className={`${sizeClass} flex-shrink-0`}>
        <AvatarFallback className={`${textSizeClass} bg-secondary text-foreground`}>
          AI
        </AvatarFallback>
      </Avatar>
    )
  }

  return null
}
