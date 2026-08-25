#!/usr/bin/env tsx
/**
 * Generates LLM-friendly reference docs from ui-spec component specs.
 *
 * Output:
 *   dist/llms.txt          — index of all components grouped by category
 *   dist/llms/<name>.md    — one self-contained doc per component
 *
 * Run: tsx scripts/generate-llms.ts
 * Or:  pnpm --filter @acronis-platform/ui-react build:llms
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SPEC_DIR = resolve(__dirname, '../../ui-spec/components')
const DIST_LLMS = resolve(__dirname, '../dist/llms')
const DIST_INDEX = resolve(__dirname, '../dist/llms.txt')
const PKG_JSON = resolve(__dirname, '../package.json')

// ---------------------------------------------------------------------------
// Types (matching ui-spec's YAML schemas)
// ---------------------------------------------------------------------------

interface IndexYaml {
  component: string
  name: string
  status: string
  category: string
  description: string
  since?: string
  figma?: { node?: string; codeConnect?: string }
}

interface ApiProperty {
  name: string
  type: string
  required?: boolean
  default?: unknown
  description?: string
}

interface ApiEvent {
  name: string
  payload: string
  description?: string
}

interface ApiSlot {
  name: string
  description?: string
}

interface ApiYaml {
  component: string
  contract?: {
    properties?: ApiProperty[]
    events?: ApiEvent[]
    content?: ApiSlot[]
  }
  adapters?: {
    react?: {
      component?: string
      status?: string
      import?: string
      example?: string
    }
  }
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

function readFile(path: string): string | null {
  try {
    return readFileSync(path, 'utf-8')
  } catch {
    return null
  }
}

function parseYaml<T>(path: string): T | null {
  const content = readFile(path)
  if (!content) return null
  try {
    return yaml.load(content) as T
  } catch (e) {
    console.warn(`  ⚠ YAML parse error in ${path}: ${e}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Markdown helpers
// ---------------------------------------------------------------------------

/** Remove the first H1 line and leading/trailing blank lines. */
function stripH1(md: string): string {
  return md.replace(/^#[^#][^\n]*\n/, '').trim()
}

/**
 * Shift every heading in `md` down by `by` levels.
 * e.g. shiftHeadings('## Foo\n### Bar', 1) → '### Foo\n#### Bar'
 */
function shiftHeadings(md: string, by: number): string {
  return md.replace(/^(#{1,6})/gm, (_, h: string) =>
    '#'.repeat(Math.min(h.length + by, 6)),
  )
}

function formatDefault(val: unknown): string {
  if (val === undefined || val === null) return '—'
  return `\`${String(val)}\``
}

function buildPropsTable(properties: ApiProperty[]): string {
  const header = [
    '| Prop | Type | Default | Required | Description |',
    '|------|------|---------|----------|-------------|',
  ]
  const rows = properties.map((p) => {
    const type = p.type.includes('|') ? p.type : p.type
    return `| \`${p.name}\` | \`${type}\` | ${formatDefault(p.default)} | ${p.required ? 'yes' : 'no'} | ${p.description ?? ''} |`
  })
  return ['## Props', '', ...header, ...rows].join('\n')
}

function buildEventsTable(events: ApiEvent[]): string {
  const header = [
    '| Event | Payload | Description |',
    '|-------|---------|-------------|',
  ]
  const rows = events.map(
    (e) => `| \`${e.name}\` | \`${e.payload}\` | ${e.description ?? ''} |`,
  )
  return ['## Events', '', ...header, ...rows].join('\n')
}

function buildSlotsTable(slots: ApiSlot[]): string {
  const header = ['| Slot | Description |', '|------|-------------|']
  const rows = slots.map((s) => `| \`${s.name}\` | ${s.description ?? ''} |`)
  return ['## Content slots', '', ...header, ...rows].join('\n')
}

// ---------------------------------------------------------------------------
// Per-component doc generation
// ---------------------------------------------------------------------------

function generateComponentDoc(name: string): string | null {
  const dir = join(SPEC_DIR, name)

  const index = parseYaml<IndexYaml>(join(dir, 'index.yaml'))
  if (!index) return null

  const api = parseYaml<ApiYaml>(join(dir, 'api.yaml'))
  const readme = readFile(join(dir, 'README.md'))
  const behavior = readFile(join(dir, 'behavior.md'))
  const accessibility = readFile(join(dir, 'accessibility.md'))

  const react = api?.adapters?.react
  const sections: string[] = []

  // --- Header ---------------------------------------------------------------
  sections.push(`# ${index.component}`)
  sections.push('')
  sections.push(`> ${index.description}`)
  sections.push('')

  const metaParts = [
    `**Status:** ${index.status}`,
    `**Category:** ${index.category}`,
    index.since ? `**Since:** v${index.since}` : null,
  ].filter(Boolean)
  sections.push(metaParts.join(' · '))
  sections.push('')

  // --- Import ---------------------------------------------------------------
  if (react?.import) {
    sections.push('## Import')
    sections.push('')
    sections.push('```tsx')
    sections.push(react.import)
    sections.push('```')
    sections.push('')
  }

  // --- Quick example (from api.yaml adapter) --------------------------------
  if (react?.example) {
    sections.push('## Quick example')
    sections.push('')
    sections.push('```tsx')
    sections.push(react.example.trimEnd())
    sections.push('```')
    sections.push('')
  }

  // --- README prose (When to use / not to use / specific notes) ------------
  if (readme) {
    sections.push(stripH1(readme))
    sections.push('')
  }

  // --- Props ----------------------------------------------------------------
  const properties = api?.contract?.properties
  if (properties?.length) {
    sections.push(buildPropsTable(properties))
    sections.push('')
  }

  // --- Events ---------------------------------------------------------------
  const events = api?.contract?.events
  if (events?.length) {
    sections.push(buildEventsTable(events))
    sections.push('')
  }

  // --- Content slots --------------------------------------------------------
  const slots = api?.contract?.content
  if (slots?.length) {
    sections.push(buildSlotsTable(slots))
    sections.push('')
  }

  // --- Behavior (shifted one level so ## → ### under ## Behavior) ----------
  if (behavior) {
    const inner = shiftHeadings(stripH1(behavior), 1)
    sections.push('## Behavior')
    sections.push('')
    sections.push(inner)
    sections.push('')
  }

  // --- Accessibility --------------------------------------------------------
  if (accessibility) {
    sections.push('## Accessibility')
    sections.push('')
    sections.push(stripH1(accessibility))
    sections.push('')
  }

  return sections.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

// ---------------------------------------------------------------------------
// Index (llms.txt)
// ---------------------------------------------------------------------------

function generateIndex(components: Array<{ name: string; index: IndexYaml }>): string {
  const pkg = JSON.parse(readFileSync(PKG_JSON, 'utf-8')) as { version: string }

  const byCategory = new Map<string, Array<{ name: string; index: IndexYaml }>>()
  for (const c of components) {
    const cat = c.index.category ?? 'other'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(c)
  }

  const lines: string[] = [
    `# Acronis UI Kit for React — LLM Reference`,
    '',
    `> \`@acronis-platform/ui-react\` v${pkg.version}`,
    '',
    'Machine-readable component reference compiled from framework-agnostic specs.',
    'Each entry links to a self-contained markdown file with props, behavior,',
    'accessibility notes, and usage examples.',
    '',
    '## How to reference in CLAUDE.md / project instructions',
    '',
    '```',
    '# Full index (broad overview):',
    '@node_modules/@acronis-platform/ui-react/dist/llms.txt',
    '',
    '# Single component (deep reference):',
    '@node_modules/@acronis-platform/ui-react/dist/llms/button.md',
    '```',
    '',
  ]

  const sortedCategories = [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))

  for (const [cat, comps] of sortedCategories) {
    const heading = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
    lines.push(`## ${heading}`)
    lines.push('')
    for (const { name, index } of comps.sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(`- [${index.component}](./llms/${name}.md): ${index.description}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

mkdirSync(DIST_LLMS, { recursive: true })

const componentNames = readdirSync(SPEC_DIR).filter((n) => {
  try {
    return statSync(join(SPEC_DIR, n)).isDirectory()
  } catch {
    return false
  }
})

const generated: Array<{ name: string; index: IndexYaml }> = []
const skipped: string[] = []

for (const name of componentNames) {
  const index = parseYaml<IndexYaml>(join(SPEC_DIR, name, 'index.yaml'))
  if (!index) {
    skipped.push(name)
    continue
  }

  const doc = generateComponentDoc(name)
  if (!doc) {
    skipped.push(name)
    continue
  }

  writeFileSync(join(DIST_LLMS, `${name}.md`), doc)
  generated.push({ name, index })
  console.log(`  ✓ ${name}`)
}

const indexContent = generateIndex(generated)
writeFileSync(DIST_INDEX, indexContent)

console.log(`\n✓ Generated ${generated.length} component docs → dist/llms/`)
console.log(`✓ Generated index → dist/llms.txt`)
if (skipped.length) {
  console.warn(`⚠ Skipped ${skipped.length}: ${skipped.join(', ')}`)
}
