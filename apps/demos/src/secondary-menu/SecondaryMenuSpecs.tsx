export function SecondaryMenuSpecs() {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <strong className="font-semibold">Width:</strong> 240px (fixed)
      </div>
      <div>
        <strong className="font-semibold">Padding:</strong> 24px horizontal, 12px vertical
      </div>
      <div>
        <strong className="font-semibold">Title Padding:</strong> 24px horizontal, 16px top, 8px
        bottom
      </div>
      <div>
        <strong className="font-semibold">Gap:</strong> 16px between icon and text
      </div>
      <div>
        <strong className="font-semibold">Icon Size:</strong> 16×16px
      </div>
      <div>
        <strong className="font-semibold">Active Background:</strong> rgba(38, 104, 197, 0.05)
      </div>
      <div>
        <strong className="font-semibold">Divider:</strong> rgba(38, 104, 197, 0.1)
      </div>
      <div>
        <strong className="font-semibold">Typography:</strong>
        <ul className="ml-4 mt-1 space-y-1">
          <li>Menu Item: Inter Semi Bold, 14px, 24px line-height</li>
          <li>Title: Inter Bold, 11px, 16px line-height, uppercase</li>
        </ul>
      </div>
      <div>
        <strong className="font-semibold">Colors:</strong>
        <ul className="ml-4 mt-1 space-y-1">
          <li>Default: #2668C5 (Technical/fixed-link)</li>
          <li>Active: #243143 (Text/fixed-primary)</li>
          <li>Disabled: rgba(36, 49, 67, 0.7)</li>
        </ul>
      </div>
    </div>
  )
}
