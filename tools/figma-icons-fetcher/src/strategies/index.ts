import { framesByNameStrategy } from './frames-by-name';
import { newFramesStrategy } from './new-frames';
import type { SelectionStrategy, SelectionStrategyName } from './types';

const STRATEGIES: Record<SelectionStrategyName, SelectionStrategy> = {
  'frames-by-name': framesByNameStrategy,
  'new-frames': newFramesStrategy,
};

export function getSelectionStrategy(name: SelectionStrategyName): SelectionStrategy {
  const strategy = STRATEGIES[name];
  if (!strategy) {
    throw new Error(
      `Unknown selection strategy: "${name}". Available: ${Object.keys(STRATEGIES).join(', ')}`,
    );
  }
  return strategy;
}

export * from './types';
export { framesByNameStrategy, newFramesStrategy };
