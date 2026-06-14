// .claude/skills/figma-to-design-tokens/helpers/diff-reporter.mjs
// Formats DiffEngine results as a human-readable stdout report and a
// structured JSON file at snapshot/figma-diff-report.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ChangeType } from './diff-engine.mjs';

const SNAPSHOT_DIR = fileURLToPath(new URL('../snapshot/', import.meta.url));
const REPORT_PATH = path.join(SNAPSHOT_DIR, 'figma-diff-report.json');

// Display order and labels for change types.
const DISPLAY_ORDER = [
  ChangeType.TOKEN_ADDED,
  ChangeType.TOKEN_DELETED,
  ChangeType.VALUE_CHANGED,
  ChangeType.MODE_VALUE_CHANGED,
  ChangeType.TYPE_CHANGED,
  ChangeType.SCOPES_CHANGED,
  ChangeType.HIDDEN_CHANGED,
  ChangeType.EXTENSION_ADDED,
  ChangeType.EXTENSION_REMOVED,
  ChangeType.EXTENSION_VALUE_CHANGED,
  ChangeType.STYLE_ADDED,
  ChangeType.STYLE_DELETED,
  ChangeType.STYLE_CHANGED,
  ChangeType.UNCLASSIFIED,
];

export class DiffReporter {
  #changes;

  constructor(changes) {
    this.#changes = changes;
  }

  // Print human-readable report to stdout.
  print(tierFilter = null) {
    const changes = tierFilter
      ? this.#changes.filter(c => {
          if (c.tier) return c.tier === tierFilter;
          if (c.inferredTier) return c.inferredTier === tierFilter;
          return true; // no tier info — show in all views (e.g. STYLE_*)
        })
      : this.#changes;

    if (changes.length === 0) {
      console.log('No differences found between snapshot and tiers.');
      return;
    }

    const byType = this.#groupByType(changes);
    for (const type of DISPLAY_ORDER) {
      const group = byType.get(type);
      if (!group?.length) continue;
      console.log(`\n── ${type} (${group.length}) ${'─'.repeat(Math.max(0, 60 - type.length - String(group.length).length - 7))}`);
      for (const c of group) {
        console.log(this.#formatChange(c));
      }
    }

    console.log(`\n── SUMMARY ${'─'.repeat(51)}`);
    console.log(`Total: ${changes.length} change(s)`);
    for (const type of DISPLAY_ORDER) {
      const n = (byType.get(type) ?? []).length;
      if (n > 0) console.log(`  ${type}: ${n}`);
    }
  }

  // Write structured JSON report to snapshot/.
  writeJson() {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    const report = {
      totalChanges: this.#changes.length,
      summary: Object.fromEntries(
        DISPLAY_ORDER.map(t => [t, this.#changes.filter(c => c.type === t).length])
          .filter(([, n]) => n > 0)
      ),
      changes: this.#changes,
    };
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
    return REPORT_PATH;
  }

  get reportPath() { return REPORT_PATH; }

  #groupByType(changes) {
    const map = new Map();
    for (const c of changes) {
      if (!map.has(c.type)) map.set(c.type, []);
      map.get(c.type).push(c);
    }
    return map;
  }

  #formatChange(c) {
    const tier = c.tier ? `[${c.tier}]` : '';
    const ourPath = c.ourPath?.join('.') ?? '—';
    const figmaPath = c.figmaPath?.join('.') ?? '—';

    switch (c.type) {
      case ChangeType.TOKEN_ADDED: {
        const hint = c.inferredTier ? ` → ${c.inferredTier}` : '';
        return `  + ${figmaPath} (${c.variableId})${hint}`;
      }
      case ChangeType.TOKEN_DELETED:
        return `  - ${tier} ${ourPath} (${c.variableId})`;
      case ChangeType.VALUE_CHANGED:
        return `  ~ ${tier} ${ourPath}\n    from: ${JSON.stringify(c.from)}\n    to:   ${JSON.stringify(c.to)}`;
      case ChangeType.MODE_VALUE_CHANGED:
        return `  ~ ${tier} ${ourPath} [mode:${c.mode}]\n    from: ${JSON.stringify(c.from)}\n    to:   ${JSON.stringify(c.to)}`;
      case ChangeType.TYPE_CHANGED:
        return `  ~ ${tier} ${ourPath}  $type: ${c.from} → ${c.to}`;
      case ChangeType.SCOPES_CHANGED:
        return `  ~ ${tier} ${ourPath}  scopes: [${c.from}] → [${c.to}]`;
      case ChangeType.HIDDEN_CHANGED:
        return `  ~ ${tier} ${ourPath}  hiddenFromPublishing: ${c.from} → ${c.to}`;
      case ChangeType.EXTENSION_ADDED:
        return `  + ${tier} ${ourPath}  $extensions.${c.key} = ${JSON.stringify(c.value)}`;
      case ChangeType.EXTENSION_REMOVED:
        return `  - ${tier} ${ourPath}  $extensions.${c.key} (was: ${JSON.stringify(c.value)})`;
      case ChangeType.EXTENSION_VALUE_CHANGED:
        return `  ~ ${tier} ${ourPath}  $extensions.${c.key}\n    from: ${JSON.stringify(c.from)}\n    to:   ${JSON.stringify(c.to)}`;
      case ChangeType.STYLE_ADDED:
        return `  + style ${c.styleId} — ${c.style?.name ?? ''}`;
      case ChangeType.STYLE_DELETED:
        return `  - style ${tier} ${ourPath} (${c.styleId})`;
      case ChangeType.STYLE_CHANGED:
        return `  ~ style ${c.styleId}: ${c.changes?.map(d => `${d.field}: ${d.from} → ${d.to}`).join(', ')}`;
      case ChangeType.UNCLASSIFIED:
        return `  ? ${tier} ${ourPath} (${c.variableId}) — unclassified change\n    snapshot: ${JSON.stringify(c.snapshot)}\n    tiers:    ${JSON.stringify(c.tiers)}`;
      default:
        return `  ${c.type}: ${JSON.stringify(c)}`;
    }
  }
}
