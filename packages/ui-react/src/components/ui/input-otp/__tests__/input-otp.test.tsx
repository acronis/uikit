import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputOTP } from '../input-otp';

describe('InputOTP', () => {
  it('renders `length` slots, each with an accessible name', () => {
    render(<InputOTP length={4} />);
    expect(screen.getByLabelText('Digit 1 of 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Digit 4 of 4')).toBeInTheDocument();
    expect(screen.queryByLabelText('Digit 5 of 4')).not.toBeInTheDocument();
  });

  it('defaults to 6 slots', () => {
    render(<InputOTP />);
    expect(screen.getByLabelText('Digit 6 of 6')).toBeInTheDocument();
  });

  it('numbers each empty slot placeholder by position', () => {
    render(<InputOTP length={3} />);
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveAttribute(
      'placeholder',
      '1'
    );
    expect(screen.getByLabelText('Digit 3 of 3')).toHaveAttribute(
      'placeholder',
      '3'
    );
  });

  it('advances focus to the next slot on digit entry and reports the value', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 3');
    await userEvent.type(slot1, '1');
    expect(onChange).toHaveBeenLastCalledWith('1');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveFocus();
  });

  it('fires onComplete once the value reaches `length` characters', async () => {
    const onComplete = vi.fn();
    render(<InputOTP length={3} onComplete={onComplete} />);
    await userEvent.type(screen.getByLabelText('Digit 1 of 3'), '123');
    expect(onComplete).toHaveBeenCalledExactlyOnceWith('123');
  });

  it('clears the previous slot and moves back on Backspace from an empty slot', async () => {
    render(<InputOTP length={3} defaultValue="12" />);
    const slot3 = screen.getByLabelText('Digit 3 of 3');
    slot3.focus();
    await userEvent.keyboard('{Backspace}');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveValue('');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveFocus();
  });

  it('distributes a pasted code across the slots', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={4} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 4');
    slot1.focus();
    await userEvent.paste('1234');
    expect(onChange).toHaveBeenLastCalledWith('1234');
  });

  it('rejects a typed non-digit character, leaving the slot unchanged', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 3');
    await userEvent.type(slot1, 'a');
    expect(slot1).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
    expect(slot1).toHaveFocus();
  });

  it('accepts a digit after rejecting a non-digit keystroke', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 3');
    await userEvent.type(slot1, 'a5');
    expect(slot1).toHaveValue('5');
    expect(onChange).toHaveBeenLastCalledWith('5');
  });

  it('strips non-digit characters from a pasted code, keeping only digits', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    const slot1 = screen.getByLabelText('Digit 1 of 3');
    slot1.focus();
    await userEvent.paste('1a2b3c');
    expect(onChange).toHaveBeenLastCalledWith('123');
  });

  it('applies aria-invalid to every slot when `error` is set', () => {
    render(<InputOTP length={2} error />);
    expect(screen.getByLabelText('Digit 1 of 2')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Digit 2 of 2')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('disables every slot when `disabled` is set', () => {
    render(<InputOTP length={2} disabled />);
    expect(screen.getByLabelText('Digit 1 of 2')).toBeDisabled();
    expect(screen.getByLabelText('Digit 2 of 2')).toBeDisabled();
  });

  it('focuses the first slot when `autoFocus` is set', () => {
    render(<InputOTP length={3} autoFocus />);
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveFocus();
  });

  it('supports a controlled value', () => {
    render(<InputOTP length={3} value="12" onChange={() => {}} />);
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveValue('1');
    expect(screen.getByLabelText('Digit 2 of 3')).toHaveValue('2');
    expect(screen.getByLabelText('Digit 3 of 3')).toHaveValue('');
  });

  it('writes a digit into the clicked slot without shifting it into an earlier one', async () => {
    const onChange = vi.fn();
    render(<InputOTP length={3} onChange={onChange} />);
    const slot3 = screen.getByLabelText('Digit 3 of 3');
    await userEvent.click(slot3);
    await userEvent.keyboard('5');
    expect(slot3).toHaveValue('5');
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveValue('');
    expect(onChange).toHaveBeenLastCalledWith('5');
  });

  it('clears a filled middle slot in place on Backspace, without shifting later slots left', async () => {
    render(<InputOTP length={3} defaultValue="123" />);
    const slot2 = screen.getByLabelText('Digit 2 of 3');
    await userEvent.click(slot2);
    await userEvent.keyboard('{Backspace}');
    expect(screen.getByLabelText('Digit 1 of 3')).toHaveValue('1');
    expect(slot2).toHaveValue('');
    expect(screen.getByLabelText('Digit 3 of 3')).toHaveValue('3');
  });

  it('does not fire onComplete while an earlier slot is still blank', async () => {
    const onComplete = vi.fn();
    render(<InputOTP length={3} onComplete={onComplete} />);
    const slot3 = screen.getByLabelText('Digit 3 of 3');
    await userEvent.click(slot3);
    await userEvent.keyboard('5');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('forwards the ref to the root group element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<InputOTP ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'group');
  });

  describe('handleSlotChange', () => {
    it('overwrites an already-filled slot when retyped', async () => {
      const onChange = vi.fn();
      render(<InputOTP length={3} defaultValue="123" onChange={onChange} />);
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      // maxLength=1 + a JS-driven select-all doesn't reliably let happy-dom
      // simulate a real browser's type-to-replace; fire the change directly.
      fireEvent.change(slot1, { target: { value: '9' } });
      expect(slot1).toHaveValue('9');
      expect(onChange).toHaveBeenLastCalledWith('923');
    });

    it('does not move focus past the last slot', async () => {
      render(<InputOTP length={3} />);
      const slot3 = screen.getByLabelText('Digit 3 of 3');
      await userEvent.click(slot3);
      await userEvent.keyboard('5');
      expect(slot3).toHaveValue('5');
      expect(slot3).toHaveFocus();
    });

    it('distributes a multi-character value from an autofill onChange instead of truncating it', () => {
      const onChange = vi.fn();
      const onComplete = vi.fn();
      render(
        <InputOTP length={4} onChange={onChange} onComplete={onComplete} />
      );
      const slot1 = screen.getByLabelText('Digit 1 of 4');
      fireEvent.change(slot1, { target: { value: '1234' } });
      expect(onChange).toHaveBeenLastCalledWith('1234');
      expect(onComplete).toHaveBeenCalledExactlyOnceWith('1234');
      expect(screen.getByLabelText('Digit 4 of 4')).toHaveFocus();
    });
  });

  describe('handleKeyDown', () => {
    it('moves focus to the previous slot on ArrowLeft', async () => {
      render(<InputOTP length={3} />);
      const slot2 = screen.getByLabelText('Digit 2 of 3');
      await userEvent.click(slot2);
      await userEvent.keyboard('{ArrowLeft}');
      expect(screen.getByLabelText('Digit 1 of 3')).toHaveFocus();
    });

    it('moves focus to the next slot on ArrowRight', async () => {
      render(<InputOTP length={3} />);
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      await userEvent.click(slot1);
      await userEvent.keyboard('{ArrowRight}');
      expect(screen.getByLabelText('Digit 2 of 3')).toHaveFocus();
    });

    it('selects the destination slot value when navigating with arrow keys', async () => {
      render(<InputOTP length={3} defaultValue="12" />);
      const slot1 = screen.getByLabelText('Digit 1 of 3') as HTMLInputElement;
      await userEvent.click(slot1);
      await userEvent.keyboard('{ArrowRight}');
      const slot2 = screen.getByLabelText('Digit 2 of 3') as HTMLInputElement;
      expect(slot2).toHaveFocus();
      expect(slot2.selectionStart).toBe(0);
      expect(slot2.selectionEnd).toBe(1);
    });

    it('does nothing on ArrowLeft at the first slot', async () => {
      render(<InputOTP length={3} />);
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      await userEvent.click(slot1);
      await userEvent.keyboard('{ArrowLeft}');
      expect(slot1).toHaveFocus();
    });

    it('does nothing on ArrowRight at the last slot', async () => {
      render(<InputOTP length={3} />);
      const slot3 = screen.getByLabelText('Digit 3 of 3');
      await userEvent.click(slot3);
      await userEvent.keyboard('{ArrowRight}');
      expect(slot3).toHaveFocus();
    });

    it('does nothing on Backspace at an already-empty first slot', async () => {
      const onChange = vi.fn();
      render(<InputOTP length={3} onChange={onChange} />);
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      await userEvent.click(slot1);
      await userEvent.keyboard('{Backspace}');
      expect(onChange).not.toHaveBeenCalled();
      expect(slot1).toHaveFocus();
    });
  });

  describe('handlePaste', () => {
    it('ignores a paste that contains no digits', async () => {
      const onChange = vi.fn();
      render(<InputOTP length={3} onChange={onChange} />);
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      slot1.focus();
      await userEvent.paste('   ');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('starts distributing at the focused slot, not slot 0', async () => {
      render(<InputOTP length={4} />);
      const slot2 = screen.getByLabelText('Digit 2 of 4');
      slot2.focus();
      await userEvent.paste('99');
      expect(screen.getByLabelText('Digit 1 of 4')).toHaveValue('');
      expect(slot2).toHaveValue('9');
      expect(screen.getByLabelText('Digit 3 of 4')).toHaveValue('9');
    });

    it('clamps a paste longer than the remaining slots and focuses the last slot', async () => {
      const onChange = vi.fn();
      const onComplete = vi.fn();
      render(
        <InputOTP length={3} onChange={onChange} onComplete={onComplete} />
      );
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      slot1.focus();
      await userEvent.paste('123456');
      expect(onChange).toHaveBeenLastCalledWith('123');
      expect(onComplete).toHaveBeenCalledExactlyOnceWith('123');
      expect(screen.getByLabelText('Digit 3 of 3')).toHaveFocus();
    });

    it('focuses the next empty slot when the pasted code is shorter than `length`', async () => {
      render(<InputOTP length={4} />);
      const slot1 = screen.getByLabelText('Digit 1 of 4');
      slot1.focus();
      await userEvent.paste('12');
      expect(screen.getByLabelText('Digit 3 of 4')).toHaveFocus();
    });
  });

  describe('commitSlots', () => {
    it('does not call onComplete again while the value stays complete', async () => {
      const onComplete = vi.fn();
      render(<InputOTP length={3} onComplete={onComplete} />);
      await userEvent.type(screen.getByLabelText('Digit 1 of 3'), '123');
      expect(onComplete).toHaveBeenCalledOnce();
      const slot1 = screen.getByLabelText('Digit 1 of 3');
      // Retype over the already-filled slot 1 — still complete afterwards.
      fireEvent.change(slot1, { target: { value: '9' } });
      expect(slot1).toHaveValue('9');
      expect(onComplete).toHaveBeenCalledOnce();
    });

    it('fires onComplete again after the value drops below `length` and refills', async () => {
      const onComplete = vi.fn();
      render(<InputOTP length={3} onComplete={onComplete} />);
      await userEvent.type(screen.getByLabelText('Digit 1 of 3'), '123');
      expect(onComplete).toHaveBeenCalledOnce();

      const slot3 = screen.getByLabelText('Digit 3 of 3');
      await userEvent.click(slot3);
      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('9');
      expect(onComplete).toHaveBeenCalledTimes(2);
      expect(onComplete).toHaveBeenLastCalledWith('129');
    });

    it('calls onChange but does not self-update the rendered value when controlled', async () => {
      const onChange = vi.fn();
      render(<InputOTP length={3} value="12" onChange={onChange} />);
      const slot3 = screen.getByLabelText('Digit 3 of 3');
      await userEvent.click(slot3);
      await userEvent.keyboard('9');
      expect(onChange).toHaveBeenLastCalledWith('129');
      // The parent didn't re-render with a new `value`, so the slot stays empty.
      expect(slot3).toHaveValue('');
    });
  });

  describe('focusSlot', () => {
    it('focuses and selects the first slot on mount when `autoFocus` is set', () => {
      render(<InputOTP length={3} defaultValue="1" autoFocus />);
      const slot1 = screen.getByLabelText('Digit 1 of 3') as HTMLInputElement;
      expect(slot1).toHaveFocus();
      expect(slot1.selectionStart).toBe(0);
      expect(slot1.selectionEnd).toBe(1);
    });

    it('is a no-op past the group bounds (no crash on repeated boundary navigation)', async () => {
      render(<InputOTP length={2} />);
      const slot1 = screen.getByLabelText('Digit 1 of 2');
      await userEvent.click(slot1);
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
      expect(slot1).toHaveFocus();
    });
  });
});
