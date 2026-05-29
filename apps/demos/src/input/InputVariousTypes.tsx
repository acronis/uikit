import { Input } from '@acronis-platform/shadcn-uikit/react'
import { CalendarIcon, PhoneIcon, UserIcon } from '@acronis-platform/shadcn-uikit'
import { CreditCardIcon } from '../icons/missing-icons'
export function InputVariousTypes() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Full Name</label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-10" type="text" placeholder="John Doe" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Phone</label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-10" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Credit Card</label>
        <div className="relative">
          <CreditCardIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-10" type="text" placeholder="1234 5678 9012 3456" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#243143]">Date</label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input className="pl-10" type="date" />
        </div>
      </div>
    </div>
  )
}
