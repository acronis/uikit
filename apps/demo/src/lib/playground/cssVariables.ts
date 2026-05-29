import { TokenSet, ThemeMode, ColorPalette } from '@/types/playground/index.ts'
import { getCssVarToPaletteMap } from './themeConfig'

/**
 * Apply token set CSS variables to the document
 */
export function applyTokenSet(tokenSet: TokenSet, theme: ThemeMode): void {
  const root = document.documentElement
  const palette = theme === ThemeMode.DARK ? tokenSet.dark : tokenSet.light

  // Apply theme-specific class to root element
  applyThemeClass(root, tokenSet.id)

  // Apply color variables
  applyColorPalette(root, palette)

  // Apply radius variables
  applyRadiusVariables(root, tokenSet.radius)

  // Apply typography variables
  applyTypographySettings(tokenSet.typography)
}

/**
 * Apply theme-specific class to root element
 */
function applyThemeClass(root: HTMLElement, tokenSetId: string): void {
  // Remove any existing theme-* classes
  const existingThemeClasses = Array.from(root.classList).filter((cls) =>
    cls.startsWith('theme-')
  );
  existingThemeClasses.forEach((className) => root.classList.remove(className));

  // Apply theme class based on token set ID
  // Convert tokenSetId to theme class name (e.g., 'chat' -> 'theme-cyber-chat', 'ocean' -> 'theme-ocean')
  const themeClassName =
    tokenSetId === 'chat' ? 'theme-cyber-chat' : `theme-${tokenSetId}`;
  root.classList.add(themeClassName);
}

/**
 * Apply color palette CSS variables
 * Uses the single source of truth from themeConfig.ts
 */
function applyColorPalette(root: HTMLElement, palette: ColorPalette): void {
  // Get mapping from single source of truth
  const colorMap = getCssVarToPaletteMap()

  Object.entries(colorMap).forEach(([cssVar, paletteKey]) => {
    const colorToken = palette[paletteKey as keyof ColorPalette]
    if (colorToken) {
      root.style.setProperty(cssVar, colorToken.css)
    }
  })
}

/**
 * Apply radius CSS variables
 */
function applyRadiusVariables(root: HTMLElement, radius: TokenSet['radius']): void {
  root.style.setProperty('--av-radius', radius.lg)
  root.style.setProperty('--av-radius-sm', radius.sm)
  root.style.setProperty('--av-radius-md', radius.md)
  root.style.setProperty('--av-radius-lg', radius.lg)
  root.style.setProperty('--av-radius-xl', radius.xl)
  root.style.setProperty('--av-radius-2xl', radius['2xl'])
  root.style.setProperty('--av-radius-full', radius.full)
}

/**
 * Typography settings interface
 */
export interface TypographySettings {
  fontFamily: string
  fontFamilyStack: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
}

/**
 * Apply typography CSS variables
 */
export function applyTypographySettings(settings: TypographySettings): void {
  const root = document.documentElement
  root.style.setProperty('--av-font-sans', settings.fontFamilyStack)
  root.style.setProperty('--av-font-size-base', settings.fontSize)
  root.style.setProperty('--av-line-height-base', settings.lineHeight)
  root.style.setProperty('--av-letter-spacing-base', settings.letterSpacing)
}

/**
 * Remove typography CSS variables
 */
export function removeTypographySettings(): void {
  const root = document.documentElement
  const variablesToRemove = [
    '--av-font-sans',
    '--av-font-size-base',
    '--av-line-height-base',
    '--av-letter-spacing-base',
  ]

  variablesToRemove.forEach((variable) => {
    root.style.removeProperty(variable)
  })
}

/**
 * Remove all playground CSS variables
 */
export function removeTokenSet(): void {
  const root = document.documentElement
  const variablesToRemove = [
    '--av-background',
    '--av-foreground',
    '--av-card',
    '--av-card-foreground',
    '--av-popover',
    '--av-popover-foreground',
    '--av-primary',
    '--av-primary-foreground',
    '--av-secondary',
    '--av-secondary-foreground',
    '--av-muted',
    '--av-muted-foreground',
    '--av-accent',
    '--av-accent-foreground',
    '--av-destructive',
    '--av-destructive-foreground',
    '--av-border',
    '--av-input',
    '--av-ring',
    '--av-radius',
    '--av-radius-sm',
    '--av-radius-md',
    '--av-radius-lg',
    '--av-radius-xl',
    '--av-radius-2xl',
    '--av-radius-full',
  ]

  variablesToRemove.forEach((variable) => {
    root.style.removeProperty(variable)
  })
}

/**
 * Get computed token values from the document
 */
export function getComputedTokenValues(): Record<string, string> {
  const root = document.documentElement
  const computedStyle = getComputedStyle(root)
  const values: Record<string, string> = {}

  const variables = [
    '--av-background',
    '--av-foreground',
    '--av-card',
    '--av-card-foreground',
    '--av-popover',
    '--av-popover-foreground',
    '--av-primary',
    '--av-primary-foreground',
    '--av-secondary',
    '--av-secondary-foreground',
    '--av-muted',
    '--av-muted-foreground',
    '--av-accent',
    '--av-accent-foreground',
    '--av-destructive',
    '--av-destructive-foreground',
    '--av-border',
    '--av-input',
    '--av-ring',
    '--av-radius',
  ]

  variables.forEach((variable) => {
    const value = computedStyle.getPropertyValue(variable).trim()
    if (value) {
      values[variable] = value
    }
  })

  return values
}
