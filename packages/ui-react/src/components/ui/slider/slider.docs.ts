// Curated prop surface for the docs `<AutoTypeTable>`. `SliderProps` in slider.tsx
// is `React.ComponentPropsWithoutRef<typeof Slider.Root>`, which expands to every
// Base UI Slider.Root prop plus the whole `<div>` DOM surface — a large, noisy
// table. This companion documents only the props callers set directly. (The
// runtime type lives in slider.tsx; this file is never bundled.)

/** Props for `Slider` — pick a number, or a range, by dragging. */
export interface SliderProps {
  /** The value(s) (controlled). An array renders one thumb per entry. */
  value?: number | number[];
  /** The initial value(s) (uncontrolled). Defaults to `0` — a single thumb. */
  defaultValue?: number | number[];
  /** The minimum value. Defaults to `0`. */
  min?: number;
  /** The maximum value. Defaults to `100`. */
  max?: number;
  /** The increment the value snaps to. Defaults to `1`. */
  step?: number;
  /** The increment for PageUp/PageDown and Shift+Arrow. Defaults to `10`. */
  largeStep?: number;
  /** Minimum gap kept between two thumbs of a range. Defaults to `0`. */
  minStepsBetweenValues?: number;
  /**
   * How range thumbs behave when they meet — `push` (the default), `swap`, or
   * `none`.
   */
  thumbCollisionBehavior?: 'push' | 'swap' | 'none';
  /** Disables dragging and keyboard interaction. */
  disabled?: boolean;
  /** Identifies the slider when a form is submitted. */
  name?: string;
  /**
   * Fired as the value changes. `Slider` always hands Base UI an array, so the
   * callback receives an array — one entry per thumb — even for a single value.
   */
  onValueChange?: (value: number[], eventDetails: unknown) => void;
  /** Fired once the drag or keyboard interaction settles. */
  onValueCommitted?: (value: number[], eventDetails: unknown) => void;
  /** Extra classes merged onto the root. */
  className?: string;
}
