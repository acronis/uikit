// Figma Code Connect — status: COMPLETE
// Mapped to the auth screens design (Main-menu-improvements file, node 4906-362342).
import figma from '@figma/code-connect';

import {
  AuthLayout,
  AuthLayoutCard,
  AuthLayoutFooter,
  AuthLayoutLogo,
} from './auth-layout';

figma.connect(
  AuthLayout,
  'https://www.figma.com/design/OkbBd4RX3Y5qI9Q0WwFD7u/Main-menu-improvements?node-id=4906-362342',
  {
    example: () => (
      <AuthLayout>
        <AuthLayoutCard>
          <AuthLayoutLogo>{/* brand / title */}</AuthLayoutLogo>
          {/* form fields + submit */}
          <AuthLayoutFooter>{/* links */}</AuthLayoutFooter>
        </AuthLayoutCard>
      </AuthLayout>
    ),
  }
);
