export function PasswordInputSpecs() {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <strong className="font-semibold">Height:</strong> 48px (fixed)
      </div>
      <div>
        <strong className="font-semibold">Padding:</strong> 16px horizontal
      </div>
      <div>
        <strong className="font-semibold">Border Radius:</strong> 4px
      </div>
      <div>
        <strong className="font-semibold">Icon Size:</strong> 16×16px
      </div>
      <div>
        <strong className="font-semibold">Border Default:</strong> rgba(38, 104, 197, 0.3)
      </div>
      <div>
        <strong className="font-semibold">Border Error:</strong> #EA3939
      </div>
      <div>
        <strong className="font-semibold">Icon Color:</strong> #2668C5 (default), #EA3939 (error)
      </div>
      <div>
        <strong className="font-semibold">Typography:</strong>
        <ul className="ml-4 mt-1 space-y-1">
          <li>Label: Inter Medium, 12px, 16px line-height</li>
          <li>Value: Inter Regular, 14px, 24px line-height</li>
        </ul>
      </div>
    </div>
  )
}
