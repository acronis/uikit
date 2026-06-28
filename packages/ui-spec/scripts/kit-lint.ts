/**
 * kit-lint — static cross-component consistency detectors (Phase 1).
 *
 * Scans the shipped `@acronis-platform/ui-react` component source for the
 * `kit-lint`-detectable rows of the grammar checklist and reports findings keyed
 * by rule id + severity. `must` findings are defects (the test + CLI fail on
 * them); `should`/`may` are warnings.
 *
 * Run:   pnpm --filter @acronis-platform/ui-spec kit-lint
 * Design: context/kit-consistency-audit-proposal.md  ·  rules: ../grammar
 *
 * Detectors are added over the rollout; a grammar rule whose `detector` is not
 * implemented here yet is simply not enforced (no false confidence).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getRule } from '../grammar';
import type { RuleSeverity } from '../grammar';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '../../..');
const UI_DIR = resolve(REPO, 'packages/ui-react/src/components/ui');
const STYLES = resolve(REPO, 'packages/ui-react/src/styles/index.css');

export interface Finding {
  ruleId: string;
  checklist: string;
  severity: RuleSeverity;
  file: string; // repo-relative
  line: number;
  message: string;
}

/** Color-bearing Tailwind utility prefixes (used by the token detectors). */
const COLOR_PREFIXES =
  'bg|text|border|ring|fill|stroke|from|to|via|divide|outline|decoration|caret|shadow';

/** Color names known to have NO ui-react bridge (silent-invalid traps). */
const UNBRIDGED_DENYLIST = new Set(['card', 'popover']);

/** Recursively collect shipped component source files (no stories/tests/figma). */
function componentFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__stories__' || entry.name === '__tests__') continue;
      out.push(...componentFiles(full));
    } else if (
      entry.name.endsWith('.tsx') &&
      !entry.name.endsWith('.figma.tsx') &&
      !entry.name.endsWith('.stories.tsx') &&
      !entry.name.endsWith('.test.tsx')
    ) {
      out.push(full);
    }
  }
  return out;
}

/** Blank out comments while preserving line numbers, so detectors ignore prose. */
function stripComments(src: string): string {
  const noBlock = src.replace(/\/\*[\s\S]*?\*\//g, (m) =>
    m.replace(/[^\n]/g, ' ')
  );
  return noBlock
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, ''))
    .join('\n');
}

function bridgedColorNames(): Set<string> {
  const css = readFileSync(STYLES, 'utf8');
  const names = new Set<string>();
  for (const m of css.matchAll(/--color-([a-z][a-z-]*)/g)) names.add(m[1]);
  return names;
}

type Detector = (ctx: {
  file: string;
  lines: string[];
  bridged: Set<string>;
}) => Finding[];

function finding(ruleId: string, file: string, line: number, message: string): Finding {
  const rule = getRule(ruleId);
  if (!rule) throw new Error(`kit-lint references unknown rule "${ruleId}"`);
  return { ruleId, checklist: rule.checklist, severity: rule.severity, file, line, message };
}

const DETECTORS: Detector[] = [
  // T1 — no hard-coded color (hex / rgb() / hsl()). Excludes attribute-selector
  // hex like `[stroke='#ccc']` (recharts re-theming), keeps arbitrary values
  // like `bg-[#fff]`.
  ({ file, lines }) => {
    const out: Finding[] = [];
    const hex = /(?<!=['"])#[0-9a-fA-F]{3,8}\b/g;
    const func = /\b(?:rgba?|hsla?)\(/g;
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(hex))
        out.push(finding('tokens/no-hardcoded-color', file, i + 1, `hard-coded color "${m[0]}" — use a --ui-* token`));
      for (const m of raw.matchAll(func))
        out.push(finding('tokens/no-hardcoded-color', file, i + 1, `hard-coded color "${m[0]}…" — use a --ui-* token`));
    });
    return out;
  },

  // T2 — unbridged color name (silent invalid). Flags a color utility whose name
  // is unambiguously a color (a `*-foreground` or a denylisted name) but is not
  // present in the ui-react @theme bridge.
  ({ file, lines, bridged }) => {
    const out: Finding[] = [];
    const re = new RegExp(`\\b(?:${COLOR_PREFIXES})-([a-z][a-z-]*)\\b`, 'g');
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re)) {
        const name = m[1];
        const isColor = name.endsWith('-foreground') || UNBRIDGED_DENYLIST.has(name);
        if (isColor && !bridged.has(name))
          out.push(finding('tokens/no-unbridged-name', file, i + 1, `"${m[0]}" — color name "${name}" is not bridged in ui-react @theme (silent invalid); use a --ui-* token`));
      }
    });
    return out;
  },

  // T3 — opacity-modifier color hack (`bg-primary/90`).
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = new RegExp(`\\b(?:${COLOR_PREFIXES})-[a-z][a-z-]*/[0-9]{1,3}\\b`, 'g');
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re))
        out.push(finding('tokens/no-opacity-color-hack', file, i + 1, `opacity hack "${m[0]}" — wire a dedicated *-hover/*-active/*-disabled token`));
    });
    return out;
  },

  // Z1 — off-grid arbitrary spacing (literal px not a multiple of 4).
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = /\b(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-\[(\d+(?:\.\d+)?)px\]/g;
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re)) {
        const px = Number(m[1]);
        if (px % 4 !== 0)
          out.push(finding('spacing/on-grid', file, i + 1, `off-grid spacing "${m[0]}" (${px}px not a 4px multiple)`));
      }
    });
    return out;
  },
];

export function runKitLint(): Finding[] {
  const bridged = bridgedColorNames();
  const findings: Finding[] = [];
  for (const file of componentFiles(UI_DIR)) {
    const rel = relative(REPO, file);
    const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
    for (const detect of DETECTORS) findings.push(...detect({ file: rel, lines, bridged }));
  }
  return findings;
}

export function formatReport(findings: Finding[]): string {
  if (findings.length === 0) return 'kit-lint: no findings ✓';
  const order: RuleSeverity[] = ['must', 'should', 'may'];
  const lines: string[] = [];
  for (const sev of order) {
    const group = findings.filter((f) => f.severity === sev);
    if (!group.length) continue;
    lines.push(`\n${sev.toUpperCase()} (${group.length})`);
    for (const f of group)
      lines.push(`  [${f.checklist} ${f.ruleId}] ${f.file}:${f.line} — ${f.message}`);
  }
  const must = findings.filter((f) => f.severity === 'must').length;
  lines.push(`\n${findings.length} finding(s); ${must} must.`);
  return lines.join('\n');
}

// CLI: print the report; exit non-zero on any `must` finding.
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const findings = runKitLint();
  process.stdout.write(formatReport(findings) + '\n');
  process.exit(findings.some((f) => f.severity === 'must') ? 1 : 0);
}
