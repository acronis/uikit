import type { KitRule } from '../types';

export const interactionRules = [
  {
    id: 'interaction/timing-parity',
    title: 'Consistent interaction timing',
    category: 'interaction',
    severity: 'may',
    rule: 'Hover/transition durations and easings come from the shared motion scale; animate transform/opacity, not `all`.',
    rationale: 'Mismatched timings make the kit feel uneven; animating `all` causes jank.',
    checklist: 'I3',
    detector: 'kit-lint/transition-timing',
  },
] satisfies KitRule[];
