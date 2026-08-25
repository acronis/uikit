import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useWizard, type WizardStep } from '../use-wizard';

const steps: WizardStep[] = [
  { id: 'name', label: 'Name the dashboard' },
  { id: 'widgets', label: 'Choose widgets' },
  { id: 'permissions', label: 'Set permissions' },
];

describe('useWizard', () => {
  it('starts on the first step by default', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentStepNumber).toBe(1);
    expect(result.current.stepCount).toBe(3);
    expect(result.current.currentStepLabel).toBe('Name the dashboard');
    expect(result.current.nextStepLabel).toBe('Choose widgets');
    expect(result.current.isFirstStep).toBe(true);
    expect(result.current.isLastStep).toBe(false);
  });

  it('seeds the current step from a numeric initialStep', () => {
    const { result } = renderHook(() => useWizard({ steps, initialStep: 1 }));
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentStepLabel).toBe('Choose widgets');
  });

  it('seeds the current step from a step id', () => {
    const { result } = renderHook(() =>
      useWizard({ steps, initialStep: 'permissions' })
    );
    expect(result.current.currentIndex).toBe(2);
    expect(result.current.isLastStep).toBe(true);
  });

  it('clamps an out-of-range numeric initialStep and ignores an unknown id', () => {
    const { result: high } = renderHook(() =>
      useWizard({ steps, initialStep: 99 })
    );
    expect(high.current.currentIndex).toBe(2);

    const { result: low } = renderHook(() =>
      useWizard({ steps, initialStep: -3 })
    );
    expect(low.current.currentIndex).toBe(0);

    const { result: unknown } = renderHook(() =>
      useWizard({ steps, initialStep: 'nope' })
    );
    expect(unknown.current.currentIndex).toBe(0);
  });

  it('advances and goes back one step at a time', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.goToNextStep());
    expect(result.current.currentIndex).toBe(1);
    act(() => result.current.goToPreviousStep());
    expect(result.current.currentIndex).toBe(0);
  });

  it('never wraps past either boundary', () => {
    const { result: first } = renderHook(() => useWizard({ steps }));
    act(() => first.current.goToPreviousStep());
    expect(first.current.currentIndex).toBe(0);

    const { result: last } = renderHook(() =>
      useWizard({ steps, initialStep: 2 })
    );
    act(() => last.current.goToNextStep());
    expect(last.current.currentIndex).toBe(2);
  });

  it('goToStep accepts an index, clamps it, and resolves ids', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.goToStep(2));
    expect(result.current.currentIndex).toBe(2);
    act(() => result.current.goToStep(-3));
    expect(result.current.currentIndex).toBe(0);
    act(() => result.current.goToStep(99));
    expect(result.current.currentIndex).toBe(2);
    act(() => result.current.goToStep('widgets'));
    expect(result.current.currentIndex).toBe(1);
  });

  it('goToStep truncates a non-integer index toward zero', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.goToStep(1.5));
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentStepLabel).toBe('Choose widgets');
    act(() => result.current.goToStep(2.9));
    expect(result.current.currentIndex).toBe(2);
    act(() => result.current.goToStep(-0.5));
    expect(result.current.currentIndex).toBe(0);
  });

  it('goToStep is a no-op for NaN', () => {
    const { result } = renderHook(() => useWizard({ steps, initialStep: 1 }));
    act(() => result.current.goToStep(Number.NaN));
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentStepLabel).toBe('Choose widgets');
  });

  it('falls back to the first step for a NaN initialStep', () => {
    const { result } = renderHook(() =>
      useWizard({ steps, initialStep: Number.NaN })
    );
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentStepLabel).toBe('Name the dashboard');
  });

  it('re-clamps the current index when steps shrinks past it', () => {
    const { result, rerender } = renderHook(
      (props: { steps: WizardStep[] }) =>
        useWizard({ steps: props.steps, initialStep: 4 }),
      {
        initialProps: {
          steps: [
            ...steps,
            { id: 'review', label: 'Review' },
            { id: 'confirm', label: 'Confirm' },
          ],
        },
      }
    );
    expect(result.current.currentIndex).toBe(4);

    expect(() => rerender({ steps })).not.toThrow();
    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentStepLabel).toBe('Set permissions');
    expect(result.current.nextStepLabel).toBeUndefined();
    expect(result.current.isLastStep).toBe(true);
    expect(result.current.steps.map((step) => step.variant)).toEqual([
      'completed',
      'completed',
      'current',
    ]);

    act(() => result.current.goToPreviousStep());
    expect(result.current.currentIndex).toBe(1);
  });

  it('goToStep is a no-op for an unknown id', () => {
    const { result } = renderHook(() => useWizard({ steps }));
    act(() => result.current.goToStep('widgets'));
    act(() => result.current.goToStep('does-not-exist'));
    expect(result.current.currentIndex).toBe(1);
  });

  it('ignores a changed initialStep across re-renders (it is a seed)', () => {
    const { result, rerender } = renderHook(
      (props: { initialStep: number }) =>
        useWizard({ steps, initialStep: props.initialStep }),
      { initialProps: { initialStep: 0 } }
    );
    rerender({ initialStep: 2 });
    expect(result.current.currentIndex).toBe(0);
  });

  it('derives variant and avatar presentation from the current index', () => {
    const { result } = renderHook(() => useWizard({ steps, initialStep: 1 }));
    expect(result.current.steps.map((step) => step.variant)).toEqual([
      'completed',
      'current',
      'future',
    ]);
    expect(result.current.steps.map((step) => step.avatarColor)).toEqual([
      'green',
      'blue',
      'gray',
    ]);
    expect(result.current.steps.map((step) => step.avatarClassName)).toEqual([
      '[box-shadow:none]',
      '[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]',
      '[box-shadow:none] text-[var(--ui-stepper-item-future-label-color)]',
    ]);
  });

  it('numbers steps from 1', () => {
    const { result } = renderHook(() => useWizard({ steps, initialStep: 2 }));
    expect(result.current.steps.map((step) => step.stepNumber)).toEqual([
      1, 2, 3,
    ]);
    expect(result.current.steps.map((step) => step.index)).toEqual([0, 1, 2]);
    expect(result.current.currentStepNumber).toBe(3);
  });

  it('reports nextStepLabel as undefined on the last step', () => {
    const { result } = renderHook(() => useWizard({ steps, initialStep: 2 }));
    expect(result.current.nextStepLabel).toBeUndefined();
  });

  it('throws when steps is empty', () => {
    expect(() => renderHook(() => useWizard({ steps: [] }))).toThrow(
      'useWizard: `steps` must not be empty.'
    );
  });

  it('passes extra fields on a custom step type through to the derived step', () => {
    interface CustomStep extends WizardStep {
      optional: boolean;
    }
    const customSteps: CustomStep[] = [
      { id: 'a', label: 'A', optional: false },
      { id: 'b', label: 'B', optional: true },
    ];
    const { result } = renderHook(() => useWizard({ steps: customSteps }));
    expect(result.current.steps[1].optional).toBe(true);
    expect(result.current.steps[1].variant).toBe('future');
  });
});
