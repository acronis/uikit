import { Tag } from '@acronis-platform/shadcn-uikit/react'
import { ExclamationCircleIcon, LockIcon, ShieldIcon } from '@acronis-platform/shadcn-uikit'
import { UnlockIcon } from '../icons/missing-icons'
export function TagSecurity() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<ShieldIcon className="h-4 w-4" />}>
        Verified
      </Tag>
      <Tag variant="info" icon={<LockIcon className="h-4 w-4" />}>
        Encrypted
      </Tag>
      <Tag variant="warning" icon={<UnlockIcon className="h-4 w-4" />}>
        Unlocked
      </Tag>
      <Tag variant="danger" icon={<ExclamationCircleIcon className="h-4 w-4" />}>
        Vulnerable
      </Tag>
    </div>
  )
}
