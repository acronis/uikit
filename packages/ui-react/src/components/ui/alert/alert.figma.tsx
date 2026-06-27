// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. A Figma node would
// map the alert banner (variant + icon/title/description). Replace 'FIGMA_NODE_URL'
// and flip to COMPLETE via `/figma-component Alert <url> --update`.
import figma from '@figma/code-connect';

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from './alert';

figma.connect(Alert, 'FIGMA_NODE_URL', {
  props: {
    variant: figma.enum('Variant', {
      info: 'info',
      success: 'success',
      warning: 'warning',
      critical: 'critical',
      destructive: 'destructive',
      ai: 'ai',
      neutral: 'neutral',
    }),
  },
  example: ({ variant }) => (
    <Alert variant={variant}>
      <AlertIcon>{/* status icon */}</AlertIcon>
      <AlertContent>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </AlertContent>
    </Alert>
  ),
});
