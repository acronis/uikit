import * as React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Badge } from '@acronis-platform/shadcn-uikit/react'
import { Separator } from '@acronis-platform/shadcn-uikit/react'
import { EditIcon, TrashOIcon } from '@acronis-platform/shadcn-uikit'
import { format } from 'date-fns'
import type { DataRow } from '../../types'

interface DetailViewProps {
  row: DataRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (row: DataRow) => void
  onDelete: (id: string) => void
}

export function DetailView({ row, open, onOpenChange, onEdit, onDelete }: DetailViewProps) {
  if (!row) return null

  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    pending: 'bg-yellow-500',
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>{row.name}</SheetTitle>
          <SheetDescription>
            View and manage data row details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Status</h3>
            <Badge variant="outline" className="capitalize">
              <span className={`mr-2 h-2 w-2 rounded-full ${statusColors[row.status]}`} />
              {row.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium">Category</dt>
                <dd className="text-sm text-muted-foreground">{row.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Value</dt>
                <dd className="text-sm text-muted-foreground">${row.value.toLocaleString()}</dd>
              </div>
              {row.description && (
                <div>
                  <dt className="text-sm font-medium">Description</dt>
                  <dd className="text-sm text-muted-foreground">{row.description}</dd>
                </div>
              )}
              {row.tags && row.tags.length > 0 && (
                <div>
                  <dt className="text-sm font-medium mb-2">Tags</dt>
                  <dd className="flex flex-wrap gap-2">
                    {row.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Metadata</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium">Created</dt>
                <dd className="text-sm text-muted-foreground">
                  {format(row.createdAt, 'PPpp')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium">Last Updated</dt>
                <dd className="text-sm text-muted-foreground">
                  {format(row.updatedAt, 'PPpp')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium">ID</dt>
                <dd className="text-sm text-muted-foreground font-mono">{row.id}</dd>
              </div>
            </dl>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={() => onEdit(row)} className="flex-1">
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(row.id)
                onOpenChange(false)
              }}
              className="flex-1"
            >
              <TrashOIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
