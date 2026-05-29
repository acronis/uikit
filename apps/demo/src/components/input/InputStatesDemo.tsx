import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputStatesDemo() {
  return (
    <section className="demo-section">
      <h2>Disabled State</h2>
      <p className="demo-description">
        Input fields in disabled state that cannot be interacted with.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Disabled Inputs</h3>
          <div className="space-y-4">
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Disabled with value" defaultValue="Cannot edit this" disabled />
          </div>
        </div>
      </div>
    </section>
  )
}
