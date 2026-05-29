import { TokenSet, ColorToken, TypographyConfig } from '@/types/playground'

/**
 * Default typography configuration
 */
const DEFAULT_TYPOGRAPHY: TypographyConfig = {
  fontFamily: 'system-ui',
  fontFamilyStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '16px',
  lineHeight: '1.5',
  letterSpacing: '0',
}

/**
 * Helper to create a color token from HSL values
 */
const createToken = (h: number, s: number, l: number, opacity?: number): ColorToken => ({
  h,
  s,
  l,
  opacity,
  css: `${h} ${s}% ${l}%`,
  hex: hslToHex(h, s, l, opacity),
});

/**
 * Convert HSL to hex color
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @param opacity Optional opacity (0-100)
 * @returns Hex color string with optional alpha channel
 */
function hslToHex(h: number, s: number, l: number, opacity?: number): string {
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

  const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`

  // Add alpha channel if opacity is provided
  if (opacity !== undefined) {
    const alpha = Math.round((opacity / 100) * 255).toString(16)
    return `${hexColor}${alpha.length === 1 ? '0' + alpha : alpha}`
  }

  return hexColor
}

/**
 * Default token set (Shadcn original)
 */
export const DEFAULT_TOKEN_SET: TokenSet = {
  id: 'default',
  name: 'Default',
  description: 'Original Shadcn UI theme',
  light: {
    background: createToken(0, 0, 100),
    foreground: createToken(222.2, 84, 4.9),
    card: createToken(0, 0, 100),
    cardForeground: createToken(222.2, 84, 4.9),
    popover: createToken(0, 0, 100),
    popoverForeground: createToken(222.2, 84, 4.9),
    primary: createToken(222.2, 47.4, 11.2),
    primaryForeground: createToken(210, 40, 98),
    secondary: createToken(210, 40, 96.1),
    secondaryForeground: createToken(222.2, 47.4, 11.2),
    muted: createToken(210, 40, 96.1),
    mutedForeground: createToken(215.4, 16.3, 46.9),
    accent: createToken(210, 40, 96.1),
    accentForeground: createToken(222.2, 47.4, 11.2),
    destructive: createToken(0, 84.2, 60.2),
    destructiveForeground: createToken(210, 40, 98),
    border: createToken(214.3, 31.8, 91.4),
    input: createToken(214.3, 31.8, 91.4),
    ring: createToken(222.2, 84, 4.9),
  },
  dark: {
    background: createToken(222.2, 84, 4.9),
    foreground: createToken(210, 40, 98),
    card: createToken(222.2, 84, 4.9),
    cardForeground: createToken(210, 40, 98),
    popover: createToken(222.2, 84, 4.9),
    popoverForeground: createToken(210, 40, 98),
    primary: createToken(210, 40, 98),
    primaryForeground: createToken(222.2, 47.4, 11.2),
    secondary: createToken(217.2, 32.6, 17.5),
    secondaryForeground: createToken(210, 40, 98),
    muted: createToken(217.2, 32.6, 17.5),
    mutedForeground: createToken(215, 20.2, 65.1),
    accent: createToken(217.2, 32.6, 17.5),
    accentForeground: createToken(210, 40, 98),
    destructive: createToken(0, 62.8, 30.6),
    destructiveForeground: createToken(210, 40, 98),
    border: createToken(217.2, 32.6, 17.5),
    input: createToken(217.2, 32.6, 17.5),
    ring: createToken(212.7, 26.8, 83.9),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Acronis Electric token set
 */
export const ACRONIS_ELECTRIC_TOKEN_SET: TokenSet = {
  id: 'electric',
  name: 'Acronis Electric',
  description: 'Acronis Electric UI theme',
  light: {
    background: createToken(0, 0, 100),
    foreground: createToken(0, 0, 4),
    card: createToken(210, 50, 98),
    cardBorder: createToken(210, 55, 96),
    cardForeground: createToken(0, 0, 4),
    popover: createToken(0, 0, 100),
    popoverForeground: createToken(0, 0, 4),
    primary: createToken(209, 100, 50),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(0, 0, 100),
    secondaryForeground: createToken(0, 0, 52),
    muted: createToken(210, 100, 91),
    mutedForeground: createToken(215, 20.2, 65.1),
    accent: createToken(208, 100, 97),
    accentForeground: createToken(222.2, 47.4, 11.2),
    destructive: createToken(0, 62.8, 30.6),
    destructiveForeground: createToken(210, 40, 98),
    border: createToken(223, 10, 87),
    borderAccent: createToken(209, 100, 50),
    separator: createToken(240, 9, 94),
    input: createToken(223, 10, 87),
    sidebar: createToken(210, 50, 98),
    sidebarForeground: createToken(0, 0, 4),
    sidebarSeparator: createToken(218, 57, 97),
    ring: createToken(212.7, 26.8, 83.9),
  },
  dark: {
    background: createToken(222.2, 84, 4.9),
    foreground: createToken(210, 40, 98),
    card: createToken(222.2, 84, 4.9),
    cardForeground: createToken(210, 40, 98),
    popover: createToken(222.2, 84, 4.9),
    popoverForeground: createToken(210, 40, 98),
    primary: createToken(210, 40, 98),
    primaryForeground: createToken(222.2, 47.4, 11.2),
    secondary: createToken(217.2, 32.6, 17.5),
    secondaryForeground: createToken(210, 40, 98),
    muted: createToken(217.2, 32.6, 17.5),
    mutedForeground: createToken(215, 20.2, 65.1),
    accent: createToken(217.2, 32.6, 17.5),
    accentForeground: createToken(210, 40, 98),
    destructive: createToken(0, 62.8, 30.6),
    destructiveForeground: createToken(210, 40, 98),
    border: createToken(217.2, 32.6, 17.5),
    input: createToken(217.2, 32.6, 17.5),
    ring: createToken(212.7, 26.8, 83.9),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
};

/**
 * Ocean theme (Blue)
 */
export const OCEAN_TOKEN_SET: TokenSet = {
  id: 'ocean',
  name: 'Ocean',
  description: 'Cool blue ocean theme',
  light: {
    background: createToken(210, 100, 98),
    foreground: createToken(210, 80, 10),
    card: createToken(210, 100, 100),
    cardForeground: createToken(210, 80, 10),
    popover: createToken(210, 100, 100),
    popoverForeground: createToken(210, 80, 10),
    primary: createToken(210, 90, 50),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(210, 40, 90),
    secondaryForeground: createToken(210, 80, 20),
    muted: createToken(210, 30, 92),
    mutedForeground: createToken(210, 30, 45),
    accent: createToken(195, 70, 85),
    accentForeground: createToken(210, 80, 20),
    destructive: createToken(0, 84, 60),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(210, 30, 85),
    input: createToken(210, 30, 85),
    ring: createToken(210, 90, 50),
  },
  dark: {
    background: createToken(210, 50, 8),
    foreground: createToken(210, 40, 95),
    card: createToken(210, 50, 10),
    cardForeground: createToken(210, 40, 95),
    popover: createToken(210, 50, 10),
    popoverForeground: createToken(210, 40, 95),
    primary: createToken(210, 80, 60),
    primaryForeground: createToken(210, 80, 10),
    secondary: createToken(210, 30, 20),
    secondaryForeground: createToken(210, 40, 95),
    muted: createToken(210, 30, 20),
    mutedForeground: createToken(210, 20, 60),
    accent: createToken(195, 60, 30),
    accentForeground: createToken(210, 40, 95),
    destructive: createToken(0, 70, 45),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(210, 30, 25),
    input: createToken(210, 30, 25),
    ring: createToken(210, 80, 70),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Forest theme (Green)
 */
export const FOREST_TOKEN_SET: TokenSet = {
  id: 'forest',
  name: 'Forest',
  description: 'Natural green forest theme',
  light: {
    background: createToken(120, 40, 98),
    foreground: createToken(120, 60, 15),
    card: createToken(120, 40, 100),
    cardForeground: createToken(120, 60, 15),
    popover: createToken(120, 40, 100),
    popoverForeground: createToken(120, 60, 15),
    primary: createToken(142, 70, 45),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(120, 30, 90),
    secondaryForeground: createToken(120, 60, 20),
    muted: createToken(120, 25, 92),
    mutedForeground: createToken(120, 25, 45),
    accent: createToken(100, 60, 85),
    accentForeground: createToken(120, 60, 20),
    destructive: createToken(0, 84, 60),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(120, 25, 85),
    input: createToken(120, 25, 85),
    ring: createToken(142, 70, 45),
  },
  dark: {
    background: createToken(120, 40, 8),
    foreground: createToken(120, 30, 95),
    card: createToken(120, 40, 10),
    cardForeground: createToken(120, 30, 95),
    popover: createToken(120, 40, 10),
    popoverForeground: createToken(120, 30, 95),
    primary: createToken(142, 60, 55),
    primaryForeground: createToken(120, 60, 10),
    secondary: createToken(120, 25, 20),
    secondaryForeground: createToken(120, 30, 95),
    muted: createToken(120, 25, 20),
    mutedForeground: createToken(120, 15, 60),
    accent: createToken(100, 50, 30),
    accentForeground: createToken(120, 30, 95),
    destructive: createToken(0, 70, 45),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(120, 25, 25),
    input: createToken(120, 25, 25),
    ring: createToken(142, 60, 65),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Sunset theme (Orange/Red)
 */
export const SUNSET_TOKEN_SET: TokenSet = {
  id: 'sunset',
  name: 'Sunset',
  description: 'Warm sunset orange and red theme',
  light: {
    background: createToken(30, 60, 98),
    foreground: createToken(20, 80, 15),
    card: createToken(30, 60, 100),
    cardForeground: createToken(20, 80, 15),
    popover: createToken(30, 60, 100),
    popoverForeground: createToken(20, 80, 15),
    primary: createToken(25, 90, 55),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(30, 40, 90),
    secondaryForeground: createToken(20, 80, 20),
    muted: createToken(30, 30, 92),
    mutedForeground: createToken(30, 30, 45),
    accent: createToken(15, 80, 85),
    accentForeground: createToken(20, 80, 20),
    destructive: createToken(0, 84, 60),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(30, 30, 85),
    input: createToken(30, 30, 85),
    ring: createToken(25, 90, 55),
  },
  dark: {
    background: createToken(20, 50, 8),
    foreground: createToken(30, 40, 95),
    card: createToken(20, 50, 10),
    cardForeground: createToken(30, 40, 95),
    popover: createToken(20, 50, 10),
    popoverForeground: createToken(30, 40, 95),
    primary: createToken(25, 80, 60),
    primaryForeground: createToken(20, 80, 10),
    secondary: createToken(30, 30, 20),
    secondaryForeground: createToken(30, 40, 95),
    muted: createToken(30, 30, 20),
    mutedForeground: createToken(30, 20, 60),
    accent: createToken(15, 70, 30),
    accentForeground: createToken(30, 40, 95),
    destructive: createToken(0, 70, 45),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(30, 30, 25),
    input: createToken(30, 30, 25),
    ring: createToken(25, 80, 70),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Lavender theme (Purple)
 */
export const LAVENDER_TOKEN_SET: TokenSet = {
  id: 'lavender',
  name: 'Lavender',
  description: 'Elegant purple lavender theme',
  light: {
    background: createToken(270, 50, 98),
    foreground: createToken(270, 70, 15),
    card: createToken(270, 50, 100),
    cardForeground: createToken(270, 70, 15),
    popover: createToken(270, 50, 100),
    popoverForeground: createToken(270, 70, 15),
    primary: createToken(270, 70, 55),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(270, 35, 90),
    secondaryForeground: createToken(270, 70, 20),
    muted: createToken(270, 30, 92),
    mutedForeground: createToken(270, 30, 45),
    accent: createToken(285, 60, 85),
    accentForeground: createToken(270, 70, 20),
    destructive: createToken(0, 84, 60),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(270, 30, 85),
    input: createToken(270, 30, 85),
    ring: createToken(270, 70, 55),
  },
  dark: {
    background: createToken(270, 45, 8),
    foreground: createToken(270, 35, 95),
    card: createToken(270, 45, 10),
    cardForeground: createToken(270, 35, 95),
    popover: createToken(270, 45, 10),
    popoverForeground: createToken(270, 35, 95),
    primary: createToken(270, 65, 60),
    primaryForeground: createToken(270, 70, 10),
    secondary: createToken(270, 28, 20),
    secondaryForeground: createToken(270, 35, 95),
    muted: createToken(270, 28, 20),
    mutedForeground: createToken(270, 18, 60),
    accent: createToken(285, 55, 30),
    accentForeground: createToken(270, 35, 95),
    destructive: createToken(0, 70, 45),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(270, 28, 25),
    input: createToken(270, 28, 25),
    ring: createToken(270, 65, 70),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Monochrome theme (Grayscale)
 */
export const MONOCHROME_TOKEN_SET: TokenSet = {
  id: 'monochrome',
  name: 'Monochrome',
  description: 'Clean grayscale monochrome theme',
  light: {
    background: createToken(0, 0, 100),
    foreground: createToken(0, 0, 10),
    card: createToken(0, 0, 100),
    cardForeground: createToken(0, 0, 10),
    popover: createToken(0, 0, 100),
    popoverForeground: createToken(0, 0, 10),
    primary: createToken(0, 0, 20),
    primaryForeground: createToken(0, 0, 98),
    secondary: createToken(0, 0, 92),
    secondaryForeground: createToken(0, 0, 20),
    muted: createToken(0, 0, 94),
    mutedForeground: createToken(0, 0, 45),
    accent: createToken(0, 0, 88),
    accentForeground: createToken(0, 0, 20),
    destructive: createToken(0, 70, 50),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(0, 0, 88),
    input: createToken(0, 0, 88),
    ring: createToken(0, 0, 20),
  },
  dark: {
    background: createToken(0, 0, 8),
    foreground: createToken(0, 0, 95),
    card: createToken(0, 0, 10),
    cardForeground: createToken(0, 0, 95),
    popover: createToken(0, 0, 10),
    popoverForeground: createToken(0, 0, 95),
    primary: createToken(0, 0, 90),
    primaryForeground: createToken(0, 0, 10),
    secondary: createToken(0, 0, 20),
    secondaryForeground: createToken(0, 0, 95),
    muted: createToken(0, 0, 20),
    mutedForeground: createToken(0, 0, 60),
    accent: createToken(0, 0, 28),
    accentForeground: createToken(0, 0, 95),
    destructive: createToken(0, 60, 40),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(0, 0, 25),
    input: createToken(0, 0, 25),
    ring: createToken(0, 0, 80),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Acronis theme (Cyan/Blue brand colors)
 */
export const ACRONIS_TOKEN_SET: TokenSet = {
  id: 'acronis',
  name: 'Acronis',
  description: 'Official Acronis brand theme',
  light: {
    background: createToken(0, 0, 100),
    foreground: createToken(222, 47, 11),
    card: createToken(0, 0, 100),
    cardForeground: createToken(222, 47, 11),
    popover: createToken(0, 0, 100),
    popoverForeground: createToken(222, 47, 11),
    primary: createToken(218, 68, 46),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(210, 40, 96),
    secondaryForeground: createToken(222, 47, 11),
    muted: createToken(210, 40, 96),
    mutedForeground: createToken(215, 16, 47),
    accent: createToken(218, 68, 46),
    accentForeground: createToken(0, 0, 100),
    destructive: createToken(0, 84, 60),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(214, 32, 91),
    input: createToken(214, 32, 91),
    ring: createToken(189, 100, 42),
  },
  dark: {
    background: createToken(222, 47, 11),
    foreground: createToken(210, 40, 98),
    card: createToken(222, 47, 11),
    cardForeground: createToken(210, 40, 98),
    popover: createToken(222, 47, 11),
    popoverForeground: createToken(210, 40, 98),
    primary: createToken(218, 68, 56),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(217, 33, 18),
    secondaryForeground: createToken(210, 40, 98),
    muted: createToken(217, 33, 18),
    mutedForeground: createToken(215, 20, 65),
    accent: createToken(218, 68, 56),
    accentForeground: createToken(222, 47, 11),
    destructive: createToken(0, 63, 31),
    destructiveForeground: createToken(210, 40, 98),
    border: createToken(217, 33, 18),
    input: createToken(217, 33, 18),
    ring: createToken(189, 100, 50),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * Acronis White Label theme (neutral slate)
 */
export const WHITE_LABEL_TOKEN_SET: TokenSet = {
  id: 'white-label',
  name: 'White Label',
  description: 'Neutral slate white-label theme',
  light: {
    background: createToken(0, 0, 100),
    foreground: createToken(215, 26, 20),
    card: createToken(0, 0, 100),
    cardForeground: createToken(215, 26, 20),
    popover: createToken(0, 0, 100),
    popoverForeground: createToken(215, 26, 20),
    primary: createToken(210, 16, 32),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(0, 0, 100),
    secondaryForeground: createToken(215, 26, 46),
    muted: createToken(240, 6, 97),
    mutedForeground: createToken(215, 26, 46),
    accent: createToken(210, 16, 32),
    accentForeground: createToken(0, 0, 100),
    destructive: createToken(0, 77, 57),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(210, 8, 85),
    input: createToken(210, 8, 85),
    ring: createToken(210, 16, 32),
  },
  dark: {
    background: createToken(215, 26, 20),
    foreground: createToken(0, 0, 100),
    card: createToken(210, 10, 23),
    cardForeground: createToken(0, 0, 100),
    popover: createToken(210, 10, 23),
    popoverForeground: createToken(0, 0, 100),
    primary: createToken(210, 16, 50),
    primaryForeground: createToken(0, 0, 100),
    secondary: createToken(210, 10, 30),
    secondaryForeground: createToken(0, 0, 70),
    muted: createToken(210, 10, 30),
    mutedForeground: createToken(0, 0, 60),
    accent: createToken(210, 16, 50),
    accentForeground: createToken(0, 0, 100),
    destructive: createToken(0, 77, 20),
    destructiveForeground: createToken(0, 0, 100),
    border: createToken(210, 10, 35),
    input: createToken(210, 10, 35),
    ring: createToken(210, 16, 50),
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  typography: DEFAULT_TYPOGRAPHY,
}

/**
 * All predefined token sets
 */
export const PREDEFINED_TOKEN_SETS: Record<string, TokenSet> = {
  acronis: ACRONIS_TOKEN_SET,
  default: DEFAULT_TOKEN_SET,
  'white-label': WHITE_LABEL_TOKEN_SET,
  chat: ACRONIS_ELECTRIC_TOKEN_SET,
  ocean: OCEAN_TOKEN_SET,
  forest: FOREST_TOKEN_SET,
  sunset: SUNSET_TOKEN_SET,
  lavender: LAVENDER_TOKEN_SET,
  monochrome: MONOCHROME_TOKEN_SET,
};
