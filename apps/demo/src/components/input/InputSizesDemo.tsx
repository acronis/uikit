import { Input } from '@acronis-platform/shadcn-uikit/react'

export function InputSizesDemo() {
  return (
    <section className="demo-section">
      <h2>Different Sizes</h2>
      <p className="demo-description">
        Input fields in various sizes for different use cases.
      </p>

      <div className="demo-grid">
        <div className="demo-item">
          <h3>Size Variants</h3>
          <div className="space-y-4">
            <Input className="h-10 text-sm" placeholder="Small input (40px)" />
            <Input placeholder="Default input (48px)" />
            <Input className="h-14 text-base" placeholder="Large input (56px)" />
          </div>
        </div>
      </div>
    </section>
  )
}
