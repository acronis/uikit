import { Input } from '@acronis-platform/shadcn-uikit/react'
import {
  CalendarIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from '@acronis-platform/shadcn-uikit'
import { CreditCardIcon } from '@/components/icons/missing-icons'
export function InputWithIconsDemo() {
  return (
    <section className="demo-section">
      <h2>Input with Icons</h2>
      <p className="demo-description">
        Input fields with icon decorations for visual context.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Icon Inputs</h3>
          <div className="space-y-4">
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="email" placeholder="Email" />
            </div>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="password" placeholder="Password" />
            </div>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="search" placeholder="Search..." />
            </div>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="text" placeholder="Full Name" />
            </div>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="tel" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="relative">
              <CreditCardIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="text" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input className="pl-10" type="date" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
