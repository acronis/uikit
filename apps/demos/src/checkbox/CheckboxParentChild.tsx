import * as React from 'react'
import { Checkbox, Label } from '@acronis-platform/shadcn-uikit/react'

export function CheckboxParentChild() {
  const [items, setItems] = React.useState([
    { id: '1', label: 'Item 1', checked: false },
    { id: '2', label: 'Item 2', checked: false },
    { id: '3', label: 'Item 3', checked: false },
  ])

  const allChecked = items.every((item) => item.checked)
  const someChecked = items.some((item) => item.checked)
  const parentChecked = allChecked ? true : someChecked ? 'indeterminate' : false

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="parent"
          checked={parentChecked}
          onCheckedChange={(checked) => {
            const newChecked = checked === true
            setItems(items.map((item) => ({ ...item, checked: newChecked })))
          }}
        />
        <Label htmlFor="parent" className="text-sm font-medium cursor-pointer">
          Select all
        </Label>
      </div>
      <div className="ml-6 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={(checked) => {
                setItems(
                  items.map((i) =>
                    i.id === item.id ? { ...i, checked: checked === true } : i
                  )
                )
              }}
            />
            <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
