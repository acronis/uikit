// Figma Code Connect — status: COMPLETE
// Mapped to the "DialogWelcome" component set in the ui-react Figma file
// (fileKey lrU3ydIyvPYQNE6ixdsKtJ, node 7162:26459). `DialogWelcome` has no
// `variant` prop of its own — like Breadcrumb's "current page", it's a
// structural difference derived from how many `<DialogWelcomeSlide>` children
// are passed (one → `single`, 2–5 → `carousel`) — so the Figma `variant` enum
// is mapped to the slide count that actually produces each layout, verified
// via get_context_for_code_connect (Title/Description text nodes, a
// `DialogFooterCarousel` instance only under `variant=carousel`, and a CTA +
// Close `Button` pair only under `variant=single`).
import figma from '@figma/code-connect';

import { DialogWelcome, DialogWelcomeSlide } from './dialog-welcome';

figma.connect(
  DialogWelcome,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7162-26459',
  {
    props: {
      slideCount: figma.enum('variant', {
        single: 1,
        carousel: 3,
      }),
      title: figma.string('Title'),
      description: figma.string('Description'),
    },
    example: ({ slideCount, title, description }) => (
      <DialogWelcome aria-label={title} defaultOpen>
        {Array.from({ length: slideCount }, (_, index) => (
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
