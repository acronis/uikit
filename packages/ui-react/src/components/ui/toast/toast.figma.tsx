// Figma Code Connect — status: COMPLETE
// Node 7421:126262 (the "Toast" component set). Property names and variant
// options come from `get_context_for_code_connect`, not guesswork.
//
// Toast has no per-toast React component to connect: the card in the Figma is
// rendered by `<Toaster>` off the imperative queue, so the snippet shows both
// halves — the `toast(...)` call that produces this card, and the single
// `<Toaster />` region that renders it. Figma's booleans therefore map onto
// options on the call rather than props: `hasDescription` → `description`,
// `dismissable` → `dismissable`. Only `actionsList` has no mapping, because the
// actions are `ToastAction` descriptors rather than child layers.
import figma from '@figma/code-connect';

import { Toaster, toast } from './toast';

figma.connect(
  Toaster,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7421-126262',
  {
    imports: ["import { Toaster, toast } from '@acronis-platform/ui-react';"],
    props: {
      variant: figma.enum('variant', {
        Info: 'info',
        Success: 'success',
        Warning: 'warning',
        Critical: 'critical',
        Danger: 'danger',
      }),
      title: figma.string('title'),
      description: figma.boolean('hasDescription', {
        true: figma.string('description'),
        false: undefined,
      }),
      dismissable: figma.boolean('dismissable'),
    },
    example: ({ variant, title, description, dismissable }) => {
      // From anywhere in the app:
      toast[variant](title, { description, dismissable });

      // Once, near the app root:
      return <Toaster />;
    },
  }
);
