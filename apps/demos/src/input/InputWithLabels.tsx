import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputWithLabels() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[#243143]">
          Email
        </label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-[#243143]">
          Password
        </label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
    </div>
  )
}
