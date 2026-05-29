import React from 'react'
import { AutoIcons, type IconSize } from '../auto-generated'

const VALID_SIZES = new Set([16, 24, 32, 48, 72, 96])

/**
 * Parse an icon entry like "user-16" into { baseName: "user", size: 16 }.
 * The trailing number must be a valid design-system size.
 */
function parseIconEntry(entry: string): { baseName: string; size: number } {
  const match = entry.match(/^(.+)-(\d+)$/)
  if (match) {
    const size = parseInt(match[2], 10)
    if (VALID_SIZES.has(size)) {
      return { baseName: match[1], size }
    }
  }
  return { baseName: entry, size: 0 }
}

/**
 * Shared grid component for rendering a list of icons by their category entries.
 * Used by auto-generated icon category stories.
 */
export function IconGrid({ entries }: { entries: string[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '8px',
        padding: '24px',
      }}
    >
      {entries.map((entry) => {
        const { baseName, size } = parseIconEntry(entry)
        const Icon = (AutoIcons as Record<string, React.ComponentType<any>>)[baseName]

        if (!Icon) {
          return (
            <div
              key={entry}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: 12,
                opacity: 0.3,
                border: '1px dashed #ccc',
                borderRadius: 8,
              }}
            >
              <div style={{ width: 32, height: 32 }} />
              <span style={{ fontSize: 10, textAlign: 'center', wordBreak: 'break-all' }}>
                {entry} (missing)
              </span>
            </div>
          )
        }

        return (
          <div
            key={entry}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              border: '1px solid #eee',
              borderRadius: 8,
            }}
          >
            <Icon
              size={size as IconSize}
              style={{ width: Math.max(size, 16), height: Math.max(size, 16) }}
            />
            <span
              style={{
                fontSize: 10,
                color: '#666',
                textAlign: 'center',
                wordBreak: 'break-all',
                lineHeight: 1.3,
              }}
            >
              {entry}
            </span>
          </div>
        )
      })}
    </div>
  )
}
