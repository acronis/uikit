// Figma Code Connect — status: COMPLETE
// The Figma "FooterDefault" component set's `variant` (default / withDescription
// / withLink) is structural, not a React prop — `DialogFooterDefault` derives it
// from which slot (`description` / `link`) is passed. Each variant is pinned to
// its own instance node, mirroring the breadcrumb pattern for structural parts.
import figma from '@figma/code-connect';

import { Button } from '../button';
import { Link } from '../link';
import { DialogFooterDefault } from './dialog-footer-default';

// None of Description/Link/Button label text is exposed as a top-level
// FooterDefault component property (each variant instance overrides static
// content directly) — the snippets below use the same placeholder copy Figma
// shows ("Label" / "Description"), matching the button.figma.tsx precedent.

figma.connect(
  DialogFooterDefault,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4220-3442',
  {
    example: () => (
      <DialogFooterDefault>
        <Button variant="secondary">Label</Button>
        <Button>Label</Button>
      </DialogFooterDefault>
    ),
  }
);

figma.connect(
  DialogFooterDefault,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4220-3443',
  {
    example: () => (
      <DialogFooterDefault description="Description">
        <Button variant="secondary">Label</Button>
        <Button>Label</Button>
      </DialogFooterDefault>
    ),
  }
);

figma.connect(
  DialogFooterDefault,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=4220-3444',
  {
    example: () => (
      <DialogFooterDefault link={<Link href="#">Link</Link>}>
        <Button variant="secondary">Label</Button>
        <Button>Label</Button>
      </DialogFooterDefault>
    ),
  }
);
