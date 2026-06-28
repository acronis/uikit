// .tmp/scripts/lib/format.mjs
// Mixed-layout DTCG JSON formatter shared by the generator scripts.
//
// Layout rules:
//   - top-level + group nodes  → multi-line
//   - keys in `expandKeys`     → always multi-line
//   - $extensions etc.         → multi-line when long, inline when short
//   - integer-like keys come AFTER metaFirst keys (JS would otherwise hoist them)
// The $schema-bearing root is forced multi-line via `alwaysExpandIfHas`.
//
// Example output for a palette leaf:
//   "3": {
//     "values": {
//       "dark":  { "colorSpace": "hsl", "components": [215, 90, 25] },
//       "light": { "colorSpace": "hsl", "components": [213, 61, 90] }
//     },
//     "platforms": ["PD"],
//     "$extensions": {
//       "com.figma.scopes": [],
//       "com.figma.variableId": "VariableID:99:1932"
//     }
//   }
// Note how `values` and `$extensions` always break across lines (expandKeys),
// even on a short scalar leaf. The contents of each $extensions entry (e.g.
// `com.acronis.units: {...}`) stay inline.

const DEFAULTS = {
  lineLimit: 250,
  // Top-level `values` (multi-mode dict) is always multi-line so each mode reads on its
  // own line. `$value` is always multi-line so typography composite tokens read
  // field-per-line. `$extensions` is always multi-line so each extension key
  // (com.acronis.units, com.figma.variableId, …) reads on its own line.
  expandKeys: new Set(['values', '$value', '$extensions']),
  alwaysExpandIfHas: new Set(['$schema']),
  metaFirst: ['$schema', '$type', '$description', '$value', 'values', 'platforms', '$extensions'],
};

export function formatDtcgJson(obj, opts = {}) {
  const cfg = { ...DEFAULTS, ...opts };
  return format(obj, 0, false, cfg);
}

function format(obj, indent, forceExpand, cfg) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(x => format(x, indent + 2, false, cfg)).join(', ') + ']';
  const rawKeys = Object.keys(obj);
  const meta = cfg.metaFirst.filter(k => rawKeys.includes(k));
  const rest = rawKeys.filter(k => !cfg.metaFirst.includes(k));
  const keys = [...meta, ...rest];
  if (keys.length === 0) return '{}';
  const fmtChild = k => format(obj[k], indent + 2, cfg.expandKeys.has(k), cfg);
  const compactBody = keys.map(k => `${JSON.stringify(k)}: ${fmtChild(k)}`).join(', ');
  const compact = '{ ' + compactBody + ' }';
  const hasExpandTrigger = keys.some(k => cfg.alwaysExpandIfHas.has(k));
  // If any child rendering is multi-line (e.g. an expandKeys member), the
  // parent must also break to multi-line — otherwise we get a hybrid layout
  // with a `{` followed by an inline newline.
  const childIsMultiLine = compact.includes('\n');
  if (!forceExpand && !hasExpandTrigger && !childIsMultiLine && compact.length + indent <= cfg.lineLimit) return compact;
  const inner = keys.map(k => ' '.repeat(indent + 2) + `${JSON.stringify(k)}: ${fmtChild(k)}`).join(',\n');
  return '{\n' + inner + '\n' + ' '.repeat(indent) + '}';
}
