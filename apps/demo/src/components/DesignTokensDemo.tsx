import * as React from 'react'

export function DesignTokensDemo() {
    const colorVariables = [
      {
        name: '--av-background',
        description: 'Background color',
        category: 'Base',
      },
      {
        name: '--av-foreground',
        description: 'Foreground/text color',
        category: 'Base',
      },
      {
        name: '--av-primary',
        description: 'Primary button color (#2668C5)',
        category: 'Primary',
      },
      {
        name: '--av-primary-foreground',
        description: 'Primary button text',
        category: 'Primary',
      },
      {
        name: '--av-secondary',
        description: 'Secondary button background',
        category: 'Secondary',
      },
      {
        name: '--av-secondary-foreground',
        description: 'Secondary button text',
        category: 'Secondary',
      },
      {
        name: '--av-muted',
        description: 'Muted/subtle backgrounds',
        category: 'Muted',
      },
      {
        name: '--av-muted-foreground',
        description: 'Muted/subtle text',
        category: 'Muted',
      },
      {
        name: '--av-destructive',
        description: 'Danger/destructive color (#EA3939)',
        category: 'Action',
      },
      {
        name: '--av-destructive-foreground',
        description: 'Destructive text',
        category: 'Action',
      },
      {
        name: '--av-success',
        description: 'Success color (#9BC225)',
        category: 'Status',
      },
      {
        name: '--av-warning',
        description: 'Warning color (#FFC107)',
        category: 'Status',
      },
      {
        name: '--av-status-neutral',
        description: 'Neutral color',
        category: 'Status',
      },
      {
        name: '--av-info',
        description: 'Info color (#408BEA)',
        category: 'Status',
      },
      {
        name: '--av-critical',
        description: 'Critical color (#FF810D)',
        category: 'Status',
      },
      {
        name: '--av-danger',
        description: 'Danger color',
        category: 'Status',
      },
      { name: '--av-border', description: 'Border color', category: 'Border' },
      {
        name: '--av-input',
        description: 'Input border color',
        category: 'Border',
      },
      {
        name: '--av-ring',
        description: 'Focus ring color',
        category: 'Border',
      },
    ];

    // const componentVariables = [
    //     {name: '--badge-success-bg', description: 'Success badge background', category: 'Badge'},
    //     {name: '--badge-info-bg', description: 'Info badge background', category: 'Badge'},
    //     {name: '--badge-warning-bg', description: 'Warning badge background', category: 'Badge'},
    //     {name: '--badge-critical-bg', description: 'Critical badge background', category: 'Badge'},
    //     {name: '--badge-danger-bg', description: 'Danger badge background', category: 'Badge'},
    //     {name: '--badge-neutral-bg', description: 'Neutral badge background', category: 'Badge'},
    //     {name: '--checkbox-bg', description: 'Checkbox background', category: 'Checkbox'},
    //     {
    //         name: '--checkbox-checked-bg',
    //         description: 'Checked checkbox background',
    //         category: 'Checkbox',
    //     },
    //     {name: '--checkbox-border', description: 'Checkbox border', category: 'Checkbox'},
    //     {name: '--table-border', description: 'Table border', category: 'Table'},
    //     {name: '--table-row-hover', description: 'Table row hover', category: 'Table'},
    //     {name: '--table-row-selected', description: 'Table row selected', category: 'Table'},
    //     {name: '--toast-bg', description: 'Toast background', category: 'Toast'},
    //     {name: '--toast-info-bg', description: 'Info toast background', category: 'Toast'},
    //     {name: '--toast-success-bg', description: 'Success toast background', category: 'Toast'},
    //     {name: '--toast-warning-bg', description: 'Warning toast background', category: 'Toast'},
    //     {name: '--toast-danger-bg', description: 'Danger toast background', category: 'Toast'},
    //     {name: '--spinner-color', description: 'Spinner color', category: 'Spinner'},
    //     {name: '--tree-text', description: 'Tree item text', category: 'Tree'},
    //     {name: '--tree-item-hover', description: 'Tree item hover', category: 'Tree'},
    //     {name: '--tree-item-selected', description: 'Tree item selected', category: 'Tree'},
    //     {name: '--tree-icon', description: 'Tree expand icon', category: 'Tree'},
    // ]

    const spacingVariables = [
        {name: '--av-radius', description: 'Border radius (4px)', value: '0.25rem'},
        {name: '--table-cell-padding-x', description: 'Table cell horizontal padding', value: '24px'},
        {name: '--table-row-height', description: 'Table row height', value: '48px'},
        {name: '--tree-indent', description: 'Tree indent per level', value: '32px'},
    ]

    const groupByCategory = (items: typeof colorVariables) => {
        return items.reduce(
            (acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = []
                }
                acc[item.category].push(item)
                return acc
            },
            {} as Record<string, typeof items>
        )
    }

    const colorGroups = groupByCategory(colorVariables)
    // const componentGroups = groupByCategory(componentVariables)

    return (
      <section className="demo-section">
        <h2>Design Tokens</h2>
        <p className="demo-description">
          Visual reference for all CSS custom properties (variables) used in the
          design system.
        </p>

        <div className="space-y-12">
          {/* Color Variables */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Color Variables</h3>
            {Object.entries(colorGroups).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  {category}
                </h4>
                <div className="grid gap-4">
                  {items.map((variable) => (
                    <div
                      key={variable.name}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-16 h-16 rounded-md border-2 border-gray-300 shrink-0"
                        style={{
                          backgroundColor: `hsl(var(${variable.name}))`,
                        }}
                      />
                      <div className="flex-1">
                        <code className="text-sm font-mono text-blue-600 font-semibold">
                          {variable.name}
                        </code>
                        <p className="text-sm text-gray-600 mt-1">
                          {variable.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xs font-mono text-gray-500 px-3 py-1 bg-gray-100 rounded"
                          style={{
                            backgroundColor: `hsl(var(${variable.name}))`,
                            color: variable.name.includes('foreground')
                              ? 'inherit'
                              : undefined,
                          }}
                        >
                          Preview
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Component Variables */}
          {/*<div>*/}
          {/*    <h3 className="text-2xl font-semibold mb-6">Component Variables</h3>*/}
          {/*    {Object.entries(componentGroups).map(([category, items]) => (*/}
          {/*        <div key={category} className="mb-8">*/}
          {/*            <h4 className="text-lg font-medium mb-4 text-gray-700">{category}</h4>*/}
          {/*            <div className="grid gap-4">*/}
          {/*                {items.map((variable) => (*/}
          {/*                    <div*/}
          {/*                        key={variable.name}*/}
          {/*                        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"*/}
          {/*                    >*/}
          {/*                        <div*/}
          {/*                            className="w-16 h-16 rounded-md border-2 border-gray-300 shrink-0"*/}
          {/*                            style={{*/}
          {/*                                backgroundColor: variable.name.includes('border')*/}
          {/*                                    ? `hsl(var(${variable.name})/0.3)`*/}
          {/*                                    : variable.name.includes('hover')*/}
          {/*                                        ? `hsl(var(${variable.name})/0.05)`*/}
          {/*                                        : variable.name.includes('selected')*/}
          {/*                                            ? `hsl(var(${variable.name})/0.1)`*/}
          {/*                                            : `hsl(var(${variable.name}))`,*/}
          {/*                            }}*/}
          {/*                        />*/}
          {/*                        <div className="flex-1">*/}
          {/*                            <code className="text-sm font-mono text-blue-600 font-semibold">*/}
          {/*                                {variable.name}*/}
          {/*                            </code>*/}
          {/*                            <p className="text-sm text-gray-600 mt-1">{variable.description}</p>*/}
          {/*                        </div>*/}
          {/*                    </div>*/}
          {/*                ))}*/}
          {/*            </div>*/}
          {/*        </div>*/}
          {/*    ))}*/}
          {/*</div>*/}

          {/* Spacing Variables */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Spacing & Size Variables
            </h3>
            <div className="grid gap-4">
              {spacingVariables.map((variable) => (
                <div
                  key={variable.name}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <code className="text-sm font-mono text-blue-600 font-semibold">
                      {variable.name}
                    </code>
                    <p className="text-sm text-gray-600 mt-1">
                      {variable.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <code className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded">
                      {variable.value}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">Interactive classes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                '--av-interactive-default',
                '--av-interactive-hover',
                '--av-interactive-active',
                '--av-interactive-disabled',
              ].map((className) => (
                <div key={className} className="border rounded-lg p-4">
                  <div
                    className={`w-full h-16 rounded bg-[hsl(var(${className}))]  mb-2`}
                  />
                  <code className="text-xs font-mono text-gray-600">
                    {className}
                  </code>
                </div>
              ))}
            </div>
          </div>

          {/* Tailwind Utility Classes */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Tailwind Utility Classes
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Background Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'bg-background',
                    'bg-foreground',
                    'bg-primary',
                    'bg-primary-foreground',
                    'bg-secondary',
                    'bg-secondary-foreground',
                    'bg-destructive',
                    'bg-destructive-foreground',
                    'bg-success',
                    'bg-success-foreground',
                    'bg-warning',
                    'bg-info',
                    'bg-critical',
                    'bg-muted',
                    'bg-accent',
                  ].map((className) => (
                    <div key={className} className="border rounded-lg p-4">
                      <div
                        className={`w-full h-16 rounded ${className} mb-2`}
                      />
                      <code className="text-xs font-mono text-gray-600">
                        {className}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Text Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'text-foreground',
                    'text-primary',
                    'text-secondary',
                    'text-destructive',
                    'text-muted-foreground',
                  ].map((className) => (
                    <div key={className} className="border rounded-lg p-4">
                      <p className={`text-2xl font-bold ${className} mb-2`}>
                        Aa
                      </p>
                      <code className="text-xs font-mono text-gray-600">
                        {className}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Border Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'border-border',
                    'border-input',
                    'border-primary',
                    'border-destructive',
                    'border-success',
                  ].map((className) => (
                    <div key={className} className="border rounded-lg p-4">
                      <div
                        className={`w-full h-16 rounded border-4 ${className} mb-2`}
                      />
                      <code className="text-xs font-mono text-gray-600">
                        {className}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Border Radius
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    'rounded-none',
                    'rounded-sm',
                    'rounded',
                    'rounded-md',
                    'rounded-lg',
                    'rounded-full',
                  ].map((className) => (
                    <div key={className} className="border rounded-lg p-4">
                      <div
                        className={`w-full h-16 bg-primary ${className} mb-2`}
                      />
                      <code className="text-xs font-mono text-gray-600">
                        {className}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Spacing
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {['p-2', 'p-4', 'p-6', 'p-8', 'm-2', 'm-4', 'm-6', 'm-8'].map(
                    (className) => (
                      <div key={className} className="border rounded-lg p-4">
                        <div className="bg-gray-100 inline-block">
                          <div className={`bg-primary ${className}`}>
                            <div className="w-8 h-8" />
                          </div>
                        </div>
                        <code className="text-xs font-mono text-gray-600 block mt-2">
                          {className}
                        </code>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gradient Borders */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Gradient Borders</h3>
            <p className="text-gray-600 mb-6">
              CSS doesn&apos;t directly support gradients on borders, but here
              are several techniques to achieve gradient border effects with
              Tailwind CSS.
            </p>
            <div className="space-y-8">
              {/* Double Container Method */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Double Container Method (Recommended)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Uses a gradient background on an outer container with padding
                  to simulate a border. Works with border-radius.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blue to Purple */}
                  <div className="p-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <div className="bg-background rounded-lg p-6">
                      <h5 className="font-semibold mb-2">Blue to Purple</h5>
                      <p className="text-sm text-muted-foreground">
                        Horizontal gradient border
                      </p>
                    </div>
                  </div>

                  {/* Primary to Success */}
                  <div className="p-[3px] bg-gradient-to-br from-primary via-info to-success rounded-xl">
                    <div className="bg-background rounded-xl p-6">
                      <h5 className="font-semibold mb-2">
                        Multi-color Diagonal
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        Diagonal gradient with multiple colors
                      </p>
                    </div>
                  </div>

                  {/* Animated Gradient */}
                  <div className="p-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg animate-pulse">
                    <div className="bg-background rounded-lg p-6">
                      <h5 className="font-semibold mb-2">Animated Gradient</h5>
                      <p className="text-sm text-muted-foreground">
                        Pulsing gradient effect
                      </p>
                    </div>
                  </div>

                  {/* Thick Border */}
                  <div className="p-1 bg-gradient-to-r from-destructive to-warning rounded-lg">
                    <div className="bg-background rounded-lg p-6">
                      <h5 className="font-semibold mb-2">Thick Border</h5>
                      <p className="text-sm text-muted-foreground">
                        Thicker gradient border (4px)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-xs">
                    <code>{`<div className="p-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
  <div className="bg-background rounded-lg p-6">
    Content
  </div>
</div>`}</code>
                  </pre>
                </div>
              </div>

              {/* Border Image Method */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Border Image Method (No Border Radius)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Uses CSS border-image property. Note: Does not work with
                  border-radius.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-8 [border-image:linear-gradient(to_right,#3b82f6,#8b5cf6)_1] p-6">
                    <h5 className="font-semibold mb-2">Horizontal Gradient</h5>
                    <p className="text-sm text-muted-foreground">
                      Left to right gradient
                    </p>
                  </div>

                  <div className="border-8 [border-image:linear-gradient(45deg,#ef4444,#f59e0b,#10b981,#3b82f6)_1] p-6">
                    <h5 className="font-semibold mb-2">Rainbow Gradient</h5>
                    <p className="text-sm text-muted-foreground">
                      Multi-color diagonal gradient
                    </p>
                  </div>
                </div>

                <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                  <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-xs">
                    <code>{`<div className="border-8 [border-image:linear-gradient(to_right,#3b82f6,#8b5cf6)_1] p-6">
  Content
</div>`}</code>
                  </pre>
                </div>
              </div>

              {/* Card Examples */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Practical Card Examples
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature Card */}
                  <div className="p-[1px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg">
                    <div className="bg-background rounded-xl p-6 h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <h5 className="font-semibold mb-2">Feature Card</h5>
                      <p className="text-sm text-muted-foreground">
                        Elegant gradient border for highlighting features
                      </p>
                    </div>
                  </div>

                  {/* Premium Card */}
                  <div className="p-[2px] bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-xl shadow-lg">
                    <div className="bg-background rounded-xl p-6 h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center text-white font-bold">
                        ★
                      </div>
                      <h5 className="font-semibold mb-2">Premium Card</h5>
                      <p className="text-sm text-muted-foreground">
                        Eye-catching gradient for premium content
                      </p>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="p-[1px] bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl shadow-lg">
                    <div className="bg-background rounded-xl p-6 h-full">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg mb-4 flex items-center justify-center text-white font-bold">
                        ✓
                      </div>
                      <h5 className="font-semibold mb-2">Success Card</h5>
                      <p className="text-sm text-muted-foreground">
                        Success state with gradient border
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Button Examples */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-gray-700">
                  Gradient Border Buttons
                </h4>
                <div className="flex flex-wrap gap-4">
                  <div className="p-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:shadow-lg transition-shadow">
                    <button className="bg-background hover:bg-accent px-6 py-2 rounded-[4px] font-medium transition-colors">
                      Gradient Button
                    </button>
                  </div>

                  <div className="p-[2px] bg-gradient-to-r from-pink-500 to-rose-500 rounded-full hover:shadow-lg transition-shadow">
                    <button className="bg-background hover:bg-accent px-6 py-2 rounded-full font-medium transition-colors">
                      Rounded Gradient
                    </button>
                  </div>

                  <div className="p-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md hover:shadow-lg transition-shadow">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-[4px] font-medium">
                      Filled Gradient
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div>
            <h3 className="text-2xl font-semibold mb-6">Usage Examples</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-6 bg-gray-50">
                <h4 className="font-medium mb-2">CSS Variable Usage</h4>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
                  <code>{`/* In CSS */
.my-component {
  background-color: hsl(var(--av-primary));
  color: hsl(var(--av-primary-foreground));
  border: 1px solid hsl(var(--av-border));
}

/* With opacity */
.my-component-hover {
  background-color: hsl(var(--av-primary) / 0.1);
}`}</code>
                </pre>
              </div>

              <div className="border rounded-lg p-6 bg-gray-50">
                <h4 className="font-medium mb-2">Tailwind Class Usage</h4>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
                  <code>{`/* In JSX/TSX */
<div className="bg-primary text-primary-foreground p-4 rounded-md">
  Primary Button
</div>

<div className="bg-destructive/10 text-destructive border border-destructive">
  Danger Alert
</div>`}</code>
                </pre>
              </div>

              <div className="border rounded-lg p-6 bg-gray-50">
                <h4 className="font-medium mb-2">Inline Style Usage</h4>
                <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto">
                  <code>{`/* In React */
<div style={{
  backgroundColor: 'hsl(var(--av-primary))',
  color: 'hsl(var(--av-primary-foreground))',
  padding: '16px',
  borderRadius: '4px'
}}>
  Custom Component
</div>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
