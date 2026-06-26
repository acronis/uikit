# Toast

A transient notification shown in a corner stack — triggered imperatively with
the `toast(...)` API and rendered by a single `<Toaster>` region.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `sonner` wrapper, rebuilt on the Base UI toast
> manager (no Sonner dependency). No `--ui-toast-*` tier; a neutral card surface
> with the status conveyed by a colored icon (per-status surface tinting is
> design-pending). Reconcile with `/figma-component Toast <url> --update` once a
> mockup lands.

## When to use

- Brief, low-priority feedback for an action (saved, copied, undo).
- Background operation status (loading → success/error via `toast.promise`).

## When not to use

- For information the user must act on or must not miss — use a `Dialog` or an
  inline message; toasts auto-dismiss.
- For persistent, in-page status — use an inline banner/alert surface.

## Setup

Render one `<Toaster>` near the app root, then call `toast` anywhere:

```tsx
import { Toaster, toast } from '@acronis-platform/ui-react';

// app root
<Toaster />;

// anywhere
toast.success('Profile saved', { description: 'Your changes were saved.' });
toast('Event created', {
  description: 'Monday at 6:00 PM',
  action: { label: 'Undo', onClick: undo },
});

// tie to a promise
toast.promise(save(), {
  loading: 'Saving…',
  success: 'Saved',
  error: 'Could not save',
});
```

## Parts

| Part          | Element | Purpose                                     |
| ------------- | ------- | ------------------------------------------- |
| `root`        | div     | The `role="region"` viewport / toast stack. |
| `toast`       | div     | A single notification card.                 |
| `icon`        | span    | Leading status glyph / spinner.             |
| `title`       | div     | Bold first line.                            |
| `description` | div     | Muted secondary line.                       |
| `action`      | button  | Optional inline action.                     |
| `close`       | button  | Dismiss (✕) button.                         |
