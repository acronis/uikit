'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { icons as strokeMono } from '@acronis-platform/icons-react/stroke-mono';
import { icons as solidMono } from '@acronis-platform/icons-react/solid-mono';
import { icons as strokeMulti } from '@acronis-platform/icons-react/stroke-multi';
import { icons as solidMulti } from '@acronis-platform/icons-react/solid-multi';

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

/** The four published icon packs, in catalog display order. */
const PACKS = [
  { id: 'stroke-mono', label: 'Stroke · mono', icons: strokeMono },
  { id: 'solid-mono', label: 'Solid · mono', icons: solidMono },
  { id: 'stroke-multi', label: 'Stroke · multi', icons: strokeMulti },
  { id: 'solid-multi', label: 'Solid · multi', icons: solidMulti },
] as const;

type PackId = (typeof PACKS)[number]['id'];

/** The rendered pixel sizes offered by the size toggle. */
const SIZES = [16, 24, 32] as const;
type IconSize = (typeof SIZES)[number];

/**
 * Convert a kebab-case icon slug to its PascalCase export name. Mirrors the
 * generator's rule: `chevron-down` → `ChevronDownIcon`, while numeric-leading
 * slugs are prefixed instead (`365-sync` → `Icon365Sync`) since an identifier
 * can't start with a digit.
 */
function toExportName(slug: string): string {
  const pascal = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return /^[0-9]/.test(slug) ? `Icon${pascal}` : `${pascal}Icon`;
}

type IconEntry = {
  slug: string;
  name: string;
  pack: PackId;
  packLabel: string;
  Component: IconComponent;
};

const allIcons: IconEntry[] = PACKS.flatMap((pack) =>
  Object.entries(pack.icons as Record<string, IconComponent>).map(
    ([slug, Component]) => ({
      slug,
      name: toExportName(slug),
      pack: pack.id,
      packLabel: pack.label,
      Component,
    })
  )
).sort((a, b) => a.slug.localeCompare(b.slug));

const TOTAL = allIcons.length;

export function IconCatalog() {
  const [search, setSearch] = useState('');
  const [activePack, setActivePack] = useState<PackId | 'all'>('all');
  const [size, setSize] = useState<IconSize>(24);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return allIcons.filter((icon) => {
      if (activePack !== 'all' && icon.pack !== activePack) return false;
      if (!lower) return true;
      return (
        icon.slug.includes(lower) || icon.name.toLowerCase().includes(lower)
      );
    });
  }, [search, activePack]);

  const handleCopy = useCallback((entry: IconEntry) => {
    const snippet = `import { ${entry.name} } from '@acronis-platform/icons-react/${entry.pack}'`;
    const key = `${entry.pack}/${entry.slug}`;
    navigator.clipboard.writeText(snippet).then(() => {
      setCopiedKey(key);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiedKey(null), 1500);
    });
  }, []);

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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <PackTab
            label="All"
            active={activePack === 'all'}
            onClick={() => setActivePack('all')}
          />
          {PACKS.map((pack) => (
            <PackTab
              key={pack.id}
              label={pack.label}
              active={activePack === pack.id}
              onClick={() => setActivePack(pack.id)}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-fd-muted-foreground">Size</span>
          {SIZES.map((s) => (
            <PackTab
              key={s}
              label={`${s}`}
              active={size === s}
              onClick={() => setSize(s)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
        {filtered.map((entry) => {
          const key = `${entry.pack}/${entry.slug}`;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleCopy(entry)}
              title={`Copy import for ${entry.name} (${entry.packLabel})`}
              className="group relative flex flex-col items-center gap-1.5 rounded-lg border border-fd-border p-3 text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
            >
              <span className="flex h-8 items-center justify-center">
                <entry.Component size={size} className="shrink-0" />
              </span>
              <span className="w-full truncate text-center text-[10px] leading-tight text-fd-muted-foreground group-hover:text-fd-accent-foreground">
                {entry.name}
              </span>

              {copiedKey === key && (
                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-fd-background/90 text-xs font-medium text-fd-primary">
                  Copied!
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-fd-muted-foreground">
          No icons match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}

function PackTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ' +
        (active
          ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
          : 'border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground')
      }
    >
      {label}
    </button>
  );
}
