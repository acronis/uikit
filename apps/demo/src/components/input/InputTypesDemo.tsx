import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputTypesDemo() {
  return (
    <section className="demo-section">
      <h2>Input Types</h2>
      <p className="demo-description">
        Different HTML input types for various data formats.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Various Input Types</h3>
          <div className="space-y-4">
            <Input type="text" placeholder="Text input" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <Input type="number" placeholder="Number input" />
            <Input type="tel" placeholder="Phone input" />
            <Input type="url" placeholder="URL input" />
            <Input type="date" />
          </div>
        </div>
      </div>
    </section>
  )
}
