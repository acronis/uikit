import type { KitRule } from '../types';

export const crossImplRules = [
  {
    id: 'cross-impl/variant-coverage',
    title: 'Variant coverage matches references',
    category: 'cross-impl',
    severity: 'should',
    rule: 'A ui-react component should cover the variant/prop surface of its legacy and Figma counterparts (or document an intentional gap).',
    rationale: 'Silently dropping a variant during a port leaves consumers without a needed option.',
    checklist: 'X1',
    detector: 'ref/variant-diff',
  },
  {
    id: 'cross-impl/token-value-drift',
    title: 'No token-value drift vs Figma',
    category: 'cross-impl',
    severity: 'must',
    rule: 'Token values in tokens-pd must match their Figma source of truth.',
    rationale: 'Figma-vs-tokens-pd value drift is a recurring defect (hit on the Button work).',
    checklist: 'X2',
    detector: 'ref/figma-token-diff',
  },
  {
    id: 'cross-impl/component-coverage',
    title: 'Component coverage vs references',
    category: 'cross-impl',
    severity: 'may',
    rule: 'Track components present in a reference (legacy / Vue kit) but missing here, so the backlog is explicit.',
    rationale: 'Coverage gaps should be visible and intentional, not discovered late.',
    checklist: 'X3',
    detector: 'ref/component-diff',
  },
] satisfies KitRule[];
