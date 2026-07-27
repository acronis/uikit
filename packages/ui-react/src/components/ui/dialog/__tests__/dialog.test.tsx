import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../button';
import {
  Dialog,
  DialogBodyRoot,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooterRoot,
  DialogHeaderRoot,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  type DialogVariant,
} from '../dialog';

// The default portal renders the popup into document.body, which Testing
// Library's `screen` queries — Base UI requires the popup to sit in a portal.
function OpenDialog(props: { open?: boolean } = {}) {
  return (
    <DialogRoot open={props.open ?? true}>
      <DialogContent>
        <DialogHeaderRoot>
          <DialogTitle>Delete account</DialogTitle>
          <DialogCloseButton />
        </DialogHeaderRoot>
        <DialogBodyRoot>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogBodyRoot>
        <DialogFooterRoot>Footer</DialogFooterRoot>
      </DialogContent>
    </DialogRoot>
  );
}

describe('DialogRoot', () => {
  it('renders the open dialog with its title, description, and footer', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete account')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders the close button as an accessible "Close" button on the button-icon token', () => {
    render(<OpenDialog />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toBeInTheDocument();
    expect(close).toHaveClass('text-[var(--ui-button-icon-global-icon-color-idle)]');
  });

  it('lets closeLabel override the close button accessible name', () => {
    render(
      <DialogRoot open>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogCloseButton closeLabel="Fermer" />
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
  });

  it('drives the popup surface from the --ui-dialog-container-* tokens', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'bg-[var(--ui-dialog-container-color)]',
      'text-foreground'
    );
  });

  it('applies the strong drop-shadow matching the legacy Dialog', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'shadow-[0px_10px_20px_rgba(36,49,67,0.9)]'
    );
  });

  it('defaults to the sm size (--ui-dialog-container-size-sm / 512px)', () => {
    render(<OpenDialog />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'max-w-[var(--ui-dialog-container-size-sm)]'
    );
  });

  it('supports the large size (832px, kept for backward compatibility)', () => {
    render(
      <DialogRoot open>
        <DialogContent size="large">
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </DialogRoot>
    );
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[832px]');
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DialogRoot open>
        <DialogContent ref={ref}>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </DialogRoot>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('opens from the trigger and closes via onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DialogRoot onOpenChange={onOpenChange}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogCloseButton />
        </DialogContent>
      </DialogRoot>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });
});

