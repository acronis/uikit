import { Spinner } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerInline() {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        <Spinner size="sm" className="inline-block align-middle mr-2" />
        Fetching latest updates...
      </p>
      <p className="text-sm">
        Your request is being processed
        <Spinner size="sm" className="inline-block align-middle ml-2" />
      </p>
    </div>
  )
}
