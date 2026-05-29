/**
 * Icon generation script.
 *
 * Scans the svg/ directory, groups base icons with their size variants,
 * and generates auto-generated.tsx with size-aware React components.
 *
 * SVG files use the naming convention: {name}--{size}.svg
 * (e.g. user--16.svg, user--24.svg, user--32.svg)
 *
 * For icons with multiple sizes, a component with a `size` prop is generated.
 * The largest available size is used as the default.
 *
 * Run with: pnpm --filter ./packages/legacy/ui run generate:icons
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ICONS_DIR = path.resolve(__dirname, '../src/components/icons')
const SVG_DIR = path.resolve(ICONS_DIR, 'svg')
const OUTPUT_FILE = path.resolve(ICONS_DIR, 'auto-generated.tsx')
const CATEGORIES_FILE = path.resolve(ICONS_DIR, 'categories.json')

/** Valid icon sizes used in the design system */
const VALID_SIZES = new Set([16, 24, 32, 48, 72, 96])

// ─── Types ──────────────────────────────────────────────────────────

interface SizeVariant {
  size: number
  file: string
}

interface IconGroup {
  baseName: string
  /** The SVG file used as default (largest size) */
  defaultFile: string
  defaultSize: number
  /** Additional size variants (excludes the default) */
  variants: SizeVariant[]
}

// ─── Helpers ────────────────────────────────────────────────────────

function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * Parse an SVG filename like "user--16.svg" into base name and size.
 * Returns null if the filename doesn't match the expected pattern.
 */
function parseSvgFilename(filename: string): { baseName: string; size: number } | null {
  const match = filename.match(/^(.+)--(\d+)\.svg$/)
  if (match) {
    const size = parseInt(match[2], 10)
    if (VALID_SIZES.has(size)) {
      return { baseName: match[1], size }
    }
  }
  return null
}

