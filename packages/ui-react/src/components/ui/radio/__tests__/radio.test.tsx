import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Radio, RadioGroup } from '../radio';

function Group(props: React.ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="a" aria-label="A" />
      <Radio value="b" aria-label="B" />
      <Radio value="c" aria-label="C" disabled />
    </RadioGroup>
  );
}

describe('Radio', () => {
  it('renders a radiogroup with radio items', () => {
    render(<Group />);
    expect(
      screen.getByRole('radiogroup', { name: 'Plan' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('applies the idle form token classes to an item', () => {
    render(<Group />);
    expect(screen.getByRole('radio', { name: 'A' })).toHaveClass(
      'bg-[var(--ui-form-background-idle)]',
      'border-[var(--ui-form-border-idle)]'
    );
  });

  it('reflects the selected value', () => {
    render(<Group defaultValue="a" />);
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('selects on click and deselects the previous option', async () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'A' }));
    expect(onValueChange).toHaveBeenCalledWith('a', expect.anything());
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    await userEvent.click(screen.getByRole('radio', { name: 'B' }));
    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('does not select a disabled item', async () => {
    const onValueChange = vi.fn();
    render(<Group onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'C' }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'C' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('merges a custom className on the item', () => {
    render(
      <RadioGroup aria-label="Plan">
        <Radio value="a" aria-label="A" className="custom-class" />
      </RadioGroup>
    );
    expect(screen.getByRole('radio', { name: 'A' })).toHaveClass(
      'custom-class',
      'bg-[var(--ui-form-background-idle)]'
    );
  });

  it('forwards refs', () => {
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLElement>();
    render(
      <RadioGroup ref={groupRef} aria-label="Plan">
        <Radio ref={radioRef} value="a" aria-label="A" />
      </RadioGroup>
    );
    expect(groupRef.current).toBeInstanceOf(HTMLElement);
    expect(groupRef.current?.getAttribute('role')).toBe('radiogroup');
    expect(radioRef.current?.getAttribute('role')).toBe('radio');
  });
});
