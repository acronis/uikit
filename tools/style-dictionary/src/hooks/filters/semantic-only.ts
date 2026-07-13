// Filter: keep only the semantic + component tiers in CSS output. The primitive
// roots (`palette`, `units`, `font`) are resolution inputs that aliases point
// at — they must be present in the token set but never emitted as variables.

import type { Filter } from 'style-dictionary/types';

export const SEMANTIC_ONLY = 'semantic-only';

/** Token-tree roots that are resolution inputs only — never emitted as CSS. */
const PRIMITIVE_ROOTS = new Set(['palette', 'units', 'font', 'branding']);

/** True when a token belongs to an emitted tier (not a primitive resolution input). */
export const isEmittableToken = (token: { path: string[] }): boolean =>
  !PRIMITIVE_ROOTS.has(token.path[0]);

export const semanticOnly: Filter = {
  name: SEMANTIC_ONLY,
  filter: (token) => isEmittableToken(token),
};
