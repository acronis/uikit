import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputRequired() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="required-name" className="text-sm font-medium text-[#243143]">
          Name <span className="text-red-500">*</span>
        </label>
        <Input id="required-name" type="text" placeholder="Enter your name" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="required-email" className="text-sm font-medium text-[#243143]">
          Email <span className="text-red-500">*</span>
        </label>
        <Input id="required-email" type="email" placeholder="Enter your email" required />
      </div>
    </div>
  )
}
