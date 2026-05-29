import { useState } from 'react'
import { Input, Button } from '@acronis-platform/shadcn-uikit/react'
import { LockIcon, MailIcon } from '@acronis-platform/shadcn-uikit'
export function InputForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        alert(`Form submitted!\nEmail: ${email}\nPassword: ${password}`)
      }}
    >
      <div className="space-y-2">
        <label htmlFor="form-email" className="text-sm font-medium text-[#243143]">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="form-email"
            className="pl-10"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="form-password" className="text-sm font-medium text-[#243143]">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="form-password"
            className="pl-10"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  )
}
