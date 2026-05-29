import { Input } from '@acronis-platform/shadcn-uikit/react'
import { HideIcon } from '@acronis-platform/shadcn-uikit'
export function PasswordInputDisabled() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="password"
            placeholder="Password"
            disabled
            className="pr-10 h-12 bg-[rgba(38,104,197,0.05)]"
          />
          <button
            type="button"
            disabled
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(38,104,197,0.3)] cursor-not-allowed"
            aria-label="Show password"
          >
            <HideIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="password"
            value="••••••••••"
            disabled
            readOnly
            className="pr-10 h-12 pt-5 pb-1 bg-[rgba(38,104,197,0.05)]"
          />
          <label className="absolute left-4 top-1 text-xs font-medium text-[rgba(36,49,67,0.7)] pointer-events-none">
            Password
          </label>
          <button
            type="button"
            disabled
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(38,104,197,0.3)] cursor-not-allowed"
            aria-label="Show password"
          >
            <HideIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs font-medium text-[rgba(36,49,67,0.7)] px-0 py-1">
          Hint message
        </p>
      </div>
    </div>
  )
}
