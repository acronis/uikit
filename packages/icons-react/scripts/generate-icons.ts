import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  executeSvg,
  expandStyles,
  loadAllRules,
  loadPack,
  nodeToJsx,
  parseSvg,
  readSvg,
  resolveAsset,
  type Asset,
  type INode,
  type StyleUnit,
} from '@acronis-platform/style-dictionary/assets';

import { kebabCase, toComponentName } from '../src/lib/naming.ts';
import { PACKS, type PackConfig } from './packs.ts';

const here = dirname(fileURLToPath(import.meta.url));
const srcPacks = resolve(here, '..', 'src', 'packs');

// design-assets is the single source of truth. Its `icons` pack ships the four
// styles as `assetsGroups` whose ids match a pack here (stroke-mono, …); the
// canonical resolver + executor (reused from `@acronis-platform/style-dictionary`)
// turn each asset into per-size SVGs with the design scale/stroke/color rules
// already applied. This generator only maps those onto icons-react's shape.
const ICONS_PACK = 'icons';
const PLATFORM = 'PD';

// Paint attrs that may be lifted from the executed SVG to the root so geometry
// dedups across sizes (and mono paint collapses to a single currentColor root).
const GEOMETRY_ATTRS = ['stroke-width', 'stroke-linecap', 'stroke-linejoin'] as const;

// Elements whose subtree is never painted (clip regions, masks, symbol/gradient
// defs). Paint attrs inside them must NOT drive the root paint collapse: a
// stroke-mono icon's `<defs><clipPath><path fill="…">` mask is recolored to
// `currentColor` by the executor's mono pass, and collecting it would discard the
// source root's `fill="none"` and make the outlined geometry inherit a solid fill.
const NON_RENDERING = new Set([
  'defs',
  'clipPath',
  'mask',
  'symbol',
  'marker',
  'pattern',
  'linearGradient',
  'radialGradient',
  'filter',
]);

const rules = loadAllRules();
const styleByLabel = new Map<string, StyleUnit>(
  expandStyles(loadPack(ICONS_PACK), rules).map((s) => [s.label, s])
);

