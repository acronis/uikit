// Self-contained verification for the no-adhoc-sheet rule — no test framework.
// Run: node tools/eslint-rules/__tests__/no-adhoc-sheet.test.mjs
import assert from 'node:assert';
import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import rule from '../no-adhoc-sheet.js';

const tsParser = tseslint.parser;

const linter = new Linter();
const config = {
  files: ['**/*.tsx'],
  plugins: { local: { rules: { 'no-adhoc-sheet': rule } } },
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  rules: { 'local/no-adhoc-sheet': 'error' },
};

const lint = (code) => linter.verify(code, config, { filename: 'x.tsx' });

// INVALID — the hand-rolled fixed side-panel shape (fixed + edge-0 + z-)
const bad = [
  'const A = () => <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white">x</div>;',
  'const B = () => <aside className="fixed left-0 top-0 z-[100] h-full">x</aside>;',
];
for (const code of bad) {
  const msgs = lint(code);
  assert.equal(msgs.length, 1, `expected 1 report for: ${code}\n${JSON.stringify(msgs)}`);
  assert.equal(msgs[0].messageId, 'adhocSheet');
}

// VALID — not the modal-panel shape, or a real component
const good = [
  'const C = () => <div className="fixed bottom-4 right-4 z-[100]">toast</div>;', // edge-4, not edge-0
  'const D = () => <div className="flex right-0 z-50">x</div>;', // not fixed
  'const E = () => <div className="fixed inset-y-0 right-0 w-96">x</div>;', // no z-
  'const F = () => <SheetContent className="fixed inset-y-0 right-0 z-50">x</SheetContent>;', // a component, not a host element
];
for (const code of good) {
  const msgs = lint(code);
  assert.equal(msgs.length, 0, `expected 0 reports for: ${code}\n${JSON.stringify(msgs)}`);
}

console.log('no-adhoc-sheet: all assertions passed (2 invalid flagged, 4 valid clean)');
