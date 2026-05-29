import { useState } from 'react'
import { Chip } from '@acronis-platform/shadcn-uikit/react'

export function ChipRemovable() {
  const [chips, setChips] = useState([
    { id: 1, label: 'React' },
    { id: 2, label: 'TypeScript' },
    { id: 3, label: 'Tailwind CSS' },
  ])

  const handleRemoveChip = (id: number) => {
    setChips(chips.filter((chip) => chip.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Chip key={chip.id} onRemove={() => handleRemoveChip(chip.id)}>
            {chip.label}
          </Chip>
        ))}
      </div>
      {chips.length === 0 && <p className="text-sm text-muted-foreground">All chips removed!</p>}
    </div>
  )
}
