import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acronis-platform/shadcn-uikit/react'
import { Button, Input, Label } from '@acronis-platform/shadcn-uikit/react'

export function TabsVertical() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4 space-y-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-4 font-semibold">Profile Information</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" placeholder="Tell us about yourself" />
            </div>
            <Button>Update Profile</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="billing" className="mt-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-4 font-semibold">Billing Information</h4>
          <p className="text-sm text-muted-foreground">
            Manage your billing details and payment methods.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="team" className="mt-4">
        <div className="rounded-lg border p-6">
          <h4 className="mb-4 font-semibold">Team Management</h4>
          <p className="text-sm text-muted-foreground">Invite and manage team members.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
