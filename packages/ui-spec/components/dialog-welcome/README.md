# DialogWelcome

An onboarding dialog with two layouts: `carousel` (a multi-slide feature tour
driven by a real Embla carousel engine, with a `DialogFooterCarousel` footer)
and `single` (one image/title/description body with a primary action and a
`Close` link). Built from scratch; does not reuse any existing carousel
implementation in this repo.

## When to use

- A first-run or feature-announcement dialog that walks through several
  screenshots/highlights one at a time — use `variant="carousel"`.
- A single-screen announcement or confirmation with one image and one
  call-to-action — use `variant="single"`.

## When not to use

- An ordinary confirmation/action dialog — use `Dialog`.
- A content carousel with no dialog chrome — compose `DialogFooterCarousel`
  (or a plain Embla instance) directly into your own layout.

## Parts

| Part          | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| container     | The popup card — reuses `Dialog`'s own chrome.                            |
| image         | Illustration/media for the active slide (or the single body).             |
| title         | The active slide's title; also the dialog's accessible name.              |
| description   | The active slide's description; also the dialog's accessible description. |
| footer        | `DialogFooterCarousel` (`variant="carousel"` only).                       |
| primaryAction | Call-to-action `Button` (`variant="single"` only).                        |
| close         | Ghost `Button` that dismisses the dialog (`variant="single"` only).       |

## Example

```tsx
import { DialogWelcome } from '@acronis-platform/ui-react';

<DialogWelcome
  variant="carousel"
  slides={[
    { title: 'Automated backups', description: 'Your data is backed up on a schedule you control.' },
    { title: 'Instant recovery', description: 'Restore a full workload in minutes, not hours.' },
  ]}
  open={open}
  onOpenChange={setOpen}
  onPrimaryAction={() => setOpen(false)}
/>

<DialogWelcome
  variant="single"
  title="You're all set"
  description="Your workspace is ready to go."
  primaryLabel="Get started"
  open={open}
  onOpenChange={setOpen}
/>
```
