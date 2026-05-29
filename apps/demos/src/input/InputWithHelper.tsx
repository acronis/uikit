import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputWithHelper() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-[#243143]">
          Username
        </label>
        <Input id="username" type="text" placeholder="Enter username" />
        <p className="text-xs text-gray-500">Choose a unique username</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-[#243143]">
          Phone Number
        </label>
        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
        <p className="text-xs text-gray-500">Include country code</p>
      </div>
    </div>
  )
}
