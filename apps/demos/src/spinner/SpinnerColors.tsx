import { Spinner } from '@acronis-platform/shadcn-uikit/react'

export function SpinnerColors() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" className="text-blue-500" />
        <span className="text-xs text-muted-foreground">Blue</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" className="text-green-500" />
        <span className="text-xs text-muted-foreground">Green</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" className="text-orange-500" />
        <span className="text-xs text-muted-foreground">Orange</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" className="text-red-500" />
        <span className="text-xs text-muted-foreground">Red</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" className="text-purple-500" />
        <span className="text-xs text-muted-foreground">Purple</span>
      </div>
    </div>
  )
}
