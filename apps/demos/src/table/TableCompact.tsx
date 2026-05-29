import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@acronis-platform/shadcn-uikit/react'

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active' },
]

export function TableCompact() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 px-2">ID</TableHead>
            <TableHead className="h-8 px-2">Name</TableHead>
            <TableHead className="h-8 px-2">Email</TableHead>
            <TableHead className="h-8 px-2">Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="px-2 py-2">{user.id}</TableCell>
              <TableCell className="px-2 py-2">{user.name}</TableCell>
              <TableCell className="px-2 py-2">{user.email}</TableCell>
              <TableCell className="px-2 py-2">{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
