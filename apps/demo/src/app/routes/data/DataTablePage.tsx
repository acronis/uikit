import * as React from 'react'
import { PlusIcon } from '@acronis-platform/shadcn-uikit'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@acronis-platform/shadcn-uikit/react'
import { DataTable } from './DataTable'
import { NewRowDialog } from './NewRowDialog'
import { DetailView } from './DetailView'
import { useTableData } from '../../hooks/useTableData'
import { useLocale } from '../../context/LocaleContext'
import type { DataRow, DataRowFormData } from '../../types'

export function DataTablePage() {
  const { t } = useLocale()
  const { data, isLoading, addRow, updateRow, deleteRow, deleteRows } = useTableData()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState<DataRow | null>(null)
  const [rowToDelete, setRowToDelete] = React.useState<string | null>(null)
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create')

  const handleCreate = () => {
    setSelectedRow(null)
    setDialogMode('create')
    setDialogOpen(true)
  }

  const handleEdit = (row: DataRow) => {
    setSelectedRow(row)
    setDialogMode('edit')
    setDialogOpen(true)
  }

  const handleView = (row: DataRow) => {
    setSelectedRow(row)
    setDetailOpen(true)
  }

  const handleDelete = (id: string) => {
    setRowToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (rowToDelete) {
      await deleteRow(rowToDelete)
      setRowToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    await deleteRows(ids)
  }

  const handleSubmit = async (formData: DataRowFormData) => {
    if (dialogMode === 'create') {
      await addRow(formData)
    } else if (selectedRow) {
      await updateRow(selectedRow.id, formData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('navigation.data')}</h1>
          <p className="text-muted-foreground">
            {t('messages.noData')}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {t('actions.create')}
        </Button>
      </div>

      <DataTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onBulkDelete={handleBulkDelete}
        isLoading={isLoading}
      />

      <NewRowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        initialData={selectedRow ? {
          name: selectedRow.name,
          status: selectedRow.status,
          category: selectedRow.category,
          value: selectedRow.value,
          description: selectedRow.description,
          tags: selectedRow.tags,
        } : undefined}
        mode={dialogMode}
      />

      <DetailView
        row={selectedRow}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={(row) => {
          setDetailOpen(false)
          handleEdit(row)
        }}
        onDelete={handleDelete}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('messages.deleted')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t('actions.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
