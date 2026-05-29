import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputValidationDemo() {
  return (
    <section className="demo-section">
      <h2>Validation States</h2>
      <p className="demo-description">
        Input fields with validation feedback and error messages.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Required Fields</h3>
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
        </div>

        <div className="demo-item">
          <h3>Error State</h3>
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
        </div>
      </div>
    </section>
  )
}
