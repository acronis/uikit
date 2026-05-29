import React from 'react'

/**
 * Dynamic icon loader using Vite's import.meta.glob
 * Automatically imports all SVG files from the svg directory
 */

// Eager import - loads all icons immediately
const iconModules = import.meta.glob<{
  default: React.ComponentType<React.SVGProps<SVGSVGElement>>
}>('./svg/*.svg?react', { eager: true })

// Lazy import - loads icons on demand (better for large icon sets)
const lazyIconModules = import.meta.glob<{
  default: React.ComponentType<React.SVGProps<SVGSVGElement>>
}>('./svg/*.svg?react')

/**
 * Get icon component by name
 * @example
 * const InfoIcon = getIcon('info')
 * <InfoIcon className="size-4" />
 */
export function getIcon(name: string): React.ComponentType<React.SVGProps<SVGSVGElement>> | null {
  const path = `./svg/${name}.svg?react`
  const module = iconModules[path]
  return module?.default || null
}

/**
 * Get all available icon names
 */
export function getIconNames(): string[] {
  return Object.keys(iconModules)
    .map((path) => {
      const match = path.match(/\.\/svg\/(.+)\.svg\?react/)
      return match ? match[1] : ''
    })
    .filter(Boolean)
}

/**
 * Dynamic Icon component that loads icons by name
 */
interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: string
  className?: string
}

export function DynamicIcon({ name, className = 'size-4', ...props }: DynamicIconProps) {
  const IconComponent = getIcon(name)

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return <IconComponent className={className} {...props} />
}

/**
 * Lazy loading icon component
 */
export function LazyIcon({ name, className = 'size-4', ...props }: DynamicIconProps) {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<
    React.SVGProps<SVGSVGElement>
  > | null>(null)

  React.useEffect(() => {
    const path = `./svg/${name}.svg?react`
    const loader = lazyIconModules[path]

    if (loader) {
      loader().then((module) => {
        setIconComponent(() => module.default)
      })
    }
  }, [name])

  if (!IconComponent) {
    return <div className={className} /> // Placeholder
  }

  return <IconComponent className={className} {...props} />
}

/**
 * Export all icons as a map for easy access
 */
export const Icons = Object.entries(iconModules).reduce(
  (acc, [path, module]) => {
    const match = path.match(/\.\/svg\/(.+)\.svg\?react/)
    if (match) {
      const name = match[1]
      acc[name] = module.default
    }
    return acc
  },
  {} as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>
)
