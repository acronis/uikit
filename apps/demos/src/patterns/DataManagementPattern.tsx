import * as React from 'react'
import {
  AppShell, AppShellSidebar, AppShellBody, AppShellHeader, AppShellMain,
  PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions,
  PageContent,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Button,
  Badge,
  Input,
  Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious,
} from '@acronis-platform/shadcn-uikit/react'

const devices = [
  { id: 1, name: 'SERVER-01', type: 'Server', os: 'Windows Server 2022', status: 'protected', lastBackup: '2h ago' },
  { id: 2, name: 'WS-042', type: 'Workstation', os: 'Windows 11', status: 'warning', lastBackup: '1d ago' },
  { id: 3, name: 'LAPTOP-007', type: 'Laptop', os: 'macOS 14', status: 'protected', lastBackup: '4h ago' },
  { id: 4, name: 'SERVER-02', type: 'Server', os: 'Ubuntu 22.04', status: 'protected', lastBackup: '30m ago' },
  { id: 5, name: 'WS-103', type: 'Workstation', os: 'Windows 10', status: 'error', lastBackup: '3d ago' },
]

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  protected: 'secondary',
  warning: 'outline',
  error: 'destructive',
}

export function DataManagementPattern() {
  const [search, setSearch] = React.useState('')
  const [page, setPage] = React.useState(1)

  const filtered = devices.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppShell>
      <AppShellSidebar className="w-56 border-r bg-muted/20 p-4 flex-shrink-0">
        <nav className="space-y-1">
          {['Dashboard', 'Devices', 'Backups', 'Alerts', 'Settings'].map((item) => (
            <div key={item} className={`px-3 py-2 rounded-md text-sm cursor-pointer ${item === 'Devices' ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}>
              {item}
            </div>
          ))}
        </nav>
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader>
          <span className="font-semibold">Acronis Cyber Protect</span>
        </AppShellHeader>
        <AppShellMain>
          <PageContent>
            <PageHeader>
              <PageHeaderTitle>Devices</PageHeaderTitle>
              <PageHeaderDescription>Manage and monitor your protected devices.</PageHeaderDescription>
              <PageHeaderActions>
                <Input
                  placeholder="Search devices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48"
                />
                <Button size="sm">Add Device</Button>
              </PageHeaderActions>
            </PageHeader>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Backup</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>{device.type}</TableCell>
                      <TableCell className="text-muted-foreground">{device.os}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[device.status]}>
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{device.lastBackup}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Backup Now</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious size="default" onClick={() => setPage(p => Math.max(1, p - 1))} />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 py-1 text-sm">Page {page} of 3</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext size="default" onClick={() => setPage(p => Math.min(3, p + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </PageContent>
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  )
}
