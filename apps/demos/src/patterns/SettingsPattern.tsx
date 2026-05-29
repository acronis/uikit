import * as React from 'react'
import {
  AppShell, AppShellSidebar, AppShellBody, AppShellHeader, AppShellMain,
  PageHeader, PageHeaderTitle, PageHeaderDescription,
  Section, SectionHeader, SectionTitle, SectionDescription, SectionContent,
  PageContent,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Card, CardContent,
  Button,
  Input,
  Label,
  Switch,
} from '@acronis-platform/shadcn-uikit/react'

export function SettingsPattern() {
  const [notifications, setNotifications] = React.useState(true)
  const [marketing, setMarketing] = React.useState(false)

  return (
    <AppShell>
      <AppShellSidebar className="w-56 border-r bg-muted/20 p-4 flex-shrink-0">
        <nav className="space-y-1">
          {['Dashboard', 'Devices', 'Backups', 'Alerts', 'Reports', 'Settings'].map((item) => (
            <div key={item} className={`px-3 py-2 rounded-md text-sm cursor-pointer ${item === 'Settings' ? 'bg-accent font-medium' : 'hover:bg-accent/50'}`}>
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
              <PageHeaderTitle>Settings</PageHeaderTitle>
              <PageHeaderDescription>Manage your account preferences and configuration.</PageHeaderDescription>
            </PageHeader>

            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Section>
                  <SectionHeader>
                    <SectionTitle>Personal Information</SectionTitle>
                    <SectionDescription>Update your name and email address.</SectionDescription>
                  </SectionHeader>
                  <SectionContent>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="john.doe@company.com" />
                        </div>
                        <Button>Save Changes</Button>
                      </CardContent>
                    </Card>
                  </SectionContent>
                </Section>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <Section>
                  <SectionHeader>
                    <SectionTitle>Email Notifications</SectionTitle>
                    <SectionDescription>Choose which emails you want to receive.</SectionDescription>
                  </SectionHeader>
                  <SectionContent>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Backup alerts</p>
                            <p className="text-xs text-muted-foreground">Get notified when backups complete or fail.</p>
                          </div>
                          <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Marketing emails</p>
                            <p className="text-xs text-muted-foreground">News and product updates.</p>
                          </div>
                          <Switch checked={marketing} onCheckedChange={setMarketing} />
                        </div>
                        <Button>Save Preferences</Button>
                      </CardContent>
                    </Card>
                  </SectionContent>
                </Section>
              </TabsContent>

              <TabsContent value="security" className="mt-6">
                <Section>
                  <SectionHeader>
                    <SectionTitle>Change Password</SectionTitle>
                    <SectionDescription>Update your password to keep your account secure.</SectionDescription>
                  </SectionHeader>
                  <SectionContent>
                    <Card>
                      <CardContent className="pt-6 space-y-4 max-w-md">
                        <div className="space-y-2">
                          <Label htmlFor="current">Current password</Label>
                          <Input id="current" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new">New password</Label>
                          <Input id="new" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm">Confirm new password</Label>
                          <Input id="confirm" type="password" />
                        </div>
                        <Button>Update Password</Button>
                      </CardContent>
                    </Card>
                  </SectionContent>
                </Section>
              </TabsContent>
            </Tabs>
          </PageContent>
        </AppShellMain>
      </AppShellBody>
    </AppShell>
  )
}
