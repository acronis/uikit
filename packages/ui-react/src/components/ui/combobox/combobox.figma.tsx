// Figma Code Connect — status: NEEDS_FIGMA_URL
// No Figma design exists for Combobox anywhere — not in the shared ui-react file
// and not in any product file (the legacy combobox was only a demo). The
// component itself is real and shipped (searchable single/multi-select on Base
// UI's Combobox); what's missing is the design, which UX still has to formally
// spec (the searchable select field + its dropdown, with variants and states).
// Once that node exists, replace 'FIGMA_NODE_URL' and mark this connection
// done via `/figma-component Combobox <url> --update`.
import figma from '@figma/code-connect';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './combobox';

figma.connect(Combobox, 'FIGMA_NODE_URL', {
  example: () => (
    <Combobox items={[]}>
      <ComboboxInput placeholder="Search…" />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item: { value: string; label: string }) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
});
