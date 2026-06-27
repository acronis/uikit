import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '../../field';
import { InputBox } from '../../input';
import { Form } from '../index';

function EmailForm({
  onFormSubmit = () => {},
  errors,
}: {
  onFormSubmit?: (values: Record<string, unknown>) => void;
  errors?: Record<string, string | string[]>;
}) {
  return (
    <Form onFormSubmit={onFormSubmit} errors={errors}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox required />} />
        <FieldError />
      </Field>
      <button type="submit">Submit</button>
    </Form>
  );
}

describe('Form', () => {
  it('renders a native form element', () => {
    const { container } = render(<EmailForm />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('submits the field values keyed by name', async () => {
    const onFormSubmit = vi.fn();
    render(<EmailForm onFormSubmit={onFormSubmit} />);
    await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onFormSubmit).toHaveBeenCalledTimes(1);
    expect(onFormSubmit.mock.calls[0][0]).toMatchObject({
      email: 'ada@example.com',
    });
  });

  it('blocks submit and reports the error when a required field is empty', async () => {
    const onFormSubmit = vi.fn();
    render(<EmailForm onFormSubmit={onFormSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onFormSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('surfaces server errors keyed by field name', () => {
    render(<EmailForm errors={{ email: 'That email is taken.' }} />);
    expect(screen.getByText('That email is taken.')).toBeInTheDocument();
  });
});
