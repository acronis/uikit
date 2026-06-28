// .tmp/scripts/lib/tree.mjs
// Generic DTCG tree ops: path-set, color-leaf collector, sorter, reorderer.
//
// Examples:
//   const obj = {};
//   setPath(obj, ["a", "b", "c"], 42);
//   // obj === { a: { b: { c: 42 } } }
//
//   collectColorLeaves({
//     Blue: { "Blue-3": { $type: "color", $value: "#D6E4F5" } },
//   })
//   // → [{ path: ["Blue", "Blue-3"], leaf: { $type, $value } }]
//
//   sortNode({ b: 1, $type: "x", a: 2 })
//   // → { $type: "x", a: 2, b: 1 }       // meta keys first, then alpha
//   sortNode({ "10": 1, "2": 2 })
//   // → { "2": 2, "10": 1 }              // all-numeric group → numeric sort
//
//   reorderByList({ b: 1, a: 2, c: 3 }, ["a", "b"])
//   // → { a: 2, b: 1, c: 3 }             // listed keys first, others trailing

export function setPath(obj, p, value) {
  let cur = obj;
  for (let i = 0; i < p.length - 1; i++) {
    const k = p[i];
    if (cur[k] === undefined) cur[k] = {};
    cur = cur[k];
  }
  cur[p[p.length - 1]] = value;
}

export function collectColorLeaves(node, base = []) {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && v.$type === 'color') {
      out.push({ path: [...base, k], leaf: v });
    } else if (v && typeof v === 'object') {
      out.push(...collectColorLeaves(v, [...base, k]));
    }
  }
  return out;
}

const META_ORDER = ['$schema', '$extensions', '$type', '$value'];

export function sortNode(node) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return node;
  const keys = Object.keys(node);
  const allNumeric = keys.length > 0 && keys.every(k => /^\d+$/.test(k));
  keys.sort(allNumeric
    ? (a, b) => Number(a) - Number(b)
    : (a, b) => {
        const ai = META_ORDER.indexOf(a), bi = META_ORDER.indexOf(b);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return a.localeCompare(b);
      });
  const sorted = {};
  for (const k of keys) sorted[k] = sortNode(node[k]);
  return sorted;
}

export function reorderByList(obj, list) {
  const o = {};
  for (const k of list) if (k in obj) o[k] = obj[k];
  for (const k of Object.keys(obj)) if (!(k in o)) o[k] = obj[k];
  return o;
}
