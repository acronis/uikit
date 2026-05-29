import { ColorToken } from '@/types/playground'
import { formatHex, formatCss, oklch } from 'culori'

/**
 * Convert HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  const sDecimal = s / 100
  const lDecimal = l / 100
  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lDecimal - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Convert hex to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return { h: 0, s: 0, l: 0 }
  }

  const r = parseInt(result[1], 16) / 255
  const g = parseInt(result[2], 16) / 255
  const b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sDecimal = s / 100
  const lDecimal = l / 100
  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lDecimal - c / 2
  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

/**
 * Create a color token from HSL values with OKLCH conversion
 */
export function createColorToken(h: number, s: number, l: number): ColorToken {
  const hex = hslToHex(h, s, l)
  const oklchColor = oklch(hex)

  return {
    h,
    s,
    l,
    css: `${h} ${s}% ${l}%`,
    hex,
    oklch: oklchColor
      ? {
          l: Math.round(oklchColor.l * 100) / 100,
          c: Math.round(oklchColor.c * 1000) / 1000,
          h: Math.round((oklchColor.h || 0) * 100) / 100,
          css: formatCss(oklchColor),
        }
      : undefined,
  }
}

/**
 * Parse CSS HSL string to HSL values
 */
export function parseCssHsl(css: string): { h: number; s: number; l: number } | null {
  const match = css.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/)
  if (!match) return null

  return {
    h: parseInt(match[1]),
    s: parseInt(match[2]),
    l: parseInt(match[3]),
  }
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(color1: ColorToken, color2: ColorToken): number {
  const getLuminance = (token: ColorToken) => {
    const rgb = hslToRgb(token.h, token.s, token.l)
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      const v = val / 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Check if color meets WCAG AA contrast requirements
 */
export function meetsWCAGAA(foreground: ColorToken, background: ColorToken): boolean {
  const ratio = getContrastRatio(foreground, background)
  return ratio >= 4.5
}

/**
 * Check if color meets WCAG AAA contrast requirements
 */
export function meetsWCAGAAA(foreground: ColorToken, background: ColorToken): boolean {
  const ratio = getContrastRatio(foreground, background)
  return ratio >= 7
}

/**
 * Create a color token from OKLCH values
 */
export function createColorTokenFromOklch(l: number, c: number, h: number): ColorToken {
  const oklchColor = { mode: 'oklch' as const, l, c, h }
  const hex = formatHex(oklchColor)
  const hslValues = hexToHsl(hex)

  return {
    h: hslValues.h,
    s: hslValues.s,
    l: hslValues.l,
    css: `${hslValues.h} ${hslValues.s}% ${hslValues.l}%`,
    hex,
    oklch: {
      l: Math.round(l * 100) / 100,
      c: Math.round(c * 1000) / 1000,
      h: Math.round(h * 100) / 100,
      css: formatCss(oklchColor),
    },
  }
}
