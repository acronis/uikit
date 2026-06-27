'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

type Framework = { value: string; label: string };
const frameworks: Framework[] = [
  { value: 'next', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
];

export function ComboboxDemo() {
  const mount = useShadowMount();
  return (
    <div style={{ width: 260 }}>
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Search framework…" clearable />
        <ComboboxContent portalContainer={mount}>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: Framework) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