describe('Dialog', () => {
  it('renders the default variant title, body, and footer buttons', () => {
    render(<Dialog open />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Dialog title')).toBeInTheDocument();
    expect(
      within(dialog).getByText('Drop any content into this slot.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it.each<[DialogVariant, string, string]>([
    ['default', 'Dialog title', 'Label'],
    ['rename', 'Rename object name', 'Rename'],
    ['save changes', 'Save changes', 'Save'],
    ['reset password', 'Reset password', 'Reset'],
    ['discard changes', 'Discard changes', 'Confirm'],
    ['accept', 'Accept object name', 'Accept'],
    ['read-only', 'License agreement', 'Done'],
  ])('renders the %s variant title and primary action', (variant, title, primary) => {
    render(<Dialog open variant={variant} />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: primary })).toBeInTheDocument();
  });

  it('renders the rename variant as a prefilled text field', () => {
    render(<Dialog open variant="rename" />);
    expect(screen.getByRole('textbox', { name: 'Object name' })).toHaveValue(
      'Current name'
    );
  });

  it('lets objectNameLabel override the rename field accessible name', () => {
    render(<Dialog open variant="rename" objectNameLabel="Nom de l'objet" />);
    expect(
      screen.getByRole('textbox', { name: "Nom de l'objet" })
    ).toHaveValue('Current name');
    expect(
      screen.queryByRole('textbox', { name: 'Object name' })
    ).not.toBeInTheDocument();
  });

  it('lets objectName interpolate the rename variant title and field value', () => {
    render(<Dialog open variant="rename" objectName="Q3 Report.xlsx" />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Rename Q3 Report.xlsx')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Object name' })).toHaveValue(
      'Q3 Report.xlsx'
    );
  });

  it('lets objectName interpolate the discard changes variant body', () => {
    render(<Dialog open variant="discard changes" objectName="Q3 Report.xlsx" />);
    expect(screen.getByText('Q3 Report.xlsx')).toBeInTheDocument();
    expect(screen.queryByText('Object name')).not.toBeInTheDocument();
  });

  it('lets objectName interpolate the accept variant title', () => {
    render(<Dialog open variant="accept" objectName="terms-v2.pdf" />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Accept terms-v2.pdf')).toBeInTheDocument();
  });

  it('ignores objectName for variants that have no placeholder to interpolate', () => {
    render(<Dialog open variant="default" objectName="should not appear" />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Dialog title')).toBeInTheDocument();
    expect(screen.queryByText('should not appear')).not.toBeInTheDocument();
  });

  it('renders read-only with a single primary action and no secondary button', () => {
    render(<Dialog open variant="read-only" />);
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Go back' })
    ).not.toBeInTheDocument();
  });

  it('lets children override the variant body copy', () => {
    render(
      <Dialog open variant="save changes">
        <p>Custom body content</p>
      </Dialog>
    );
    expect(screen.getByText('Custom body content')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'You have unsaved changes. Do you want to save them before leaving?'
      )
    ).not.toBeInTheDocument();
  });

  it('lets title/secondaryLabel/primaryLabel/closeLabel override the variant defaults', () => {
    render(
      <Dialog
        open
        variant="discard changes"
        title="Ignorer les modifications"
        secondaryLabel="Retour"
        primaryLabel="Confirmer"
        closeLabel="Fermer"
      />
    );
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByText('Ignorer les modifications')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retour' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    expect(screen.queryByText('Discard changes')).not.toBeInTheDocument();
  });

  it('passing secondaryLabel on a variant with no default secondary button shows it', () => {
    render(<Dialog open variant="read-only" secondaryLabel="Close instead" />);
    expect(
      screen.getByRole('button', { name: 'Close instead' })
    ).toBeInTheDocument();
  });

  it('shows a loading overlay when hasLoading is set', () => {
    render(<Dialog open hasLoading />);
    expect(
      screen.getByRole('status', { name: 'Data is loading…' })
    ).toBeInTheDocument();
  });

  it('does not render the loading overlay by default', () => {
    render(<Dialog open />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('lets loadingLabel override the loading overlay accessible name', () => {
    render(<Dialog open hasLoading loadingLabel="Chargement…" />);
    expect(screen.getByRole('status', { name: 'Chargement…' })).toBeInTheDocument();
  });

  it('marks the body and footer inert while hasLoading, so their buttons are unreachable', () => {
    render(<Dialog open hasLoading />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton.closest('[inert]')).not.toBeNull();
  });

  it('does not mark the body/footer inert when hasLoading is false', () => {
    render(<Dialog open />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton.closest('[inert]')).toBeNull();
  });

  it('marks the popup aria-busy while hasLoading', () => {
    render(<Dialog open hasLoading />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true');
  });

  it('renders the header and footer by default', () => {
    render(<Dialog open />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Label' })).toBeInTheDocument();
  });

  it('hides the header (and its close button) when hasHeader is false, but keeps the dialog accessible name', () => {
    render(<Dialog open hasHeader={false} />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('dialog', { name: 'Dialog title' })
    ).toBeInTheDocument();
    // The footer is still there — only the header is hidden.
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('hides the footer (and its actions) when hasFooter is false', () => {
    render(<Dialog open hasFooter={false} />);
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Label' })).not.toBeInTheDocument();
    // The header is still there — only the footer is hidden.
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('renders neither header nor footer when both are false, keeping only the body and an accessible name', () => {
    render(<Dialog open hasHeader={false} hasFooter={false} />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Label' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('dialog', { name: 'Dialog title' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Drop any content into this slot.')
    ).toBeInTheDocument();
  });

  it.each<[DialogVariant, string]>([
    ['default', 'Label'],
    ['rename', 'Rename'],
    ['save changes', 'Save'],
    ['reset password', 'Reset'],
    ['discard changes', 'Confirm'],
    ['accept', 'Accept'],
  ])(
    'fires onPrimaryAction when the %s variant primary button is clicked, without closing',
    async (variant, primary) => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Dialog
          open
          variant={variant}
          onPrimaryAction={onPrimaryAction}
          onOpenChange={onOpenChange}
        />
      );
      await user.click(screen.getByRole('button', { name: primary }));
      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
      expect(onOpenChange).not.toHaveBeenCalled();
    }
  );

  it('fires onPrimaryAction when the read-only variant primary button is clicked, and also closes', async () => {
    const user = userEvent.setup();
    const onPrimaryAction = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        open
        variant="read-only"
        onPrimaryAction={onPrimaryAction}
        onOpenChange={onOpenChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('dismisses via the secondary button and emits open-change', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Dialog open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards the ref to the popup element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Dialog open ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });

  it('defaults the wide variant to the large size', () => {
    render(<Dialog open variant="wide" />);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[832px]');
  });

  it('lets size override the variant default (wide at sm)', () => {
    render(<Dialog open variant="wide" size="sm" />);
    expect(screen.getByRole('dialog')).toHaveClass(
      'max-w-[var(--ui-dialog-container-size-sm)]'
    );
  });

  it('renders the wide variant fallback title, body, and footer when uncustomized', () => {
    render(<Dialog open variant="wide" />);
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Dialog title')).toBeInTheDocument();
    expect(
      within(dialog).getByText('Drop any content into this slot.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('lets the footer prop replace the canned footer with free-form actions', () => {
    render(
      <Dialog
        open
        variant="wide"
        title="Configure discovery agent"
        footer={
          <>
            <DialogClose render={<Button variant="ghost">Cancel</Button>} />
            <Button>Configure</Button>
          </>
        }
      />
    );
    expect(screen.getByRole('button', { name: 'Configure' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    // The canned wide-variant labels ("Confirm") must not also render.
    expect(
      screen.queryByRole('button', { name: 'Confirm' })
    ).not.toBeInTheDocument();
  });

  it('forwards keepMounted so the closed popup stays in the DOM (hidden)', () => {
    render(<Dialog open={false} keepMounted />);
    expect(screen.getByText('Dialog title')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render the popup when closed without keepMounted', () => {
    render(<Dialog open={false} />);
    expect(screen.queryByText('Dialog title')).not.toBeInTheDocument();
  });
});
