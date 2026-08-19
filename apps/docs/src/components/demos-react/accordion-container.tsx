'use client';

import { AccordionContainer } from '@acronis-platform/ui-react';

export function AccordionContainerDemo() {
  return (
    <div style={{ width: 320 }} className="rounded-md border p-4">
      <AccordionContainer collapsible defaultOpen>
        {({ open }) => (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Backup schedule</div>
                {!open && (
                  <p className="text-sm text-[var(--ui-text-on-surface-secondary)]">
                    Nightly at 2:00 AM
                  </p>
                )}
              </div>
              <AccordionContainer.Trigger
                aria-label={open ? 'Collapse' : 'Expand'}
                className="rounded-md hover:bg-[var(--ui-background-surface-hover)]"
              />
            </div>
            <AccordionContainer.Content>
              <p className="mt-2 text-sm text-[var(--ui-text-on-surface-secondary)]">
                Runs every night at 2:00 AM. Retains the last 30 backups and
                verifies each one automatically after completion.
              </p>
            </AccordionContainer.Content>
          </>
        )}
      </AccordionContainer>
    </div>
  );
}
