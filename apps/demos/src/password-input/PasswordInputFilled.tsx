import { useState } from 'react'
import { Input } from '@acronis-platform/shadcn-uikit/react'
import { HideIcon, ShowIcon } from '@acronis-platform/shadcn-uikit'
export function PasswordInputFilled() {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('MyP@ssw0rd')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            className="pr-10 h-12 pt-5 pb-1"
          />
          <label className="absolute left-4 top-1 text-xs font-medium text-[rgba(36,49,67,0.7)] pointer-events-none">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2668C5] hover:text-[#1a4d8f] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <ShowIcon className="h-4 w-4" /> : <HideIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
