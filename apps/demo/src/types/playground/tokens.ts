/**
 * Color token with HSL, OKLCH values and CSS/hex representations
 */
export interface ColorToken {
  h: number
  s: number
  l: number
  css: string
  hex: string
  opacity?: number
  oklch?: {
    l: number
    c: number
    h: number
    css: string
  }
}

/**
 * Complete color palette for a theme
 */
export interface ColorPalette {
  [key: string]: ColorToken | undefined;
  background: ColorToken;
  foreground: ColorToken;
  card: ColorToken;
  cardForeground: ColorToken;
  popover: ColorToken;
  popoverForeground: ColorToken;
  primary: ColorToken;
  primaryForeground: ColorToken;
  secondary: ColorToken;
  secondaryForeground: ColorToken;
  muted: ColorToken;
  mutedForeground: ColorToken;
  accent: ColorToken;
  accentForeground: ColorToken;
  destructive: ColorToken;
  destructiveForeground: ColorToken;
  border: ColorToken;
  input: ColorToken;
  ring: ColorToken;
  borderAccent?: ColorToken;
  separator?: ColorToken;
  cardBorder?: ColorToken;
  sidebar?: ColorToken;
  sidebarForeground?: ColorToken;
  sidebarSeparator?: ColorToken;
}

/**
 * Border radius configuration
 */
export interface RadiusConfig {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  full: string
}

/**
 * Typography configuration
 */
export interface TypographyConfig {
  fontFamily: string
  fontFamilyStack: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
}

/**
 * Complete token set with light/dark palettes and radius
 */
export interface TokenSet {
  id: string
  name: string
  description?: string
  light: ColorPalette
  dark: ColorPalette
  radius: RadiusConfig
  typography: TypographyConfig
}

/**
 * Deep partial type for token updates
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
