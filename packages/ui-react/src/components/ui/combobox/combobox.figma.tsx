// Figma Code Connect — status: NEEDS_FIGMA_URL
// No "ready for dev" Figma node (the legacy combobox was only a demo). Built on
// Base UI's Combobox. A Figma node would map the searchable select field + its
// dropdown. Replace 'FIGMA_NODE_URL' and flip to COMPLETE via
// `/figma-component Combobox <url> --update`.
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
