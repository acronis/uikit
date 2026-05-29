/**
 * Single source of truth for theme color mappings
 * Used by both Tailwind config and runtime CSS variable application
 */

export interface ThemeColorMapping {
  /** CSS variable name */
  cssVar: string
  /** Tailwind color key */
  tailwindKey: string
  /** ColorPalette property name */
  paletteKey: string
}

/**
 * Master color mapping configuration
 * This is the ONLY place where CSS var ↔ Tailwind ↔ Palette mappings are defined
 */
export const THEME_COLOR_MAPPINGS: ThemeColorMapping[] = [
  // Base colors
  {
    cssVar: '--av-background',
    tailwindKey: 'background',
    paletteKey: 'background',
  },
  {
    cssVar: '--av-foreground',
    tailwindKey: 'foreground',
    paletteKey: 'foreground',
  },

  // Card
  {
    cssVar: '--av-card',
    tailwindKey: 'card',
    paletteKey: 'card',
  },
  {
    cssVar: '--av-card-foreground',
    tailwindKey: 'card.foreground',
    paletteKey: 'cardForeground',
  },

  // Popover
  {
    cssVar: '--av-popover',
    tailwindKey: 'popover',
    paletteKey: 'popover',
  },
  {
    cssVar: '--av-popover-foreground',
    tailwindKey: 'popover.foreground',
    paletteKey: 'popoverForeground',
  },

  // Primary
  {
    cssVar: '--av-primary',
    tailwindKey: 'primary',
    paletteKey: 'primary',
  },
  {
    cssVar: '--av-primary-foreground',
    tailwindKey: 'primary.foreground',
    paletteKey: 'primaryForeground',
  },

  // Secondary
  {
    cssVar: '--av-secondary',
    tailwindKey: 'secondary',
    paletteKey: 'secondary',
  },
  {
    cssVar: '--av-secondary-foreground',
    tailwindKey: 'secondary.foreground',
    paletteKey: 'secondaryForeground',
  },

  // Muted
  {
    cssVar: '--av-muted',
    tailwindKey: 'muted',
    paletteKey: 'muted',
  },
  {
    cssVar: '--av-muted-foreground',
    tailwindKey: 'muted.foreground',
    paletteKey: 'mutedForeground',
  },

  // Accent
  {
    cssVar: '--av-accent',
    tailwindKey: 'accent',
    paletteKey: 'accent',
  },
  {
    cssVar: '--av-accent-foreground',
    tailwindKey: 'accent.foreground',
    paletteKey: 'accentForeground',
  },

  // Destructive
  // Note: destructive.DEFAULT is commented out in both places
  // {
  //   cssVar: '--semantic-status-danger-bg',
  //   tailwindKey: 'destructive',
  //   paletteKey: 'destructive'
  // },
  // {
  //   cssVar: '--semantic-status-danger-text',
  //   tailwindKey: 'destructive.foreground',
  //   paletteKey: 'destructiveForeground',
  // },

  // Borders and inputs
  {
    cssVar: '--av-border',
    tailwindKey: 'border',
    paletteKey: 'border',
  },
  {
    cssVar: '--av-input',
    tailwindKey: 'input',
    paletteKey: 'input',
  },
  {
    cssVar: '--av-ring',
    tailwindKey: 'ring',
    paletteKey: 'ring',
  },
];

/**
 * Helper to get CSS var → Palette key mapping for runtime use
 */
export function getCssVarToPaletteMap(): Record<string, string> {
  const map: Record<string, string> = {}
  THEME_COLOR_MAPPINGS.forEach(({ cssVar, paletteKey }) => {
    map[cssVar] = paletteKey
  })
  return map
}

/**
 * Helper to generate Tailwind color config from mappings
 * This can be imported in tailwind.config.js
 */
export function generateTailwindColors() {
  const colors: Record<string, any> = {}

  THEME_COLOR_MAPPINGS.forEach(({ cssVar, tailwindKey }) => {
    const keys = tailwindKey.split('.')

    if (keys.length === 1) {
      // Simple key like 'background'
      colors[keys[0]] = `hsl(var(${cssVar}))`
    } else {
      // Nested key like 'primary.foreground'
      const [parent, child] = keys
      if (!colors[parent]) {
        colors[parent] = {}
      }
      if (child === 'foreground') {
        colors[parent].foreground = `hsl(var(${cssVar}))`
      } else {
        colors[parent][child] = `hsl(var(${cssVar}))`
      }
    }
  })

  return colors
}
