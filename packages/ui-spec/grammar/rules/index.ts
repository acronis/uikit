import type { KitRule, RuleCategory } from '../types';
import { tokenRules } from './tokens';
import { spacingRules } from './spacing';
import { typographyRules } from './typography';
import { anatomyRules } from './anatomy';
import { accessibilityRules } from './accessibility';
import { interactionRules } from './interaction';
import { compositionRules } from './composition';
import { crossImplRules } from './cross-impl';

/** The complete cross-component rule registry. */
export const allRules: readonly KitRule[] = [
  ...tokenRules,
  ...spacingRules,
  ...typographyRules,
  ...anatomyRules,
  ...accessibilityRules,
  ...interactionRules,
  ...compositionRules,
  ...crossImplRules,
];

export function getRule(id: string): KitRule | undefined {
  return allRules.find((r) => r.id === id);
}

export function getRulesByCategory(category: RuleCategory): KitRule[] {
  return allRules.filter((r) => r.category === category);
}

/** The `must` rules — the ones intended to block CI. */
export function getMandatoryRules(): KitRule[] {
  return allRules.filter((r) => r.severity === 'must');
}
