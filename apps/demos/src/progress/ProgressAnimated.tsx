import * as React from 'react'
import { Progress, Button } from '@acronis-platform/shadcn-uikit/react'

export function ProgressAnimated() {
  const [progress, setProgress] = React.useState(50)

  const handleStart = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Loading...</span>
          <span className="text-gray-500">{progress}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      <Button onClick={handleStart} size="sm">
        Start Progress
      </Button>
    </div>
  )
}
