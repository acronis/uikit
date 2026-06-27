'use client';

import {
  Form as FormPrimitive,
  type FormProps as BaseFormProps,
} from '@base-ui/react/form';

import { cn } from '@/lib/utils';

// Ported from `@acronis-platform/shadcn-uikit`'s `form`
// (packages/ui-legacy/src/components/ui/form.tsx), rebuilt on Base UI's Form.
// The legacy form was a react-hook-form wrapper (FormProvider/Controller); this
// version drops that dependency and coordinates the ui-react `Field`s directly via
// Base UI's native form: it collects values by each Field's `name`, runs their
// validation on submit (or per `validationMode`), surfaces server `errors` keyed
// by field name, and calls `onFormSubmit(values)` only when all fields are valid.
export interface FormProps<
  FormValues extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<BaseFormProps<FormValues>, 'className'> {
  className?: string;
}

function Form<
  FormValues extends Record<string, unknown> = Record<string, unknown>,
>({ className, ...props }: FormProps<FormValues>) {
  return (
    <FormPrimitive
      className={cn('flex w-full flex-col gap-6', className)}
      {...props}
    />
  );
}

export { Form };
