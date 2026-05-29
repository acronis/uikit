import * as React from 'react'
import {
  AppShell, AppShellSidebar, AppShellBody, AppShellHeader, AppShellMain,
  PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions,
  DashboardLayout, DashboardGrid,
  Card, CardHeader, CardTitle, CardContent,
  Widget, WidgetHeader, WidgetTitle, WidgetContent,
  Button,
  Badge,
} from '@acronis-platform/shadcn-uikit/react'

const metrics = [
  { title: 'Total Devices', value: '2,847', change: '+12%', trend: 'up' },
  { title: 'Protected', value: '2,431', change: '+8%', trend: 'up' },
  { title: 'Alerts', value: '14', change: '-3', trend: 'down' },
  { title: 'Storage Used', value: '4.2 TB', change: '+0.3 TB', trend: 'up' },
]

const recentAlerts = [
  { id: 1, device: 'SERVER-01', message: 'Backup failed', severity: 'error', time: '2m ago' },
  { id: 2, device: 'WS-042', message: 'License expiring', severity: 'warning', time: '1h ago' },
  { id: 3, device: 'SERVER-02', message: 'Backup completed', severity: 'success', time: '2h ago' },
]

export function DashboardPattern() {
  return (
    <AppShell>
      <AppShellSidebar className="w-56 border-r bg-muted/20 p-4 flex-shrink-0">
        <p className="text-xs font-bold uppercase text-muted-foreground mb-3">Navigation</p>
        <nav className="space-y-1">
          {['Dashboard', 'Devices', 'Backups', 'Alerts', 'Reports', 'Settings'].map((item) => (
            <div key={item} className={`px-3 py-2 rounded-md text-sm cursor-pointer ${item === 'Dashboard' ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}>
              {item}
            </div>
          ))}
        </nav>
      </AppShellSidebar>
      <AppShellBody>
        <AppShellHeader>
          <span className="font-semibold">Acronis Cyber Protect</span>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">Admin</Badge>
            <Button variant="outline" size="sm">Logout</Button>
          </div>
        </AppShellHeader>
        <AppShellMain className="p-6">
          <PageHeader className="mb-6">
            <PageHeaderTitle>Dashboard</PageHeaderTitle>
            <PageHeaderDescription>Overview of your backup and protection status.</PageHeaderDescription>
            <PageHeaderActions>
              <Button variant="outline" size="sm">Export Report</Button>
              <Button size="sm">Run Backup</Button>
            </PageHeaderActions>
          </PageHeader>

          <DashboardLayout>
            <DashboardGrid cols={4}>
              {metrics.map((m) => (
                <Card key={m.title}>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{m.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{m.change} from last month</p>
                  </CardContent>
                </Card>
              ))}
            </DashboardGrid>

            <DashboardGrid cols={2}>
              <Widget size="lg">
                <WidgetHeader>
                  <WidgetTitle>Recent Alerts</WidgetTitle>
                </WidgetHeader>
                <WidgetContent>
                  <div className="space-y-3">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{alert.device}</p>
                          <p className="text-xs text-muted-foreground">{alert.message}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={alert.severity === 'error' ? 'destructive' : alert.severity === 'warning' ? 'outline' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </WidgetContent>
              </Widget>

              <Widget size="lg">
                <WidgetHeader>
                  <WidgetTitle>Protection Summary</WidgetTitle>
                </WidgetHeader>
                <WidgetContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Protected', count: 2431, color: 'bg-green-500' },
                      { label: 'Unprotected', count: 312, color: 'bg-red-500' },
                      { label: 'Issues', count: 104, color: 'bg-yellow-500' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-sm flex-1">{item.label}</span>
                        <span className="text-sm font-medium">{item.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </WidgetContent>
              </Widget>
            </DashboardGrid>
          </DashboardLayout>
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  )
}
