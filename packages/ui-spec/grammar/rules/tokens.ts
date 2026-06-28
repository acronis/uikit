import type { KitRule } from '../types';

export const tokenRules = [
  {
    id: 'tokens/no-hardcoded-color',
    title: 'No hard-coded colors',
    category: 'tokens',
    severity: 'must',
    rule: 'Every color must resolve to a generated `--ui-*` token. Never write a hex/hsl/rgb literal in a component.',
    rationale:
      'Brand and theme overrides only honor `--ui-*` tokens; a literal silently ignores them and drifts from the palette.',
    checklist: 'T1',
    detector: 'kit-lint/no-hardcoded-color',
  },
  {
    id: 'tokens/no-unbridged-name',
    title: 'No unbridged Tailwind color names',
    category: 'tokens',
    severity: 'must',
    rule: 'A bridged Tailwind color name (e.g. `bg-card`) may only be used if it is bridged in the ui-react `@theme inline` block; otherwise use a real `--ui-*` token or bridge it.',
    rationale:
      'An unbridged name compiles to `var(--color-<x>)` with `--color-<x>` undefined — a silent invalid property that falls back to inherited color.',
    checklist: 'T2',
    detector: 'kit-lint/bridged-name-exists',
    relatedRules: ['tokens/no-hardcoded-color'],
  },
  {
    id: 'tokens/no-opacity-color-hack',
    title: 'No opacity-modifier color hacks',
    category: 'tokens',
    severity: 'should',
    rule: 'Do not derive a state color with an opacity modifier (`bg-primary/90`); wire each interaction state to its own `*-hover`/`*-active`/`*-disabled` token.',
    rationale:
      'Opacity hacks are not theme-controllable and another brand may define a distinct per-state value.',
    checklist: 'T3',
    detector: 'kit-lint/no-opacity-color',
    relatedRules: ['tokens/state-token-wiring'],
  },
  {
    id: 'tokens/state-token-wiring',
    title: 'States use their own tokens',
    category: 'tokens',
    severity: 'should',
    rule: 'Each interaction state references its matching token: `hover:` → `*-hover`, `active:` → `*-active`, `disabled:` → `*-disabled` — even when the default brand value matches idle.',
    rationale:
      'Only the referenced token is honored by brand overrides; reusing the idle token hides per-state brand values.',
    checklist: 'T4',
    detector: 'kit-lint/state-token-wiring',
  },
  {
    id: 'tokens/one-token-per-role',
    title: 'One token per semantic role',
    category: 'tokens',
    severity: 'must',
    rule: 'A given semantic role (danger background, brand action, surface, border, on-status text…) must resolve to the same `--ui-*` token across every component.',
    rationale:
      'Two tokens for one role is the most common source of "two slightly different reds" — the defining symptom of an incoherent kit.',
    checklist: 'T5',
    detector: 'screen/role-token-map',
    relatedRules: ['composition/variant-parity'],
  },
  {
    id: 'tokens/no-dangling-var',
    title: 'No dangling token references',
    category: 'tokens',
    severity: 'must',
    rule: 'Every `var(--ui-*)` referenced in a component (and listed in its spec tokens.yaml) must be defined in tokens-pd.',
    rationale:
      'A missing CSS var is a silent failure — the property is invalid and the element falls back to inherited color.',
    checklist: 'T6',
    detector: 'spec/token-resolve',
  },
] satisfies KitRule[];
