// Figma Code Connect — status: COMPLETE
// Mapped to the "DialogWelcome" component set in the ui-react Figma file
// (fileKey lrU3ydIyvPYQNE6ixdsKtJ, node 7162:26459). `variant` maps directly
// to the component's own `variant` prop (confirmed via Figma's dev-mode
// component playground and get_context_for_code_connect's
// `variantOptions: ["carousel", "single"]`) — passed through explicitly here
// so the generated example always renders the chrome the picked Figma
// variant shows, regardless of how many example slides accompany it. The
// example still needs *some* slide count to produce runnable code for the
// `carousel` case (Figma's own frame only ever shows one static slide), so it
// defaults to 3 for `carousel` and 1 for `single`.
import figma from '@figma/code-connect';

import { DialogWelcome, DialogWelcomeSlide } from './dialog-welcome';

figma.connect(
  DialogWelcome,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7162-26459',
  {
    props: {
      variant: figma.enum('variant', {
        single: 'single',
        carousel: 'carousel',
      }),
      title: figma.string('Title'),
      description: figma.string('Description'),
    },
    example: ({ variant, title, description }) => (
      <DialogWelcome aria-label={title} variant={variant} defaultOpen>
        {Array.from({ length: variant === 'single' ? 1 : 3 }, (_, index) => (
          <DialogWelcomeSlide
            key={index}
            image={<img alt="" src="illustration.png" />}
            title={title}
            description={description}
          />
        ))}
      </DialogWelcome>
    ),
  }
);
