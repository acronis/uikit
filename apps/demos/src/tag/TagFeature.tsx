import { Tag } from '@acronis-platform/shadcn-uikit/react'
import { StarIcon } from '@acronis-platform/shadcn-uikit'
import { ZapIcon } from '../icons/missing-icons'
export function TagFeature() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag variant="success" icon={<StarIcon className="h-4 w-4" />}>
        Premium
      </Tag>
      <Tag variant="info" icon={<ZapIcon className="h-4 w-4" />}>
        Fast
      </Tag>
      <Tag variant="warning" size="small">
        Beta
      </Tag>
      <Tag variant="neutral" size="small">
        Legacy
      </Tag>
    </div>
  )
}
