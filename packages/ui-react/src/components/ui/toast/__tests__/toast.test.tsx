import { act } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Toaster, toast } from '../toast';

// The manager is module-level, so clear any leftover toasts between tests and
// wait for them to leave the DOM — otherwise a lingering toast pushes the next
// test's toast behind it, where Base UI marks it aria-hidden (invisible to
// getByRole).
afterEach(async () => {
  act(() => {
    toast.dismiss();
  });
  await waitFor(() => {
    expect(document.body.querySelectorAll('[class*="shadow-md"]')).toHaveLength(
      0
    );
  });
});

describe('Toast', () => {
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

  it('renders a variant toast with its status icon', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast.success('Profile saved');
    });
    expect(await screen.findByText('Profile saved')).toBeInTheDocument();
    // the leading status icon is an svg
    expect(container.ownerDocument.querySelector('svg')).toBeTruthy();
  });

  it('dismisses a toast via its close button', async () => {
    render(<Toaster />);
    act(() => {
      toast('Dismiss me');
    });
    const title = await screen.findByText('Dismiss me');
    // The visible toast's controls are aria-hidden (Base UI announces via an
    // offscreen copy), so they have no accessible name — query by attribute.
    const root = title.closest('[class*="shadow-md"]') as HTMLElement;
    const close = root.querySelector(
      'button[aria-label="Close"]'
    ) as HTMLElement;
    await userEvent.click(close);
    await waitFor(() => {
      expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    });
  });

  it('renders an action button and invokes its handler', async () => {
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast.info('Event created', {
        action: { label: 'Undo', onClick },
      });
    });
    const title = await screen.findByText('Event created');
    const root = title.closest('[class*="shadow-md"]') as HTMLElement;
    await userEvent.click(within(root).getByText('Undo'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
