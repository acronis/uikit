/**
 * White-Label Theme Generator
 *
 * Reads brand color tokens from the sibling ui-syntax repository's source JSON
 * and generates a single SCSS theme file for the shadcn-uikit white-label theme system.
 *
 * Output: src/styles/themes/acronis-white-label.scss (committed to git)
 * Each partner brand becomes a standalone .theme-{brand} CSS class.
 *
 * Most developers do NOT need to run this script — just use the committed file.
 * Only re-run when upstream design tokens change in ui-syntax.
 *
 * Usage:
 *   pnpm run generate:themes
 */

import { writeFileSync, readFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { resolve, join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Path to the sibling ui-syntax repo's brand token JSON files.
 *
 * Expected repo layout (all repos cloned under the same parent directory):
 *   <parent>/
 *     shadcn-uikit/        ← this repo
 *     ui-syntax/           ← @uikit/ui-syntax-tokens source
 *
 * Each brand file is a nested JSON object where leaf nodes have:
 *   { originalName: "av-nav-primary", value: "oklch(...)" }
 *
 * If your ui-syntax checkout lives elsewhere, update this path.
 */
const UI_SYNTAX_BRANDS_DIR = resolve(
  __dirname, '..', '..', '..', '..', '..', 'ui-syntax', 'packages', 'tokens', 'src', 'tokens', 'brands'
);

const OUTPUT_FILE = resolve(__dirname, '..', 'src', 'styles', 'themes', 'acronis-white-label.scss');

const EXCLUDED_BRANDS = ['dark', 'website', 'default'];
const REFERENCE_BRAND = 'purple'; // Used for shared base tokens

// Brands list (in order)
const BRAND_ORDER = [
  'purple', 'brown', 'sand', 'light-gray', 'dark-gray',
  'ingram-micro', 'red-fire-brick', 'yellow-1c', 'deep-sky-itkontoret',
  'blue-yellow-uss-signal', 'red-home-pl', 'orange-tsukaeru-helpox',
  'green-also-choise-df', 'light-blue-hp', 'purple-fusion-media',
  'virtual-one', 'telstra', 'deep-purple', 'pinky', 'virtuozzo',
];

// Tokens that keep alpha (output as `hsl(H S% L% / A)`)
const ALPHA_TOKENS = new Set([
  '--av-nav-text-light',
  '--av-scroll-thumb',
  '--av-scroll-thumb-inverse',
]);

// Brand-specific overrides: target CSS var → source CSS var from token file
const BRAND_OVERRIDES: Record<string, Record<string, string>> = {
  virtuozzo: {
    // Virtuozzo uses brand-primary as fixed-link instead of Acronis blue
    '--color-brand-secondary': '--av-brand-primary',
    '--av-fixed-link-light': '--av-fixed-link-light',
  },
};

// ---------------------------------------------------------------------------
// Color Conversion (OKLch → sRGB → HSL)
// ---------------------------------------------------------------------------

interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/** Parse OKLch CSS string: "oklch(L% C H)" or "oklch(L% C H / A)" */
function parseOklch(value: string): { L: number; C: number; H: number; a?: number } | null {
  // Skip gradients
  if (value.startsWith('linear-gradient')) return null;

  const match = value.match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\w.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/
  );
  if (!match) return null;

  return {
    L: +match[1] / 100, // normalize to 0-1
    C: +match[2],
    H: match[3] === 'none' ? 0 : +match[3],
    a: match[4] !== undefined ? +match[4] : undefined,
  };
}

/** OKLch → OKLab */
function oklchToOklab(L: number, C: number, H: number): [number, number, number] {
  const hRad = (H * Math.PI) / 180;
  return [L, C * Math.cos(hRad), C * Math.sin(hRad)];
}

/** OKLab → linear sRGB */
function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

/** Linear sRGB → sRGB (gamma correction) */
function linearToSrgb(c: number): number {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** Convert OKLch CSS value to RGB */
function oklchToRgb(value: string): RGB | null {
  const parsed = parseOklch(value);
  if (!parsed) return null;

  const [labL, labA, labB] = oklchToOklab(parsed.L, parsed.C, parsed.H);
  const [lr, lg, lb] = oklabToLinearSrgb(labL, labA, labB);

  return {
    r: Math.round(Math.min(255, Math.max(0, linearToSrgb(lr) * 255))),
    g: Math.round(Math.min(255, Math.max(0, linearToSrgb(lg) * 255))),
    b: Math.round(Math.min(255, Math.max(0, linearToSrgb(lb) * 255))),
    a: parsed.a,
  };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return [0, 0, Math.round(l * 100)];

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;

  if (max === r) h = 60 * (((g - b) / delta) % 6);
  else if (max === g) h = 60 * ((b - r) / delta + 2);
  else h = 60 * ((r - g) / delta + 4);

  if (h < 0) h += 360;

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Flatten RGBA onto white background to get solid color */
function flattenOnWhite(rgb: RGB): RGB {
  const a = rgb.a ?? 1;
  return {
    r: Math.round(rgb.r * a + 255 * (1 - a)),
    g: Math.round(rgb.g * a + 255 * (1 - a)),
    b: Math.round(rgb.b * a + 255 * (1 - a)),
  };
}

/** Convert a color value to bare HSL string: "H S% L%" */
function toBareHsl(rgb: RGB): string {
  const solid = rgb.a !== undefined ? flattenOnWhite(rgb) : rgb;
  const [h, s, l] = rgbToHsl(solid.r, solid.g, solid.b);
  return `${h} ${s}% ${l}%`;
}

/** Convert a color value to hsl() with alpha: "hsl(H S% L% / A)" */
function toHslAlpha(rgb: RGB): string {
  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const a = rgb.a ?? 1;
  return `hsl(${h} ${s}% ${l}% / ${a})`;
}

/** Get hex comment string */
function toHexComment(rgb: RGB): string {
  if (rgb.a !== undefined && rgb.a < 1) {
    const solid = flattenOnWhite(rgb);
    return rgbToHex(solid.r, solid.g, solid.b);
  }
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// ---------------------------------------------------------------------------
// Token Reader (reads source JSON files from ui-syntax repo)
// ---------------------------------------------------------------------------

/** Flat map of CSS variable name → OKLch value string */
type TokenMap = Map<string, string>;

interface TokenLeaf {
  originalName: string;
  value: string;
  type?: string;
}

/** Recursively flatten nested brand JSON into a flat token map */
function flattenTokenJson(obj: Record<string, unknown>, result: TokenMap): void {
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      // Leaf node: has both originalName and value
      if (typeof record.originalName === 'string' && typeof record.value === 'string') {
        const leaf = record as unknown as TokenLeaf;
        result.set(`--${leaf.originalName}`, leaf.value);
      } else {
        // Nested object — recurse
        flattenTokenJson(record, result);
      }
    }
  }
}

/** Read a brand's source JSON file and return a flat token map */
function readBrandTokens(filePath: string): TokenMap {
  const raw = readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw) as Record<string, unknown>;
  const tokens: TokenMap = new Map();
  flattenTokenJson(json, tokens);
  return tokens;
}

// ---------------------------------------------------------------------------
// Token Mapping (ui-syntax originalName → shadcn-uikit CSS variable)
// ---------------------------------------------------------------------------

// Nav tokens: source CSS var → target CSS var (vary per brand)
const NAV_TOKEN_MAP: Record<string, string> = {
  '--av-nav-primary': '--av-nav-bg',
  '--av-nav-secondary': '--av-nav-active',
  '--av-nav-text': '--av-nav-text',
  '--av-nav-text-light': '--av-nav-text-light',
  '--av-nav-text-active': '--av-nav-text-active',
  '--av-scroll-thumb-inverse': '--av-scroll-thumb-inverse',
};

// ---------------------------------------------------------------------------
// Convert OKLch token value to CSS value string
// ---------------------------------------------------------------------------

function convertOklchValue(
  oklchValue: string,
  targetVar: string,
): { cssValue: string; comment: string } | null {
  const rgb = oklchToRgb(oklchValue);
  if (!rgb) return null; // Skip gradients or unparseable values

  const keepAlpha = ALPHA_TOKENS.has(targetVar) && rgb.a !== undefined && rgb.a < 1;
  const cssValue = keepAlpha ? toHslAlpha(rgb) : toBareHsl(rgb);
  const comment = keepAlpha
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
    : toHexComment(rgb);

  return { cssValue, comment };
}

// ---------------------------------------------------------------------------
// SCSS Generation
// ---------------------------------------------------------------------------

function generateBaseMixin(tokens: TokenMap): string {
  const lines: string[] = [];

  lines.push('@mixin theme-acronis-white-label-base {');

  // Primitive tokens
  lines.push('  /* ============================================');
  lines.push('     PRIMITIVE TOKENS - WHITE LABEL (auto-generated)');
  lines.push('     ============================================ */');
  lines.push('');

  const primitiveGroups: Array<{ label: string; mappings: Array<[string, string]> }> = [
    {
      label: 'Brand Colors',
      mappings: [
        ['--av-brand-primary', '--color-brand-primary'],
        ['--av-fixed-link', '--color-brand-secondary'],
        ['--av-solid-brand-lightest', '--color-brand-lightest'],
        ['--av-brand-light', '--color-brand-light'],
        ['--av-solid-brand-accent', '--color-brand-accent'],
      ],
    },
    {
      label: 'Text Colors',
      mappings: [
        ['--av-inversed-primary', '--color-text-inverse'],
        ['--av-fixed-primary', '--color-text-primary'],
        ['--av-fixed-neutral-dark', '--color-text-secondary'],
        ['--av-fixed-neutral-dark', '--color-text-tertiary'],
      ],
    },
    {
      label: 'Surface Colors',
      mappings: [
        ['--av-inversed-primary', '--color-surface-primary'],
        ['--av-fixed-primary', '--color-surface-overlay'],
        ['--av-inversed-primary', '--color-surface-elevated'],
      ],
    },
    {
      label: 'Status Colors',
      mappings: [
        ['--av-fixed-success-dark', '--color-status-success-dark'],
        ['--av-fixed-success-accent', '--color-status-success-light'],
        ['--av-fixed-info-dark', '--color-status-info-dark'],
        ['--av-fixed-info-accent', '--color-status-info-light'],
        ['--av-fixed-warning-dark', '--color-status-warning-dark'],
        ['--av-fixed-warning-accent', '--color-status-warning-light'],
        ['--av-fixed-danger-dark', '--color-status-danger-dark'],
        ['--av-fixed-danger-accent', '--color-status-danger-light'],
        ['--av-fixed-critical-dark', '--color-status-critical-dark'],
        ['--av-fixed-critical-accent', '--color-status-critical-light'],
      ],
    },
    {
      label: 'Neutral Colors',
      mappings: [
        ['--av-fixed-neutral-dark', '--color-neutral-dark'],
        ['--av-fixed-neutral-accent', '--color-neutral-light'],
      ],
    },
  ];

  for (const group of primitiveGroups) {
    lines.push(`  /* ${group.label} */`);
    for (const [srcName, targetVar] of group.mappings) {
      const oklchVal = tokens.get(srcName);
      if (!oklchVal) { lines.push(`  /* MISSING: ${srcName} → ${targetVar} */`); continue; }
      const converted = convertOklchValue(oklchVal, targetVar);
      if (!converted) continue;
      lines.push(`  ${targetVar}: ${converted.cssValue}; /* ${converted.comment} - ${srcName} */`);
    }
    lines.push('');
  }

  // Base status aliases (semantic tokens reference these without -light/-dark suffix)
  lines.push('  /* Base status primitives (aliases for semantic tokens) */');
  lines.push('  --color-status-success: var(--color-status-success-dark);');
  lines.push('  --color-status-info: var(--color-status-info-dark);');
  lines.push('  --color-status-warning: var(--color-status-warning-dark);');
  lines.push('  --color-status-danger: var(--color-status-danger-dark);');
  lines.push('  --color-status-critical: var(--color-status-critical-dark);');
  lines.push('  --color-status-neutral-dark: var(--color-neutral-dark);');
  lines.push('  --color-status-neutral-light: var(--color-neutral-light);');
  lines.push('  --color-status-neutral: var(--color-status-neutral-dark);');
  lines.push('');

  // AI Colors (not in brand JSONs, hardcoded from Figma common tokens)
  lines.push('  /* AI Colors */');
  lines.push('  --color-ai: 263deg 77% 57%;');
  lines.push('  --color-ai-light: 273deg 85% 97%;');
  lines.push('  --color-ai-dark: 263deg 77% 57%;');
  lines.push('');

  // Opacity modifiers
  lines.push('  /* Opacity Modifiers */');
  for (const [k, v] of [['10', '0.1'], ['20', '0.2'], ['30', '0.3'], ['40', '0.4'], ['50', '0.5'], ['70', '0.7'], ['90', '0.9']]) {
    lines.push(`  --opacity-${k}: ${v};`);
  }
  lines.push('');

  // Semantic tokens
  lines.push('  /* ============================================');
  lines.push('     SEMANTIC TOKENS - LIGHT MODE');
  lines.push('     ============================================ */');
  lines.push('');

  // These are standard mappings that don't change per brand
  const semanticLines = `
  /* Backgrounds */
  --av-background: var(--color-surface-primary);
  --av-elevated: var(--color-surface-elevated);
  --av-card: var(--av-elevated);
  --av-muted: var(--color-brand-lightest);
  --av-primary: var(--color-brand-primary);
  --av-accent: var(--color-brand-primary);
  --av-secondary: var(--color-surface-elevated);
  --av-destructive: var(--color-status-danger);
  --av-destructive-foreground: var(--color-text-inverse);
  --av-danger: var(--color-status-danger);
  --av-success: var(--color-status-success);
  --av-warning: var(--color-status-warning);
  --av-info: var(--color-status-info);
  --av-critical: var(--color-status-critical);
  --av-neutral: var(--color-status-neutral);
  --av-popover: var(--av-elevated);
  --av-tooltip: var(--color-surface-overlay);

  /* Text / Foreground */
  --av-foreground: var(--color-text-primary);
  --av-text-primary: var(--color-text-primary);
  --av-card-foreground: var(--color-text-primary);
  --av-popover-foreground: var(--color-text-primary);
  --av-primary-foreground: var(--color-text-inverse);
  --av-muted-foreground: var(--color-text-secondary);
  --av-secondary-foreground: var(--color-text-secondary);
  --av-tertiary-foreground: var(--color-text-tertiary);
  --av-accent-foreground: var(--color-text-inverse);
  --av-text-inverse: var(--color-surface-primary);
  --av-brand-foreground: var(--color-brand-primary);`.trim();

  for (const line of semanticLines.split('\n')) {
    lines.push(line);
  }
  lines.push('');

  // Borders (derived from brand hue)
  const brandOklch = tokens.get('--av-brand-primary');
  const brandRgb = brandOklch ? oklchToRgb(brandOklch) : null;
  const brandHsl = brandRgb ? rgbToHsl(brandRgb.r, brandRgb.g, brandRgb.b) : [210, 8, 32];
  const borderH = brandHsl[0];

  lines.push('  /* Borders */');
  lines.push(`  --av-border: ${borderH} 8% 85%;`);
  lines.push(`  --av-separator: ${borderH} 8% 85%;`);
  lines.push(`  --av-input: ${borderH} 8% 85%;`);
  lines.push('  --av-border-strong: var(--color-brand-primary);');
  lines.push(`  --av-border-subtle: ${borderH} 6% 92%;`);
  lines.push('');

  // Fixed link
  lines.push('  /* Fixed Link */');
  lines.push('  --av-fixed-link: var(--color-brand-secondary);');
  const linkLightOklch = tokens.get('--av-fixed-link-light');
  if (linkLightOklch) {
    const converted = convertOklchValue(linkLightOklch, '--av-fixed-link-light');
    if (converted) lines.push(`  --av-fixed-link-light: ${converted.cssValue}; /* ${converted.comment} */`);
  }
  lines.push('');

  // Interactive
  lines.push('  /* Interactive Elements */');
  lines.push('  --av-interactive-default: var(--color-brand-primary);');
  for (const [srcName, targetVar] of [
    ['--av-primary-hover', '--av-interactive-hover'],
    ['--av-primary-active', '--av-interactive-active'],
  ] as const) {
    const oklch = tokens.get(srcName);
    if (oklch) {
      const converted = convertOklchValue(oklch, targetVar);
      if (converted) lines.push(`  ${targetVar}: ${converted.cssValue}; /* ${converted.comment} - ${srcName} */`);
    }
  }
  lines.push('  --av-interactive-disabled: var(--color-text-tertiary);');

  // Secondary hover/active
  for (const [srcName, targetVar] of [
    ['--av-secondary-hover', '--av-secondary-hover'],
    ['--av-secondary-active', '--av-secondary-active'],
    ['--av-solid-secondary-active', '--av-solid-secondary-active'],
  ] as const) {
    const oklch = tokens.get(srcName);
    if (oklch) {
      const converted = convertOklchValue(oklch, targetVar);
      if (converted) lines.push(`  ${targetVar}: ${converted.cssValue}; /* ${converted.comment} */`);
    }
  }

  lines.push('  --av-ring: var(--color-brand-primary);');
  lines.push('  --av-focus: var(--color-brand-primary);');
  lines.push('');

  // Scroll
  lines.push('  /* Scroll */');
  const scrollOklch = tokens.get('--av-scroll-thumb');
  if (scrollOklch) {
    const converted = convertOklchValue(scrollOklch, '--av-scroll-thumb');
    if (converted) lines.push(`  --av-scroll-thumb: ${converted.cssValue}; /* ${converted.comment} */`);
  }
  // scroll-thumb-inverse default (overridden per nav variant)
  lines.push('  --av-scroll-thumb-inverse: hsl(0 0% 100% / 0.4); /* default, overridden by nav variant */');
  lines.push('');

  // Status semantic
  lines.push('  /* Status Colors */');
  const statusBlock = `
  --av-status-success: var(--color-status-success);
  --av-status-success-bg: var(--color-status-success-light);
  --av-status-success-text: var(--color-status-success-dark);
  --av-status-info: var(--color-status-info);
  --av-status-info-bg: var(--color-status-info-light);
  --av-status-info-text: var(--color-status-info-dark);
  --av-status-warning: var(--color-status-warning);
  --av-status-warning-bg: var(--color-status-warning-light);
  --av-status-warning-text: var(--color-status-warning-dark);
  --av-status-danger: var(--color-status-danger);
  --av-status-danger-bg: var(--color-status-danger-light);
  --av-status-danger-text: var(--color-status-danger-dark);
  --av-status-critical: var(--color-status-critical);
  --av-status-critical-bg: var(--color-status-critical-light);
  --av-status-critical-text: var(--color-status-critical-dark);
  --av-status-neutral: var(--color-neutral);
  --av-status-neutral-bg: var(--color-neutral-light);
  --av-status-neutral-text: var(--color-neutral-dark);
  --av-status-ai: var(--color-ai);
  --av-status-ai-bg: var(--color-ai-light);
  --av-status-ai-text: var(--color-ai-dark);`.trim();
  for (const line of statusBlock.split('\n')) {
    lines.push(line);
  }
  lines.push('');

  // Nav defaults
  lines.push('  /* Nav defaults — overridden by nav-* variant mixins */');
  lines.push('  --av-nav-bg: 0 0% 20%;');
  lines.push('  --av-nav-text: 0 0% 100%;');
  lines.push('  --av-nav-text-light: hsl(0 0% 100% / 0.70);');
  lines.push('  --av-nav-text-active: 0 0% 100%;');
  lines.push('  --av-nav-active: 0 0% 40%;');
  lines.push('');

  // Radius
  lines.push('  /* Radius */');
  lines.push('  --av-radius: 0.25rem;');
  lines.push('');

  // Chart colors (hardcoded, not in brand JSONs)
  lines.push('  /* Chart Colors */');
  const chartLines = `
  --av-chart-1: oklch(64.6% 0.222 41.116deg);
  --av-chart-2: oklch(60% 0.118 184.704deg);
  --av-chart-3: oklch(39.8% 0.07 227.392deg);
  --av-chart-4: oklch(82.8% 0.189 84.429deg);
  --av-chart-5: oklch(76.9% 0.188 70.08deg);
  --av-chart-blue: oklch(52.7% 0.16 257.94deg);
  --av-chart-brown: oklch(60.6% 0.105 62.98deg);
  --av-chart-critical: oklch(73.4% 0.184 52.786deg);
  --av-chart-danger: oklch(61.7% 0.21 26.1deg);
  --av-chart-green: oklch(65.4% 0.11 189deg);
  --av-chart-grey: oklch(68.4% 0.01 257.94deg);
  --av-chart-info: var(--color-brand-secondary);
  --av-chart-light-blue: oklch(80.9% 0.09 240deg);
  --av-chart-neutral: oklch(90.6% 0 257.94deg);
  --av-chart-purple: oklch(71.4% 0.19 314.82deg);
  --av-chart-red: oklch(66.9% 0.184 23.483deg);
  --av-chart-success: oklch(75.9% 0.177 123.498deg);
  --av-chart-transparent: oklch(80.9% 0.09 240deg / 50%);
  --av-chart-turquoise: oklch(70.5% 0.13 230deg);
  --av-chart-violet: oklch(51.5% 0.09 299deg);
  --av-chart-warning: oklch(84.4% 0.17 84.9deg);
  --av-chart-yellow: oklch(84% 0.14 95deg);`.trim();
  for (const line of chartLines.split('\n')) {
    lines.push(line);
  }

  lines.push('}');
  lines.push('');

  // Dark mode mixin (shared, not derivable from source JSON)
  lines.push('@mixin theme-acronis-white-label-base-dark {');
  const darkBlock = `
  /* Backgrounds */
  --av-background: var(--color-text-primary);
  --av-elevated: 210 10% 23%;
  --av-muted: 210 10% 30%;
  --av-tooltip: 210 10% 25%;

  /* Text */
  --av-foreground: var(--color-surface-primary);
  --av-text-primary: var(--color-surface-primary);
  --av-secondary-foreground: 0 0% 70%;
  --av-tertiary-foreground: 0 0% 60%;
  --av-text-inverse: var(--color-text-primary);
  --av-brand-foreground: 210 16% 60%;

  /* Borders */
  --av-border: 210 10% 35%;
  --av-border-strong: 210 10% 40%;
  --av-border-subtle: 210 10% 25%;

  /* Interactive */
  --av-interactive-default: 210 16% 50%;
  --av-interactive-hover: 210 16% 42%;
  --av-interactive-active: 210 16% 50%;
  --av-interactive-disabled: 210 10% 40%;
  --av-focus: 210 16% 50%;

  /* Status backgrounds */
  --av-status-success-bg: 73 68% 20%;
  --av-status-success-text: var(--color-status-success-light);
  --av-status-info-bg: 211 82% 20%;
  --av-status-info-text: var(--color-status-info-light);
  --av-status-warning-bg: 45 100% 20%;
  --av-status-warning-text: var(--color-status-warning-light);
  --av-status-danger-bg: 0 77% 20%;
  --av-status-danger-text: var(--color-status-danger-light);
  --av-status-critical-bg: 25 100% 20%;
  --av-status-critical-text: var(--color-status-critical-light);
  --av-status-neutral-bg: 220 11% 25%;
  --av-status-neutral-text: var(--color-neutral-light);

  /* Chart Colors - Dark Mode */
  --av-chart-1: oklch(48.8% 0.243 264.376deg);
  --av-chart-2: oklch(69.6% 0.17 162.48deg);
  --av-chart-3: oklch(76.9% 0.188 70.08deg);
  --av-chart-4: oklch(62.7% 0.265 303.9deg);
  --av-chart-5: oklch(64.5% 0.246 16.439deg);`.trim();
  for (const line of darkBlock.split('\n')) {
    lines.push(`  ${line}`);
  }
  lines.push('}');

  return lines.join('\n');
}

function generateNavMixin(brandName: string, tokens: TokenMap): string {
  const mixinName = `nav-${brandName}`;
  const lines: string[] = [];

  lines.push(`/** Nav variant: ${brandName} (auto-generated) */`);
  lines.push(`@mixin ${mixinName} {`);

  for (const [srcVar, targetVar] of Object.entries(NAV_TOKEN_MAP)) {
    const oklchVal = tokens.get(srcVar);
    if (!oklchVal) {
      lines.push(`  /* MISSING: ${srcVar} → ${targetVar} */`);
      continue;
    }

    const converted = convertOklchValue(oklchVal, targetVar);
    if (!converted) continue;

    lines.push(`  ${targetVar}: ${converted.cssValue}; /* ${converted.comment} */`);
  }

  // Brand-specific extra overrides
  const overrides = BRAND_OVERRIDES[brandName];
  if (overrides) {
    for (const [targetVar, srcVar] of Object.entries(overrides)) {
      // Skip if already handled in NAV_TOKEN_MAP
      if (Object.values(NAV_TOKEN_MAP).includes(targetVar)) continue;

      const oklchVal = tokens.get(srcVar);
      if (!oklchVal) continue;
      const converted = convertOklchValue(oklchVal, targetVar);
      if (!converted) continue;
      lines.push(`  /* ${brandName}-specific override */`);
      lines.push(`  ${targetVar}: ${converted.cssValue}; /* ${converted.comment} */`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

function generateThemeClasses(brands: string[]): string {
  const lines: string[] = [];

  lines.push('/* ============================================');
  lines.push('   THEME CLASSES (auto-generated)');
  lines.push('   Each brand is a standalone theme class.');
  lines.push('   ============================================ */');
  lines.push('');

  for (const brand of brands) {
    lines.push(`.theme-${brand} {`);
    lines.push('  @include theme-acronis-white-label-base;');
    lines.push(`  @include nav-${brand};`);
    lines.push('  &.dark { @include theme-acronis-white-label-base-dark; }');
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (!existsSync(UI_SYNTAX_BRANDS_DIR)) {
    console.error(`\u274C ui-syntax brands not found at: ${UI_SYNTAX_BRANDS_DIR}`);
    console.error('   Expected sibling repo layout: <parent>/shadcn-uikit + <parent>/ui-syntax');
    console.error('   Update UI_SYNTAX_BRANDS_DIR in this script if your checkout is elsewhere.');
    process.exit(1);
  }

  // Read all brand JSON files
  const brandFiles = readdirSync(UI_SYNTAX_BRANDS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ name: basename(f, '.json'), path: join(UI_SYNTAX_BRANDS_DIR, f) }))
    .filter(f => !EXCLUDED_BRANDS.includes(f.name));

  console.log(`Found ${brandFiles.length} brand files in ui-syntax`);

  // Determine which brands to generate
  const availableBrands = new Set(brandFiles.map(f => f.name));
  const brandsToGenerate = BRAND_ORDER.filter(b => availableBrands.has(b));
  const missing = BRAND_ORDER.filter(b => !availableBrands.has(b));
  if (missing.length) {
    console.warn(`Missing brands: ${missing.join(', ')}`);
  }

  // Read reference brand for base tokens
  const refFile = brandFiles.find(f => f.name === REFERENCE_BRAND);
  if (!refFile) {
    console.error(`Reference brand "${REFERENCE_BRAND}" not found`);
    process.exit(1);
  }
  const refTokens = readBrandTokens(refFile.path);
  console.log(`Read reference brand "${REFERENCE_BRAND}" (${refTokens.size} tokens)`);

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });

  // Build single file content
  const parts: string[] = [];

  parts.push('/**');
  parts.push(' * Acronis White-Label Theme (auto-generated)');
  parts.push(' *');
  parts.push(' * DO NOT EDIT — generated by scripts/generate-white-label-themes.ts');
  parts.push(' * Source: ui-syntax/packages/tokens/src/tokens/brands/*.json');
  parts.push(' *');
  parts.push(' * Each partner brand is a standalone .theme-{brand} CSS class.');
  parts.push(' * All classes share the same base/dark tokens and differ only in nav colors.');
  parts.push(' */');
  parts.push('');

  // Base + dark mixins
  parts.push(generateBaseMixin(refTokens));
  parts.push('');

  // Nav mixins (all inline)
  for (const brand of brandsToGenerate) {
    const brandFile = brandFiles.find(f => f.name === brand)!;
    const brandTokens = readBrandTokens(brandFile.path);
    parts.push(generateNavMixin(brand, brandTokens));
    parts.push('');
  }
  console.log(`Generated base + ${brandsToGenerate.length} nav mixins`);

  // Theme classes
  parts.push(generateThemeClasses(brandsToGenerate));

  writeFileSync(OUTPUT_FILE, parts.join('\n') + '\n');

  console.log(`\nGenerated: ${OUTPUT_FILE}`);
  console.log(`Brands: ${brandsToGenerate.join(', ')}`);
}

main();
