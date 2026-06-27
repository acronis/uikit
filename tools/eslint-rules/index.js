/**
 * Local ESLint plugin for Acronis UI-Kit usage-pattern enforcement.
 *
 * The seed of an eventual `@acronis-platform/eslint-plugin-patterns`: each rule
 * encodes one approved-pattern anti-pattern (from `packages/ui-spec/patterns/`),
 * so AI and humans get steered to the sanctioned composition instead of
 * re-inventing it. Wired into the root `eslint.config.js`.
 */
import noAdhocSheet from './no-adhoc-sheet.js';

export default {
  meta: { name: 'acronis-patterns' },
  rules: {
    'no-adhoc-sheet': noAdhocSheet,
  },
};
