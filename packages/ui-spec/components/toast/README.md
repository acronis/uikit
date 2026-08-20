# Toast

A transient notification shown in a corner stack — triggered imperatively with
the `toast(...)` API and rendered by a single `<Toaster>` region.

Visually it is `Alert` plus a drop shadow: a neutral card whose severity is
carried by a 1px status-colored border, a 6px status line down the leading edge,
and a fixed status icon. Every value comes from the `--ui-toast-*` tier, mirroring
the Figma "Toast" component set (node `7421:126262`). Built on the Base UI toast
manager — no Sonner dependency.

## When to use

- Brief, low-priority feedback for an action (saved, copied, undo).
- Background operation status (loading → success/danger via `toast.promise`).

## When not to use

- For information the user must act on or must not miss — use a `Dialog` or an
  inline message; toasts auto-dismiss.
- For persistent, in-page status — use `Alert`, which is the same card without the
  shadow and without the auto-dismiss.

## Setup

Render one `<Toaster>` near the app root, then call `toast` anywhere. **Exactly
one** region per page: the queue is a module-level singleton scoped to the package
instance, so a micro-frontend host must share a single `@acronis-platform/ui-react`
instance. With two copies loaded, `toast(...)` from one is invisible to the other's
region (queued, never rendered) and two regions overlap in the same corner.

```tsx
import { Toaster, toast } from '@acronis-platform/ui-react';

// app root
<Toaster />;

// anywhere
toast.success('Profile saved', { description: 'Your changes were saved.' });
toast.danger('Delete failed', {
  description: 'Please try again or contact support.',
  actions: [
    { label: 'Retry', onClick: retry },
    { label: 'Get help', onClick: openSupport },
  ],
});

// tie to a promise
toast.promise(save(), {
  loading: 'Saving…',
  success: 'Saved',
  error: 'Could not save',
});
```

The severity comes from the method: `toast.info` / `success` / `warning` /
`critical` / `danger` match the Figma variants, a bare `toast(...)` is `info`, and
`toast.loading` shows a persistent spinner (no Figma variant of its own).

## Parts

| Part                | Element    | Purpose                                     |
| ------------------- | ---------- | ------------------------------------------- |
| `root`              | div        | The `role="region"` viewport / toast stack. |
| `toast`             | div        | A single notification card.                 |
| `toast-status-line` | `::before` | The 6px status bar on the leading edge.     |
| `toast-icon`        | div        | Status glyph, or a spinner while loading.   |
| `toast-content`     | div        | The column beside the icon.                 |
| `toast-text`        | div        | Title + description block.                  |
| `toast-title`       | h5         | The notification's heading.                 |
| `toast-description` | div        | Optional supporting text (3-line clamp).    |
| `toast-actions`     | div        | Optional wrapping row of action buttons.    |
| `toast-close`       | button     | Optional dismiss (✕) button.                |
