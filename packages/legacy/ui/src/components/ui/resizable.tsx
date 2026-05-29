import { GripDotsIcon } from "@/components/icons"
import { Group, Panel, Separator } from "react-resizable-panels"
import { createContext, useContext } from "react"

import { cn } from "@/lib/utils"

const OrientationContext = createContext<"horizontal" | "vertical">("horizontal")

const ResizablePanelGroup = ({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof Group>) => (
  <OrientationContext.Provider value={orientation}>
    <Group
      className={cn("flex h-full w-full", className)}
      orientation={orientation}
      {...props}
    />
  </OrientationContext.Provider>
)

const ResizablePanel = Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & {
  withHandle?: boolean
}) => {
  const orientation = useContext(OrientationContext)
  const isVertical = orientation === "vertical"

  return (
    <Separator
      className={cn(
        "relative flex items-center justify-center bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        isVertical
          ? "h-px w-full after:absolute after:left-0 after:h-1 after:w-full after:-translate-y-1/2 after:translate-x-0 [&>div]:rotate-90"
          : "w-px after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripDotsIcon className="h-2.5 w-2.5" />
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }