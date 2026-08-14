// Figma Code Connect — status: COMPLETE
// Node 7421:125155 (the "Alert" component set). Property names and variant
// options come from `get_context_for_code_connect`, not guesswork.
// `dismissable` / `hasActions` / `hasDescription` are Figma booleans that toggle
// whole subtrees; in React the equivalent is simply rendering (or not) the
// corresponding part, so they map to `figma.boolean` with an element per branch.
import figma from '@figma/code-connect';

import {
  Alert,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertText,
  AlertTitle,
} from './alert';

figma.connect(
  Alert,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7421-125155',
  {
    // Pinned explicitly: `AlertClose` only appears inside a `figma.boolean`
    // value, which the parser stringifies — so it never reaches the
    // auto-derived import list and the published snippet would reference an
    // unimported component.
    imports: [
      "import { Alert, AlertActions, AlertClose, AlertContent, AlertDescription, AlertIcon, AlertText, AlertTitle } from '@acronis-platform/ui-react';",
    ],
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
      actions: figma.boolean('hasActions', {
        true: figma.children('actionsList'),
        false: undefined,
      }),
      closeButton: figma.boolean('dismissable', {
        true: <AlertClose onClick={() => {}} />,
        false: undefined,
      }),
    },
    example: ({ variant, title, description, actions, closeButton }) => (
      <Alert variant={variant}>
        <AlertIcon />
        <AlertContent>
          <AlertText>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </AlertText>
          <AlertActions>{actions}</AlertActions>
        </AlertContent>
        {closeButton}
      </Alert>
    ),
  }
);
