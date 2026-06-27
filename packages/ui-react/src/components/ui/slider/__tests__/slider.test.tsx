import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Slider } from '../index';

describe('Slider', () => {
  it('renders a single thumb with the default value', () => {
    render(<Slider defaultValue={40} aria-label="Volume" />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(1);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '40');
  });

  it('renders two thumbs for a range value', () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Range" />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
  });

  it('reflects the value within a custom min / max', () => {
    render(<Slider defaultValue={5} min={0} max={10} step={5} aria-label="Steps" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '5');
  });

  it('marks the thumb disabled when disabled', () => {
    render(<Slider defaultValue={40} disabled aria-label="Volume" />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
