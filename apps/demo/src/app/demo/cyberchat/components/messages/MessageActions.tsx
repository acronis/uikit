import { Button } from '@acronis-platform/shadcn-uikit/react'
import { CopyIcon, RotateIcon, EllipsisHIcon } from '@acronis-platform/shadcn-uikit'
import { ThumbsUpIcon, ThumbsDownIcon, Share2Icon } from '@/components/icons/missing-icons'
import { toast } from 'sonner'
import type { MessageAction } from '../../types'
import { useCyberChatStore } from '../../store/useCyberChatStore'
import { copyToClipboard } from '../../utils/helpers'

interface MessageActionsProps {
  messageId: string
  actions: MessageAction[]
}

const iconMap = {
  copy: CopyIcon,
  like: ThumbsUpIcon,
  dislike: ThumbsDownIcon,
  share: Share2Icon,
  regenerate: RotateIcon,
  more: EllipsisHIcon,
}

export function MessageActions({ messageId, actions }: MessageActionsProps) {
  const { toggleMessageAction, regenerateMessage, messages } = useCyberChatStore()

  const handleAction = async (actionType: string) => {
    switch (actionType) {
      case 'copy': {
        const message = messages.find((m) => m.id === messageId)
        if (message && typeof message.content === 'string') {
          try {
            await copyToClipboard(message.content)
            toast.success('Copied to clipboard')
          } catch {
            toast.error('Failed to copy')
          }
        }
        break
      }
      case 'like':
      case 'dislike':
        toggleMessageAction(messageId, actionType)
        toast.success(
          actionType === 'like' ? 'Thanks for your feedback!' : 'Feedback recorded'
        )
        break
      case 'share':
        toast.info('Share functionality coming soon')
        break
      case 'regenerate':
        regenerateMessage(messageId)
        toast.info('Regenerating response...')
        break
      case 'more':
        toast.info('More options coming soon')
        break
    }
  }

  return (
    <div className="flex items-center gap-1">
      {actions.map((action) => {
        const Icon = iconMap[action.type as keyof typeof iconMap]
        if (!Icon) return null

        return (
          <Button
            key={action.type}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${action.active ? 'text-primary' : ''}`}
            onClick={() => handleAction(action.type)}
            title={action.label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        )
      })}
    </div>
  )
}
