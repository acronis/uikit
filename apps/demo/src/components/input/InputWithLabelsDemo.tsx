import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputWithLabelsDemo() {
  return (
    <section className="demo-section">
      <h2>Input with Labels</h2>
      <p className="demo-description">
        Input fields with associated label elements for better accessibility.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Labeled Inputs</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#243143]">
                Email
              </label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#243143]">
                Password
              </label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-[#243143]">
                Username
              </label>
              <Input id="username" type="text" placeholder="Enter username" />
              <p className="text-xs text-gray-500">Choose a unique username</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
