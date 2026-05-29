import * as React from 'react'
import { ChevronUpdownIcon, ChevronLeftIcon, ChevronRightIcon } from '@acronis-platform/shadcn-uikit'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@acronis-platform/shadcn-uikit/react'
import { Checkbox } from '@acronis-platform/shadcn-uikit/react'
import { Badge } from '@acronis-platform/shadcn-uikit/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@acronis-platform/shadcn-uikit/react'
import { RowActions } from './RowActions'
import { format } from 'date-fns'
import type { DataRow } from '../../types'

interface DataTableProps {
  data: DataRow[]
  onEdit: (row: DataRow) => void
  onDelete: (id: string) => void
  onView: (row: DataRow) => void
  onBulkDelete: (ids: string[]) => void
  isLoading?: boolean
}

type SortField = keyof DataRow | null
type SortDirection = 'asc' | 'desc'

export function DataTable({ data, onEdit, onDelete, onView, onBulkDelete, isLoading = false }: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortField, setSortField] = React.useState<SortField>('name')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc')
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)

  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      const query = searchQuery.toLowerCase()
      return (
        row.name.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query) ||
        row.description?.toLowerCase().includes(query)
      )
    })
  }, [data, searchQuery])

  const sortedData = React.useMemo(() => {
    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === undefined || bValue === undefined) return 0

      let comparison = 0
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortField, sortDirection])

  const paginatedData = React.useMemo(() => {
    const start = currentPage * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((row) => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedRows))
    setSelectedRows(new Set())
  }

  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    pending: 'bg-yellow-500',
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="border rounded-lg">
          <div className="h-[400px] bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by name, category, or status..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(0)
          }}
          className="max-w-sm"
        />
        {selectedRows.size > 0 && (
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete {selectedRows.size} selected
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(row.id))}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')} className="h-8 px-2">
                  Name
                  <ChevronUpdownIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')} className="h-8 px-2">
                  Status
                  <ChevronUpdownIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('category')} className="h-8 px-2">
                  Category
                  <ChevronUpdownIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('value')} className="h-8 px-2">
                  Value
                  <ChevronUpdownIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('updatedAt')} className="h-8 px-2">
                  Updated
                  <ChevronUpdownIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      <span className={`mr-2 h-2 w-2 rounded-full ${statusColors[row.status]}`} />
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>${row.value.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(row.updatedAt, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      row={row}
                      onEdit={() => onEdit(row)}
                      onDelete={() => onDelete(row.id)}
                      onView={() => onView(row)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(0)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
