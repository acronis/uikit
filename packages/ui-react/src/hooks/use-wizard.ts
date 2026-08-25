import * as React from 'react';

export interface WizardStep {
  /** Stable identifier; `goToStep` and `initialStep` accept it as a string. */
  id: string;
  /** Step label, rendered by `StepperItem` and the `Stepper` summary. */
  label: string;
}

export type WizardStepAvatarColor = 'blue' | 'green' | 'gray';

export type WizardStepVariant = 'completed' | 'current' | 'future';

/**
 * A step enriched with everything a `StepperItem` needs. Intersects `TStep`, so
 * any extra fields the consumer put on their own step objects survive.
 */
export type WizardStepState<TStep extends WizardStep = WizardStep> = TStep & {
  /** Zero-based position in `steps`. */
  index: number;
  /** One-based position, for the avatar's displayed number. */
  stepNumber: number;
  /** `StepperItem`'s `variant`, derived from the position vs. `currentIndex`. */
  variant: WizardStepVariant;
  /** `Avatar`'s `color` for this step's variant. */
  avatarColor: WizardStepAvatarColor;
  /** Classes to merge onto this step's `Avatar`. */
  avatarClassName: string;
};

export interface UseWizardOptions<TStep extends WizardStep = WizardStep> {
  /** The flow's steps, in order. Must not be empty. */
  steps: TStep[];
  /**
   * Where the flow starts — a zero-based index or a step `id`. A numeric
   * index is truncated toward zero and clamped into range; `NaN` and an id
   * that matches no step fall back to the first step. A seed, not a
   * controlled input: later changes are ignored.
   */
  initialStep?: number | string;
}

export interface UseWizardResult<TStep extends WizardStep = WizardStep> {
  /** `steps` with per-step `variant`/avatar presentation derived. */
  steps: WizardStepState<TStep>[];
  /**
   * Zero-based index of the active step. Always a valid index into `steps`:
   * if `steps` shrinks so that the stored index is past the end, the
   * effective index clamps to `steps.length - 1`.
   */
  currentIndex: number;
  /** One-based number of the active step, for `Stepper`'s `currentStep`. */
  currentStepNumber: number;
  /** Total number of steps, for `Stepper`'s `totalSteps`. */
  stepCount: number;
  /** The active step's label, for `Stepper`'s `current`. */
  currentStepLabel: string;
  /** The following step's label, or `undefined` on the last step. */
  nextStepLabel: string | undefined;
  isFirstStep: boolean;
  isLastStep: boolean;
  /** Advance one step; no-op on the last step (never wraps). */
  goToNextStep: () => void;
  /** Go back one step; no-op on the first step (never wraps). */
  goToPreviousStep: () => void;
  /**
   * Jump to a zero-based index or a step `id`. A numeric index is truncated
   * toward zero (`1.5` → `1`) and clamped into range; `NaN` is a no-op. An
   * id that matches no step is a no-op; on duplicate ids the first wins.
   */
  goToStep: (target: number | string) => void;
}

const AVATAR_BY_VARIANT: Record<
  WizardStepVariant,
  { avatarColor: WizardStepAvatarColor; avatarClassName: string }
> = {
  completed: { avatarColor: 'green', avatarClassName: '[box-shadow:none]' },
  current: {
    avatarColor: 'blue',
    avatarClassName:
      '[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]',
  },
  future: {
    avatarColor: 'gray',
    avatarClassName:
      '[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]',
  },
};

function clampIndex(index: number, stepCount: number): number {
  return Math.min(Math.max(index, 0), stepCount - 1);
}

// Numbers are truncated toward zero and clamped into range; `NaN` and ids that
// match nothing resolve to `null`, which callers treat as a no-op.
function resolveStepIndex(
  steps: readonly WizardStep[],
  target: number | string
): number | null {
  if (typeof target === 'number') {
    if (Number.isNaN(target)) return null;
    return clampIndex(Math.trunc(target), steps.length);
  }
  const index = steps.findIndex((step) => step.id === target);
  return index === -1 ? null : index;
}

/**
 * Headless step state for a `Wizard`'s `Stepper` (the `Wizard` components
 * themselves stay presentational and own no state). Returns the `Stepper`
 * summary props plus a per-step `variant` + avatar presentation, and the
 * navigation callbacks a consumer wires to its Back/Next buttons.
 *
 * Opt-in: a consumer that already owns its step state can keep driving
 * `Stepper`/`StepperItem` by hand.
 *
 * `steps` may be a live, per-render value. The active index is stored as
 * state but re-clamped against the *current* `steps.length` on every read,
 * so a `steps` array that shrinks past the active index resolves to the last
 * remaining step instead of reading past the end.
 */
export function useWizard<TStep extends WizardStep = WizardStep>({
  steps,
  initialStep = 0,
}: UseWizardOptions<TStep>): UseWizardResult<TStep> {
  if (steps.length === 0) {
    throw new Error('useWizard: `steps` must not be empty.');
  }

  const stepCount = steps.length;

  const [storedIndex, setCurrentIndex] = React.useState(
    () => resolveStepIndex(steps, initialStep) ?? 0
  );

  // `storedIndex` can outlive the step it pointed at, so every read goes
  // through the clamp rather than trusting the stored value.
  const currentIndex = clampIndex(storedIndex, stepCount);

  // Both step relative to the *clamped* current index, so a `steps` array that
  // shrank does not leave the stored value skipping steps on the way back.
  const goToNextStep = React.useCallback(() => {
    setCurrentIndex((current) =>
      clampIndex(clampIndex(current, stepCount) + 1, stepCount)
    );
  }, [stepCount]);

  const goToPreviousStep = React.useCallback(() => {
    setCurrentIndex((current) =>
      clampIndex(clampIndex(current, stepCount) - 1, stepCount)
    );
  }, [stepCount]);

  const goToStep = React.useCallback(
    (target: number | string) => {
      const index = resolveStepIndex(steps, target);
      if (index === null) return;
      setCurrentIndex(index);
    },
    [steps]
  );

  const derivedSteps = React.useMemo(
    () =>
      steps.map((step, index) => {
        const variant: WizardStepVariant =
          index < currentIndex
            ? 'completed'
            : index === currentIndex
              ? 'current'
              : 'future';
        return {
          ...step,
          index,
          stepNumber: index + 1,
          variant,
          ...AVATAR_BY_VARIANT[variant],
        };
      }),
    [steps, currentIndex]
  );

  return {
    steps: derivedSteps,
    currentIndex,
    currentStepNumber: currentIndex + 1,
    stepCount,
    currentStepLabel: steps[currentIndex].label,
    nextStepLabel: steps[currentIndex + 1]?.label,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === stepCount - 1,
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
}
