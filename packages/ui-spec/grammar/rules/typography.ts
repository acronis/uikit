import type { KitRule } from '../types';

export const typographyRules = [
  {
    id: 'typography/type-scale',
    title: 'Font sizes on the scale',
    category: 'typography',
    severity: 'should',
    rule: 'Font sizes must come from the type scale (a token), not arbitrary values.',
    rationale: 'An off-scale size breaks the typographic hierarchy shared across screens.',
    checklist: 'Y1',
    detector: 'kit-lint/font-size-scale',
  },
  {
    id: 'typography/line-height',
    title: 'Line-height on the ramp',
    category: 'typography',
    severity: 'should',
    rule: 'Line-height comes from the defined ramp (body ~1.5, headings tighter, single-line fixed).',
    rationale: 'Inconsistent line-height changes vertical rhythm between text blocks.',
    checklist: 'Y2',
    detector: 'kit-lint/line-height-ramp',
  },
  {
    id: 'typography/font-weight',
    title: 'Allowed font weights only',
    category: 'typography',
    severity: 'should',
    rule: 'Use only the allowed weight set (regular/medium/bold).',
    rationale: 'Stray weights read as off-brand and complicate the font payload.',
    checklist: 'Y3',
    detector: 'kit-lint/font-weight-set',
  },
  {
    id: 'typography/label-casing',
    title: 'Consistent label casing',
    category: 'typography',
    severity: 'may',
    rule: 'Labels of the same kind use one casing convention (e.g. sentence case for actions).',
    rationale: 'Mixed casing (Title Case vs sentence case) across buttons/headers looks unpolished.',
    checklist: 'Y4',
    detector: 'ai/label-casing',
  },
] satisfies KitRule[];
