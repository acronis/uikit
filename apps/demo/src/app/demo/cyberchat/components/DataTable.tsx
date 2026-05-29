import { Button } from '@acronis-platform/shadcn-uikit/react'
import { toast } from 'sonner'
import type { TableData } from '../types'
import { copyToClipboard } from '../utils/helpers'

interface DataTableProps {
  data: TableData
}

export function DataTable({ data }: DataTableProps) {
  const handleCopyTable = async () => {
    try {
      // Convert table to plain text format
      const headerRow = data.headers.join('\t')
      const dataRows = data.rows.map((row) =>
        data.headers.map((header) => row[header]).join('\t')
      )
      const tableText = [headerRow, ...dataRows].join('\n')

      await copyToClipboard(tableText)
      toast.success('Table copied to clipboard')
    } catch {
      toast.error('Failed to copy table')
    }
  }

  return (
    <div className="space-y-3">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {data.headers.map((header, i) => (
                <th
                  key={i}
                  className={`text-left p-3 font-semibold ${
                    i === data.headers.length - 1 ? 'text-right' : ''
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr
                key={i}
                className="border-t border-border/50 hover:bg-muted/30 transition-colors"
              >
                {data.headers.map((header, j) => (
                  <td
                    key={j}
                    className={`p-3 ${
                      j === 0
                        ? ''
                        : j === data.headers.length - 1
                        ? 'text-right text-muted-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        variant="link"
        className="h-auto p-0 text-primary"
        onClick={handleCopyTable}
      >
        Copy table
      </Button>
    </div>
  )
}
