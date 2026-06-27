import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from '../../checkbox';
import { InputBox } from '../../input';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../index';

describe('Field', () => {
  it('auto-associates the label with the control', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox />} />
      </Field>
    );
    // getByLabelText only resolves if Field wired the label's htmlFor to the
    // control's id — the whole point of building on Base UI Field.
    expect(screen.getByLabelText('Email')).toHaveProperty('tagName', 'INPUT');
  });

  it('groups self-labeled controls in a FieldSet', () => {
    // Checkbox/Switch carry their own label; Field provides the grouping chrome.
    render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Checkbox label="Email" />
          <Checkbox label="SMS" />
        </FieldGroup>
      </FieldSet>
    );
    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeInTheDocument();
  });

  it('links the description to the control via aria-describedby', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox />} />
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
    );
    const input = screen.getByLabelText('Email');
    const description = screen.getByText('We never share it.');
    expect(input.getAttribute('aria-describedby')).toContain(description.id);
  });

  it('applies the orientation variant class', () => {
    const { container } = render(
      <Field orientation="horizontal">
        <FieldLabel>Remember me</FieldLabel>
        <FieldControl render={<InputBox />} />
      </Field>
    );
    const root = container.querySelector('[data-slot="field"]')!;
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root.className).toContain('flex-row');
  });

  it('shows a FieldError when its match is forced on', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<InputBox />} />
        <FieldError match>Please enter a valid email.</FieldError>
      </Field>
    );
    expect(screen.getByText('Please enter a valid email.')).toBeInTheDocument();
  });

  it('renders the structural fieldset / legend / group markup', () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Email me</FieldLabel>
            <FieldControl render={<InputBox />} />
          </Field>
        </FieldGroup>
      </FieldSet>
    );
    expect(container.querySelector('fieldset[data-slot="field-set"]')).toBeInTheDocument();
    expect(screen.getByText('Notifications').tagName).toBe('LEGEND');
    expect(container.querySelector('[data-slot="field-group"]')).toBeInTheDocument();
  });
});
