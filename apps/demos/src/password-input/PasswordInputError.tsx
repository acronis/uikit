import { Input } from '@acronis-platform/shadcn-uikit/react'
import { HideIcon } from '@acronis-platform/shadcn-uikit'
export function PasswordInputError() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="password"
            placeholder="Password"
            className="pr-10 h-12 border-[#EA3939] focus-visible:ring-[#EA3939]"
            aria-invalid="true"
            aria-describedby="pwd-error-1"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EA3939]"
            aria-label="Show password"
          >
            <HideIcon className="h-4 w-4" />
          </button>
        </div>
        <p id="pwd-error-1" className="text-xs font-medium text-[#EA3939] px-0 py-1">
          Error message
        </p>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="password"
            value="••••••••••"
            readOnly
            className="pr-10 h-12 pt-5 pb-1 border-[#EA3939] focus-visible:ring-[#EA3939]"
            aria-invalid="true"
            aria-describedby="pwd-error-2"
          />
          <label className="absolute left-4 top-1 text-xs font-medium text-[rgba(36,49,67,0.7)] pointer-events-none">
            Password
          </label>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EA3939]"
            aria-label="Show password"
          >
            <HideIcon className="h-4 w-4" />
          </button>
        </div>
        <p id="pwd-error-2" className="text-xs font-medium text-[#EA3939] px-0 py-1">
          Error message
        </p>
      </div>
    </div>
  )
}
