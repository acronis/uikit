import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit';
import { Label } from '@acronis-platform/shadcn-uikit/react'

interface User {
  id: number
  name: string
  email: string
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com' },
]

export function ObjectValuesSelect() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user">Select User</Label>
        <Select
          value={selectedUser}
          onValueChange={(user) => setSelectedUser(user as User)}
          isItemEqualToValue={(a, b) => a.id === b.id}
          itemToStringLabel={(user) => user.name}
          itemToStringValue={(user) => user.id.toString()}
        >
          <SelectTrigger id="user" className="w-[280px]">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedUser && (
        <div className="text-sm text-muted-foreground">
          <p>Selected: {selectedUser.name} ({selectedUser.email})</p>
        </div>
      )}
    </div>
  )
}
