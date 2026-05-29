import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxList() {
  return (
    <div className="space-y-1 rounded-lg border">
      {['Task 1', 'Task 2', 'Task 3', 'Task 4'].map((task, index) => (
        <div
          key={index}
          className="flex items-center space-x-2 border-b p-3 last:border-b-0 hover:bg-muted/50"
        >
          <Checkbox id={`task-${index}`} />
          <Label
            htmlFor={`task-${index}`}
            className="flex-1 text-sm font-normal cursor-pointer"
          >
            {task}
          </Label>
        </div>
      ))}
    </div>
  )
}