/** Read the viewBox width from an SVG file. */
function getSvgSize(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const match = content.match(/viewBox=["']0\s+0\s+(\d+)\s+(\d+)["']/)
    if (match) return parseInt(match[1], 10)
  } catch {
    /* ignore */
  }
  return 16
}

// ─── Build icon groups from svg/ directory ──────────────────────────

function buildIconGroups(): IconGroup[] {
  const svgFiles = fs
    .readdirSync(SVG_DIR)
    .filter((f) => f.endsWith('.svg'))
    .sort()

  // Group files by base name
  const grouped = new Map<string, SizeVariant[]>()

  for (const file of svgFiles) {
    const parsed = parseSvgFilename(file)
    if (parsed) {
      if (!grouped.has(parsed.baseName)) grouped.set(parsed.baseName, [])
      grouped.get(parsed.baseName)!.push({ size: parsed.size, file })
    } else {
      // File doesn't match --{size} pattern, treat as standalone icon
      const name = file.replace(/\.svg$/, '')
      const size = getSvgSize(path.join(SVG_DIR, file))
      if (!grouped.has(name)) grouped.set(name, [])
      grouped.get(name)!.push({ size, file })
    }
  }

  // Build groups: largest size becomes default, rest are variants
  const groups: IconGroup[] = []

  for (const [baseName, allVariants] of grouped) {
    const sorted = [...allVariants].sort((a, b) => b.size - a.size) // largest first
    const defaultVariant = sorted[0]

    groups.push({
      baseName,
      defaultFile: defaultVariant.file,
      defaultSize: defaultVariant.size,
      variants: sorted.slice(1).sort((a, b) => a.size - b.size), // ascending for switch
    })
  }

  return groups.sort((a, b) => a.baseName.localeCompare(b.baseName))
}

// ─── Generate auto-generated.tsx ────────────────────────────────────

function generateTsx(groups: IconGroup[]): void {
  const L: string[] = []

  L.push(`/**`)
  L.push(` * Auto-generated icon components`)
  L.push(` * Generated on: ${new Date().toISOString()}`)
  L.push(` * Do not edit manually - run 'npm run generate:icons' to regenerate`)
  L.push(` */`)
  L.push(``)
  L.push(`import React from 'react'`)
  L.push(`import { BaseIcon } from './base-icon'`)
  L.push(``)

  // SVG imports
  L.push(`// Import all SVG icons`)
  for (const group of groups) {
    const bp = toPascalCase(group.baseName)
    L.push(`import ${bp}Svg from './svg/${group.defaultFile}?react'`)
    for (const v of group.variants) {
      const vp = toPascalCase(group.baseName) + v.size
      L.push(`import ${vp}Svg from './svg/${v.file}?react'`)
    }
  }
  L.push(``)

  // Types
  L.push(`interface IconProps extends React.SVGProps<SVGSVGElement> {`)
  L.push(`  className?: string`)
  L.push(`}`)
  L.push(``)
  L.push(`export type IconSize = ${[...VALID_SIZES].join(' | ')}`)
  L.push(``)
  L.push(`interface SizedIconProps extends IconProps {`)
  L.push(`  /** Pixel-optimised size variant to render */`)
  L.push(`  size?: IconSize`)
  L.push(`}`)
  L.push(``)
  L.push(``)

  // Component definitions
  for (const group of groups) {
    const bp = toPascalCase(group.baseName)
    const cName = `${bp}Icon`

    if (group.variants.length === 0) {
      // Simple component – single size
      L.push(`/**`)
      L.push(` * ${cName} - Auto-generated from ${group.defaultFile}`)
      L.push(` */`)
      L.push(`export function ${cName}({ className, ...props }: IconProps) {`)
      L.push(`  return (`)
      L.push(`    <BaseIcon className={className} viewBox="0 0 ${group.defaultSize} ${group.defaultSize}" {...props}>`)
      L.push(`      <${bp}Svg />`)
      L.push(`    </BaseIcon>`)
      L.push(`  )`)
      L.push(`}`)
    } else {
      // Size-aware component
      const allSizes = [
        ...new Set([...group.variants.map((v) => v.size), group.defaultSize]),
      ].sort((a, b) => a - b)

      L.push(`/**`)
      L.push(` * ${cName} - Auto-generated from ${group.baseName}`)
      L.push(` * Available sizes: ${allSizes.join(', ')}`)
      L.push(` */`)
      L.push(`export function ${cName}({ size, className, ...props }: SizedIconProps) {`)
      L.push(`  switch (size) {`)

      for (const v of group.variants) {
        const vp = toPascalCase(group.baseName) + v.size
        L.push(`    case ${v.size}:`)
        L.push(`      return (`)
        L.push(`        <BaseIcon className={className} viewBox="0 0 ${v.size} ${v.size}" {...props}>`)
        L.push(`          <${vp}Svg />`)
        L.push(`        </BaseIcon>`)
        L.push(`      )`)
      }

      L.push(`    default:`)
      L.push(`      return (`)
      L.push(`        <BaseIcon className={className} viewBox="0 0 ${group.defaultSize} ${group.defaultSize}" {...props}>`)
      L.push(`          <${bp}Svg />`)
      L.push(`        </BaseIcon>`)
      L.push(`      )`)
      L.push(`  }`)
      L.push(`}`)
    }
    L.push(``)
  }

  // AutoIcons map
  L.push(`export const AutoIcons = {`)
  for (const group of groups) {
    const bp = toPascalCase(group.baseName)
    L.push(`  '${group.baseName}': ${bp}Icon,`)
  }
  L.push(`} as const`)
  L.push(``)
  L.push(`export type IconName = keyof typeof AutoIcons`)
  L.push(``)

  fs.writeFileSync(OUTPUT_FILE, L.join('\n'), 'utf-8')
}

// ─── Generate categories.json ───────────────────────────────────────

function generateCategories(groups: IconGroup[]): void {
  const MIN_GROUP_SIZE = 5
  const MAX_OTHER_CHUNK = 60

  // Collect all icon entries (baseName-size format)
  const allEntries: Array<{ entry: string; baseName: string }> = []
  for (const group of groups) {
    const allSizes = [group.defaultSize, ...group.variants.map((v) => v.size)]
    for (const size of allSizes) {
      allEntries.push({ entry: `${group.baseName}-${size}`, baseName: group.baseName })
    }
  }

  // Phase 1: Group by first name segment (prefix)
  const prefixGroups: Record<string, string[]> = {}
  for (const { entry, baseName } of allEntries) {
    const firstDash = baseName.indexOf('-')
    const prefix = firstDash > 0 ? baseName.substring(0, firstDash) : baseName
    if (!prefixGroups[prefix]) prefixGroups[prefix] = []
    prefixGroups[prefix].push(entry)
  }

  // Phase 2: Keep groups above threshold, collect leftovers
  const categories: Record<string, string[]> = {}
  const other: string[] = []
  for (const [prefix, entries] of Object.entries(prefixGroups)) {
    if (entries.length >= MIN_GROUP_SIZE) {
      categories[prefix] = entries.sort()
    } else {
      other.push(...entries)
    }
  }

  // Phase 3: Split leftovers into alphabetical chunks instead of one huge "other"
  if (other.length > 0) {
    other.sort()
    if (other.length <= MAX_OTHER_CHUNK) {
      categories['other'] = other
    } else {
      let chunkStart = 0
      while (chunkStart < other.length) {
        const chunkEnd = Math.min(chunkStart + MAX_OTHER_CHUNK, other.length)
        const first = other[chunkStart][0].toUpperCase()
        const last = other[chunkEnd - 1][0].toUpperCase()
        const label = first === last ? `other-${first}` : `other-${first}-${last}`
        categories[label] = other.slice(chunkStart, chunkEnd)
        chunkStart = chunkEnd
      }
    }
  }

  // Phase 4: Add pattern-based cross-cutting categories
  const patterns: Record<string, RegExp> = {
    'illustrations': /-ill$/,
    'tray': /-tray$/,
    'navigation': /-nav(-dark)?$/,
    'multicolor': /-mix$/,
    'outlined': /-o$/,
    'status-dots': /^dot-(chart-|critical|custom|danger|info|success|unknown|warning)/,
  }
  for (const [catName, regex] of Object.entries(patterns)) {
    const matches = allEntries
      .filter(({ baseName }) => regex.test(baseName))
      .map(({ entry }) => entry)
    if (matches.length >= MIN_GROUP_SIZE) {
      categories[catName] = matches.sort()
    }
  }

  // Sort categories by name
  const sorted: Record<string, string[]> = {}
  for (const key of Object.keys(categories).sort()) {
    sorted[key] = categories[key]
  }

  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf-8')
}

// ─── Main ───────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(SVG_DIR)) {
    console.error(`SVG directory not found: ${SVG_DIR}`)
    process.exit(1)
  }

  console.log('Scanning SVG files…')
  const groups = buildIconGroups()
  const multiSize = groups.filter((g) => g.variants.length > 0).length
  console.log(`  ${groups.length} icons (${multiSize} with size variants)`)

  console.log('Generating auto-generated.tsx…')
  generateTsx(groups)
  console.log(`  Written → ${path.relative(process.cwd(), OUTPUT_FILE)}`)

  console.log('Generating categories.json…')
  generateCategories(groups)
  console.log(`  Written → ${path.relative(process.cwd(), CATEGORIES_FILE)}`)

  console.log('Done!')
}

main()
