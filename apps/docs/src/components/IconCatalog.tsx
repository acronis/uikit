'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { AutoIcons } from '@acronis-platform/shadcn-uikit';

/**
 * Convert a kebab-case icon slug (e.g. "chevron-down") to its PascalCase
 * export name (e.g. "ChevronDownIcon"). This mirrors the naming convention
 * used by the auto-generated icon module.
 */
function toPascalCaseName(slug: string): string {
  const pascal = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${pascal}Icon`;
}

type IconEntry = {
  slug: string;
  name: string;
  Component: React.ComponentType<{ className?: string }>;
};

const allIcons: IconEntry[] = Object.entries(
  AutoIcons as Record<string, React.ComponentType<{ className?: string }>>
)
  .map(([slug, Component]) => ({
    slug,
    name: toPascalCaseName(slug),
    Component,
  }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

const TOTAL = allIcons.length;

export function IconCatalog() {
  const [search, setSearch] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const filtered = useMemo(() => {
    if (!search) return allIcons;
    const lower = search.toLowerCase();
    return allIcons.filter(
      (icon) =>
        icon.slug.includes(lower) || icon.name.toLowerCase().includes(lower)
    );
  }, [search]);

  const handleCopy = useCallback(
    (entry: IconEntry) => {
      const snippet = `import { ${entry.name} } from '@acronis-platform/shadcn-uikit'`;
      navigator.clipboard.writeText(snippet).then(() => {
        setCopiedSlug(entry.slug);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedSlug(null), 1500);
      });
    },
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-md border border-fd-border bg-fd-background px-3 text-sm outline-none placeholder:text-fd-muted-foreground focus:ring-2 focus:ring-fd-ring sm:max-w-xs"
        />
        <p className="text-sm text-fd-muted-foreground">
          Showing {filtered.length} of {TOTAL} icons
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {filtered.map((entry) => (
          <button
            key={entry.slug}
            type="button"
            onClick={() => handleCopy(entry)}
            title={`Copy import for ${entry.name}`}
            className="group relative flex flex-col items-center gap-1.5 rounded-lg border border-fd-border p-3 text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <entry.Component className="size-6 shrink-0" />
            <span className="w-full truncate text-center text-[10px] leading-tight text-fd-muted-foreground group-hover:text-fd-accent-foreground">
              {entry.name}
            </span>

            {copiedSlug === entry.slug && (
              <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-fd-background/90 text-xs font-medium text-fd-primary">
                Copied!
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-fd-muted-foreground">
          No icons match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}
