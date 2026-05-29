import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputError() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="error-email" className="text-sm font-medium text-[#243143]">
          Email
        </label>
        <Input
          id="error-email"
          type="email"
          placeholder="Enter your email"
          className="border-red-500 focus-visible:border-red-500"
        />
        <p className="text-xs text-red-500">Please enter a valid email address</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="error-password" className="text-sm font-medium text-[#243143]">
          Password
        </label>
        <Input
          id="error-password"
          type="password"
          placeholder="Enter your password"
          className="border-red-500 focus-visible:border-red-500"
        />
        <p className="text-xs text-red-500">Password must be at least 8 characters</p>
      </div>
    </div>
  )
}
