import { act } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Toaster, toast } from '../toast';
import {
  Toaster as ToasterFromComponentIndex,
  toast as toastFromComponentIndex,
} from '../index';
import {
  Toaster as ToasterFromRootIndex,
  toast as toastFromRootIndex,
} from '@/index';
import {
  Toaster as ToasterFromReactEntry,
  toast as toastFromReactEntry,
} from '@/react';

/** The rendered card, found from any text inside it. */
function cardFor(text: string) {
  return screen.getByText(text).closest('[data-slot="toast"]') as HTMLElement;
}

// The manager is module-level, so clear any leftover toasts between tests and
// wait for them to leave the DOM — otherwise a lingering toast pushes the next
// test's toast behind it, where Base UI marks it aria-hidden (invisible to
// getByRole).
afterEach(async () => {
  act(() => {
    toast.dismiss();
  });
  await waitFor(() => {
    expect(
      document.body.querySelectorAll('[data-slot="toast"]')
    ).toHaveLength(0);
  });
});

describe('Toast', () => {
  it('keeps toast and Toaster wired through component and package exports', () => {
    expect(ToasterFromComponentIndex).toBe(Toaster);
    expect(toastFromComponentIndex).toBe(toast);
    expect(ToasterFromRootIndex).toBe(Toaster);
    expect(toastFromRootIndex).toBe(toast);
    expect(ToasterFromReactEntry).toBe(Toaster);
    expect(toastFromReactEntry).toBe(toast);
  });

  it('renders no toast until one is added', () => {
    render(<Toaster />);
    expect(screen.queryByText('Nothing here')).not.toBeInTheDocument();
  });

  it('shows the title and description of an added toast', async () => {
    render(<Toaster />);
    act(() => {
      toast('Event created', { description: 'Monday at 6:00 PM' });
    });
    expect(await screen.findByText('Event created')).toBeInTheDocument();
    expect(screen.getByText('Monday at 6:00 PM')).toBeInTheDocument();
  });

  it('defaults an untyped toast to the info variant (the Figma default)', async () => {
    render(<Toaster />);
    act(() => {
      toast('Plain');
    });
    await screen.findByText('Plain');
    expect(cardFor('Plain')).toHaveAttribute('data-variant', 'info');
  });

  it('omits the description element when no description is given', async () => {
    render(<Toaster />);
    act(() => {
      toast('Title only');
    });
    await screen.findByText('Title only');
    expect(
      cardFor('Title only').querySelector('[data-slot="toast-description"]')
    ).toBeNull();
  });

  // The five Figma variants, each carried by its own --ui-toast-* border and
  // status line plus a fixed multicolor status icon.
  it.each([
    ['info', 'info'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['critical', 'critical'],
    ['danger', 'danger'],
  ] as const)('renders the %s variant with its status icon', async (method, variant) => {
    render(<Toaster />);
    act(() => {
      toast[method](`Hello ${method}`);
    });
    await screen.findByText(`Hello ${method}`);
    const card = cardFor(`Hello ${method}`);
    expect(card).toHaveAttribute('data-variant', variant);
    expect(
      card.querySelector('[data-slot="toast-icon"] svg')
    ).toBeInTheDocument();
  });

  // The 1px outward bleed is what makes the 6px status line cover the border
  // rather than sit beside it, and it only survives if the clip edge is the
  // border box — plain `overflow-clip` clips at the padding box and shaves the
  // line to 5px, which reads as two adjacent stripes since the border and the
  // line use different tokens.
  it('bleeds the status line over the border and clips at the border box', async () => {
    render(<Toaster />);
    act(() => {
      toast.danger('Edge');
    });
    await screen.findByText('Edge');
    const { className } = cardFor('Edge');
    expect(className).toContain('before:start-[-1px]');
    expect(className).toContain('before:-inset-y-px');
    expect(className).toContain(
      'before:w-[var(--ui-toast-global-container-status-width)]'
    );
    expect(className).toContain('overflow-clip');
    expect(className).toContain('[overflow-clip-margin:border-box]');
  });

  it('renders a loading toast with a spinner instead of a status icon', async () => {
    render(<Toaster />);
    act(() => {
      toast.loading('Processing…');
    });
    await screen.findByText('Processing…');
    const card = cardFor('Processing…');
    // The spinner is a bordered div, not an svg glyph.
    expect(card.querySelector('[data-slot="toast-icon"] svg')).toBeNull();
    expect(
      card.querySelector('[data-slot="toast-icon"] .animate-spin')
    ).toBeInTheDocument();
  });

  it('dismisses a toast via its close button', async () => {
    render(<Toaster />);
    act(() => {
      toast('Dismiss me');
    });
    await screen.findByText('Dismiss me');
    // The visible toast's controls are aria-hidden (Base UI announces via an
    // offscreen copy), so they have no accessible name — query by attribute.
    const close = cardFor('Dismiss me').querySelector(
      '[data-slot="toast-close"]'
    ) as HTMLElement;
    await userEvent.click(close);
    await waitFor(() => {
      expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    });
  });

  // The Figma binds the close ButtonIcon's visibility to a `dismissable`
  // boolean, defaulting to visible.
  it('renders the dismiss control by default', async () => {
    render(<Toaster />);
    act(() => {
      toast('Closable');
    });
    await screen.findByText('Closable');
    expect(
      cardFor('Closable').querySelector('[data-slot="toast-close"]')
    ).toBeInTheDocument();
  });

  it('omits the dismiss control when dismissable is false', async () => {
    render(<Toaster />);
    act(() => {
      toast.warning('Cannot close me', { dismissable: false });
    });
    await screen.findByText('Cannot close me');
    expect(
      cardFor('Cannot close me').querySelector('[data-slot="toast-close"]')
    ).toBeNull();
  });

  // Hiding the button is not enough: Base UI enables swipe-to-dismiss by default
  // (`['down', 'right']`), so a non-dismissable toast must opt out of the
  // capability too. It marks an in-progress swipe with `data-swiping`, which only
  // appears while its pointer handlers are installed.
  it('revokes swipe-to-dismiss when dismissable is false', async () => {
    render(<Toaster />);
    act(() => {
      toast('Fixed', { dismissable: false });
    });
    await screen.findByText('Fixed');
    const fixed = cardFor('Fixed');
    fireEvent.pointerDown(fixed, { button: 0, pointerId: 1 });
    expect(fixed).not.toHaveAttribute('data-swiping');

    act(() => {
      toast.dismiss();
    });
    await waitFor(() => {
      expect(screen.queryByText('Fixed')).not.toBeInTheDocument();
    });

    // Control: the same gesture does start a swipe on a dismissable toast, so the
    // assertion above is about `dismissable`, not about the gesture never firing.
    act(() => {
      toast('Swipeable');
    });
    await screen.findByText('Swipeable');
    const swipeable = cardFor('Swipeable');
    fireEvent.pointerDown(swipeable, { button: 0, pointerId: 1 });
    expect(swipeable).toHaveAttribute('data-swiping');
  });

  it('labels the dismiss control, overridable for localization', async () => {
    render(<Toaster closeAriaLabel="Cerrar" />);
    act(() => {
      toast('Localizado');
    });
    await screen.findByText('Localizado');
    expect(
      cardFor('Localizado').querySelector('[data-slot="toast-close"]')
    ).toHaveAttribute('aria-label', 'Cerrar');
  });

  it('renders action buttons and invokes their handlers', async () => {
    const onView = vi.fn();
    const onUndo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.info('Event created', {
        actions: [
          { label: 'View', onClick: onView },
          { label: 'Undo', onClick: onUndo },
        ],
      });
    });
    await screen.findByText('Event created');
    const card = cardFor('Event created');
    await userEvent.click(within(card).getByText('Undo'));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(onView).not.toHaveBeenCalled();
  });

  it('omits the actions row when no actions are given', async () => {
    render(<Toaster />);
    act(() => {
      toast('No actions');
    });
    await screen.findByText('No actions');
    expect(
      cardFor('No actions').querySelector('[data-slot="toast-actions"]')
    ).toBeNull();
  });

  // Base UI's `promise` helper hardcodes `type: 'error'` on the failure branch,
  // overwriting whatever the caller passes — so the danger visual has to be
  // reachable under that name even though the public API only offers
  // `toast.danger`.
  it('renders a rejected promise as the danger variant', async () => {
    render(<Toaster />);
    await act(async () => {
      await toast
        .promise(Promise.reject(new Error('nope')), {
          loading: { title: 'Saving…' },
          success: { title: 'Saved' },
          error: { title: 'Could not save' },
        })
        .catch(() => {});
    });
    await screen.findByText('Could not save');
    const card = cardFor('Could not save');
    expect(card).toHaveAttribute('data-variant', 'danger');
    expect(
      card.querySelector('[data-slot="toast-icon"] svg')
    ).toBeInTheDocument();
  });

  it('labels the toast region, overridable for localization', () => {
    const { container } = render(<Toaster label="Notificaciones" />);
    expect(
      container.ownerDocument.querySelector('[aria-label="Notificaciones"]')
    ).toBeInTheDocument();
  });
});
