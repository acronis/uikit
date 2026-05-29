/**
 * Generates Storybook story files for icons organized by category.
 *
 * Reads categories.json and creates one story file per category
 * in src/components/icons/__stories__/.
 *
 * Run with: npm run generate:icon-stories
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ICONS_DIR = path.resolve(__dirname, '../src/components/icons')
const CATEGORIES_FILE = path.resolve(ICONS_DIR, 'categories.json')
const STORIES_DIR = path.resolve(ICONS_DIR, '__stories__')

function toPascalCase(name: string): string {
  return name
    .replace(/[+]/g, 'And')
    .replace(/[_]/g, '-')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function toTitleCase(name: string): string {
  return name
    .replace(/[+]/g, ' & ')
    .replace(/[_]/g, ' ')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function main() {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    console.error(`categories.json not found: ${CATEGORIES_FILE}`)
    process.exit(1)
  }

  if (!fs.existsSync(STORIES_DIR)) {
    fs.mkdirSync(STORIES_DIR, { recursive: true })
  }

  const categories: Record<string, string[]> = JSON.parse(
    fs.readFileSync(CATEGORIES_FILE, 'utf-8')
  )

  // Determine the set of filenames that will be written
  const expectedFilenames = new Set(
    Object.keys(categories).map(
      (categoryName) =>
        `icons-${categoryName.replace(/[+]/g, '-').replace(/[_]/g, '-')}.stories.tsx`
    )
  )

  // Remove stale story files that are no longer in categories
  for (const existing of fs.readdirSync(STORIES_DIR)) {
    if (existing.startsWith('icons-') && existing.endsWith('.stories.tsx') && !expectedFilenames.has(existing)) {
      fs.rmSync(path.join(STORIES_DIR, existing))
      console.log(`Removed stale story file: ${existing}`)
    }
  }

  let generated = 0

  for (const [categoryName, entries] of Object.entries(categories)) {
    const pascalName = toPascalCase(categoryName)
    const titleName = toTitleCase(categoryName)
    const filename = `icons-${categoryName.replace(/[+]/g, '-').replace(/[_]/g, '-')}.stories.tsx`
    const filepath = path.join(STORIES_DIR, filename)

    const lines: string[] = []
    lines.push(`import type { Meta, StoryObj } from '@storybook/react-vite'`)
    lines.push(`import { IconGrid } from './IconGrid'`)
    lines.push(``)
    lines.push(`const icons = ${JSON.stringify(entries, null, 2)}`)
    lines.push(``)
    lines.push(`const meta = {`)
    lines.push(`  title: 'Icons/${titleName}',`)
    lines.push(`  parameters: { layout: 'fullscreen' },`)
    lines.push(`} satisfies Meta`)
    lines.push(``)
    lines.push(`export default meta`)
    lines.push(`type Story = StoryObj<typeof meta>`)
    lines.push(``)
    lines.push(`export const ${pascalName}: Story = {`)
    lines.push(`  render: () => <IconGrid entries={icons} />,`)
    lines.push(`}`)
    lines.push(``)

    fs.writeFileSync(filepath, lines.join('\n'), 'utf-8')
    generated++
  }

  console.log(`Generated ${generated} icon story files → ${path.relative(process.cwd(), STORIES_DIR)}`)
}

main()