/** kebab attr → camelCase JSX prop name (leaving aria-/data- alone). */
function camelAttr(name: string): string {
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  return name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

interface SizeSpec {
  size: number;
  w: string;
  h: string;
  strokeWidth?: string;
  inner: string;
}

/**
 * Split one executed (rule-applied) SVG into root paint attrs + inner geometry.
 * Uniform stroke geometry — and, for mono styles, the collapsed `currentColor`
 * paint — is lifted to the root and stripped from the inner so identical
 * geometry dedups across sizes; per-path colors on multicolor styles stay put.
 */
function splitExecutedSvg(
  size: number,
  svg: string,
  mono: boolean
): { spec: SizeSpec; rootAttrs: Record<string, string> } {
  const root = parseSvg(svg);
  const w = root.attributes.width ?? String(size);
  const h = root.attributes.height ?? String(size);

  const seen = new Map<string, Set<string>>();
  const record = (attr: string, value?: string) => {
    if (value == null) return;
    (seen.get(attr) ?? seen.set(attr, new Set()).get(attr)!).add(value);
  };
  // Collect paint only from rendered geometry — skip non-rendering subtrees so a
  // clip/mask's paint can't force the mono root collapse (see NON_RENDERING).
  const collectPaint = (node: INode): void => {
    if (node.type === 'element' && node !== root && node.attributes) {
      for (const attr of ['fill', 'stroke', ...GEOMETRY_ATTRS]) record(attr, node.attributes[attr]);
    }
    for (const child of node.children ?? []) {
      if (child.type === 'element' && NON_RENDERING.has(child.name)) continue;
      collectPaint(child);
    }
  };
  collectPaint(root);
  const single = (attr: string): string | undefined => {
    const values = seen.get(attr);
    return values && values.size === 1 ? [...values][0] : undefined;
  };

  const skip = new Set<string>();
  const rootAttrs: Record<string, string> = {};
  for (const [key, value] of Object.entries(root.attributes)) {
    if (key === 'width' || key === 'height' || key === 'xmlns') continue;
    rootAttrs[camelAttr(key)] = value;
  }
  for (const attr of GEOMETRY_ATTRS) {
    const value = single(attr);
    if (value != null) {
      rootAttrs[camelAttr(attr)] = value;
      skip.add(attr);
    }
  }
  // Mono: the executor already recolored every fill/stroke to currentColor, so
  // collapse it to a single root declaration and drop it from the geometry.
  if (mono) {
    if (seen.has('stroke')) {
      rootAttrs.stroke = 'currentColor';
      skip.add('stroke');
    }
    if (seen.has('fill')) {
      rootAttrs.fill = 'currentColor';
      skip.add('fill');
    }
  }

  const strokeWidth = rootAttrs.strokeWidth;
  delete rootAttrs.strokeWidth;

  const inner = (root.children ?? [])
    .map((child) => nodeToJsx(child, skip))
    .filter(Boolean)
    .join('\n      ');

  return { spec: { size, w, h, strokeWidth, inner }, rootAttrs };
}

interface Component {
  name: string;
  component: string;
  file: string;
}

function componentSource(
  component: string,
  style: StyleUnit,
  id: string,
  asset: Asset
): { source: string; sizes: number[] } {
  const resolved = resolveAsset(style.manifest, id, asset, rules);
  const mono = style.color === 'mono';

  // NOTE: today every design-assets icon variant is a numeric size, so the
  // variant id maps 1:1 to a render dimension. The broader asset model allows
  // other axes (theme, platform) and non-SVG binaries later; those would resolve
  // through the same resolver but need their own variant→prop / binary handling.
  const split = resolved.variants
    .map((v) => splitExecutedSvg(Number(v.id), executeSvg(readSvg(v.leafFile), v.rules, style.color), mono))
    .sort((a, b) => a.spec.size - b.spec.size);

  // `SvgIcon` applies the root viewBox/paint ONCE for all sizes, so they must be
  // size-invariant. Today they always are (single 24 master → rule-derived 16),
  // but assert it: if a size ever ships distinct artwork with its own
  // viewBox/root paint, fail loudly here instead of silently rendering every
  // size with the smallest variant's root.
  const rootKey = (attrs: Record<string, string>): string =>
    JSON.stringify(Object.entries(attrs).sort(([a], [b]) => (a < b ? -1 : 1)));
  const baseRootKey = rootKey(split[0].rootAttrs);
  const divergent = split.find((s) => rootKey(s.rootAttrs) !== baseRootKey);
  if (divergent) {
    throw new Error(
      `root viewBox/paint differs at size ${divergent.spec.size} — per-size root attrs are not supported (SvgIcon applies one root for all sizes)`
    );
  }

  // Root paint is size-invariant (asserted above); take it from any variant.
  const rootProps = Object.entries(split[0].rootAttrs)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

  // Dedup identical inner geometry into a shared constant.
  const geomNames = new Map<string, string>();
  const geomConsts: string[] = [];
  const geomVar = (jsx: string): string => {
    let name = geomNames.get(jsx);
    if (!name) {
      name = `g${geomNames.size}`;
      geomNames.set(jsx, name);
      geomConsts.push(`const ${name} = (\n  <>\n      ${jsx}\n  </>\n);`);
    }
    return name;
  };
  const sizeEntries = split
    .map(({ spec }) => {
      const sw = spec.strokeWidth != null ? `, strokeWidth: '${spec.strokeWidth}'` : '';
      return `  ${spec.size}: { inner: ${geomVar(spec.inner)}, w: '${spec.w}', h: '${spec.h}'${sw} },`;
    })
    .join('\n');

  const source =
    `import { PackIcon, type IconProps } from '../icon';\n\n` +
    `${geomConsts.join('\n\n')}\n\n` +
    `const SIZES = {\n${sizeEntries}\n};\n\n` +
    `export function ${component}(props: IconProps) {\n` +
    `  return <PackIcon ${rootProps} sizes={SIZES} defaultSize={${resolved.canonical}} {...props} />;\n}\n`;
  return { source, sizes: split.map((s) => s.spec.size) };
}

async function generatePack(pack: PackConfig): Promise<number> {
  const style = styleByLabel.get(pack.name);
  if (!style?.manifest.assets) {
    throw new Error(`icons-react: design-assets icons pack has no assetsGroup "${pack.name}"`);
  }

  const outDir = resolve(srcPacks, pack.name);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(resolve(outDir, 'icons'), { recursive: true });

  const entries = Object.entries(style.manifest.assets)
    .filter(([, asset]) => (asset as Asset).platforms.includes(PLATFORM))
    .map(([id, asset]) => ({ id, asset: asset as Asset, name: kebabCase(id) }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

  const components: Component[] = [];
  const packSizes = new Set<number>();
  for (const { id, asset, name } of entries) {
    const component = toComponentName(name);
    // No try/catch: componentSource's divergence guard is meant to fail loudly.
    // `src/packs` is gitignored, so a swallowed error would silently drop a
    // published icon with a fully green build and no reviewable diff.
    const result = componentSource(component, style, id, asset);
    await writeFile(resolve(outDir, 'icons', `${name}.tsx`), result.source);
    result.sizes.forEach((s) => packSizes.add(s));
    components.push({ name, component, file: `./icons/${name}` });
  }

  // The allowed `size` union is data-driven: the dimensions design-assets
  // actually defines for this pack (a pack/group/asset override flows through
  // here with no code change). `number` only if a pack somehow ships none.
  const sizeUnion = [...packSizes].sort((a, b) => a - b).join(' | ') || 'number';
  await writeFile(
    resolve(outDir, 'icon.tsx'),
    `// Generated by scripts/generate-icons.ts from @acronis-platform/design-assets. Do not edit.\n` +
      `import { SvgIcon, type IconBaseProps } from '../../lib/svg-icon';\n\n` +
      `/** Render dimensions design-assets defines for the \`${pack.name}\` pack. */\n` +
      `export type IconSize = ${sizeUnion};\n\n` +
      `export interface IconProps extends IconBaseProps {\n  size?: IconSize;\n}\n\n` +
      `export const PackIcon = SvgIcon;\n`
  );

  const imports = components.map((c) => `import { ${c.component} } from '${c.file}';`).join('\n');
  const exportList = `export {\n${components.map((c) => `  ${c.component},`).join('\n')}\n};`;
  const registry =
    `export const icons = {\n` +
    components.map((c) => `  '${c.name}': ${c.component},`).join('\n') +
    `\n} as const;`;
  const index =
    `// Generated by scripts/generate-icons.ts from @acronis-platform/design-assets. Do not edit.\n` +
    `export type { IconProps, IconSize } from './icon';\n\n` +
    `${imports}\n\n${exportList}\n\n${registry}\n\n` +
    `export type IconName = keyof typeof icons;\n`;
  await writeFile(resolve(outDir, 'index.ts'), index);

  return components.length;
}

async function main(): Promise<void> {
  await mkdir(srcPacks, { recursive: true });
  for (const pack of PACKS) {
    const count = await generatePack(pack);
    console.log(`✓ icons-react: ${pack.name} — ${count} icons`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
