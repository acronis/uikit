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
 *
 * Implemented: T1/T2 (must), T3/T4/Z1/Y1/Y2/Y3 (should), I3 (may). Deferred:
 * A1 focus-ring + C5 z-index (must — need a ratified canonical / layer scale +
 * overrides before they can block CI on real variation), Z5 touch-target (not
 * reliably static), A3 border-border (pending a bare-`border` audit).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getRule } from '../grammar';
import type { RuleSeverity } from '../grammar';
import { applyOverrides } from '../grammar/overrides';
import type { KitOverride, OverrideTarget } from '../grammar/overrides';

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

  // T4 — interaction state wired to the wrong token. A `hover:`/`active:`/
  // `focus:`/`disabled:` color utility must reference a token whose trailing
  // suffix matches that state. Flag a base token (`-idle`/`-default`/`-base`/
  // `-normal`) or a *different* state's token under a state variant. Tokens with
  // no state suffix (e.g. a semantic `-primary`) are left alone.
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = new RegExp(
      `\\b(hover|active|focus|disabled):(?:${COLOR_PREFIXES})-\\[var\\((--ui-[a-z0-9-]+)\\)\\]`,
      'g'
    );
    const STATES = ['hover', 'active', 'focus', 'disabled'];
    const BASE = ['idle', 'default', 'base', 'normal'];
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re)) {
        const state = m[1];
        const token = m[2];
        const suffix = [...BASE, ...STATES].find((s) => token.endsWith(`-${s}`));
        if (!suffix) continue; // no state semantics in the token name → fine
        if (BASE.includes(suffix) || suffix !== state)
          out.push(finding('tokens/state-token-wiring', file, i + 1, `"${state}:" wired to "${token}" — reference the matching *-${state} token`));
      }
    });
    return out;
  },

  // Y1 — off-scale arbitrary font size (text-[<number><unit>], not a token).
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = /\btext-\[(\d+(?:\.\d+)?)(px|rem|em)\]/g;
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re))
        out.push(finding('typography/type-scale', file, i + 1, `off-scale font size "${m[0]}" — use a type-scale token/utility`));
    });
    return out;
  },

  // Y2 — line-height off the ramp (arbitrary leading-[<number>], not a token).
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = /\bleading-\[(\d+(?:\.\d+)?)\]/g;
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re))
        out.push(finding('typography/line-height', file, i + 1, `off-ramp line-height "${m[0]}" — use a line-height token/utility`));
    });
    return out;
  },

  // Y3 — font-weight outside the allowed set (arbitrary numeric font-[NNN]).
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = /\bfont-\[(\d{2,3})\]/g;
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re))
        out.push(finding('typography/font-weight', file, i + 1, `arbitrary font-weight "${m[0]}" — use a named weight (font-normal/medium/semibold)`));
    });
    return out;
  },

  // I3 — hover/transition timing drift (arbitrary duration-[<n>ms], not a scale step).
  ({ file, lines }) => {
    const out: Finding[] = [];
    const re = /\bduration-\[(\d+)m?s\]/g;
    lines.forEach((raw, i) => {
      for (const m of raw.matchAll(re))
        out.push(finding('interaction/timing-parity', file, i + 1, `arbitrary transition duration "${m[0]}" — use a duration scale step (duration-150/200/300)`));
    });
    return out;
  },
];

/** Run every detector over one source string. Exposed for focused tests. */
export function lintSource(
  file: string,
  src: string,
  bridged: Set<string> = new Set()
): Finding[] {
  const lines = stripComments(src).split('\n');
  const out: Finding[] = [];
  for (const detect of DETECTORS) out.push(...detect({ file, lines, bridged }));
  return out;
}

/** Component dir name from a repo-relative source path (the override scope key). */
function componentOf(file: string): string | undefined {
  return file.match(/components\/ui\/([^/]+)\//)?.[1];
}

const kitTarget = (f: Finding): OverrideTarget => ({
  ruleId: f.ruleId,
  file: f.file,
  component: componentOf(f.file),
});

/** All raw findings, before approved overrides are applied. */
export function collectFindings(): Finding[] {
  const bridged = bridgedColorNames();
  const findings: Finding[] = [];
  for (const file of componentFiles(UI_DIR)) {
    findings.push(
      ...lintSource(relative(REPO, file), readFileSync(file, 'utf8'), bridged)
    );
  }
  return findings;
}

/** Findings split into active vs. suppressed by an approved override. */
export function auditKitLint(
  opts: { overrides?: KitOverride[]; today?: string } = {}
): { active: Finding[]; suppressed: Finding[] } {
  return applyOverrides(collectFindings(), kitTarget, opts);
}

/** The active findings (approved overrides removed) — what gates CI. */
export function runKitLint(
  opts: { overrides?: KitOverride[]; today?: string } = {}
): Finding[] {
  return auditKitLint(opts).active;
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
  const today = new Date().toISOString().slice(0, 10);
  const { active, suppressed } = auditKitLint({ today });
  let report = formatReport(active);
  if (suppressed.length)
    report += `\n${suppressed.length} suppressed by approved override(s).`;
  process.stdout.write(report + '\n');
  process.exit(active.some((f) => f.severity === 'must') ? 1 : 0);
}
