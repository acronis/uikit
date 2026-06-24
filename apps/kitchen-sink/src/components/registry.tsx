import type { ComponentType } from 'react';

import { BreadcrumbSpecimen } from './breadcrumb';
import { ButtonSpecimen } from './button';
import { ButtonMenuSpecimen } from './button-menu';
import { ButtonIconSpecimen } from './button-icon';
import { CheckboxSpecimen } from './checkbox';
import { InputSpecimen } from './input';
import { InputTextAreaSpecimen } from './input-text-area';
import { RadioSpecimen } from './radio';
import { SearchSpecimen } from './search';
import { SelectSpecimen } from './select';
import { SidebarsSpecimen } from './sidebars';
import { SwitchSpecimen } from './switch';
import { TagSpecimen } from './tag';
import { TooltipSpecimen } from './tooltip';

export interface ComponentEntry {
  /** URL segment under `/components/`. */
  slug: string;
  /** Display name (sidebar, index card, page heading). */
  name: string;
  Specimen: ComponentType;
}

/**
 * Single source of truth for the component routes: drives the sidebar, the
 * `/components` index grid, and the `/components/:slug` route. Add an entry here
 * when a new ui-react component ships a specimen. Ordered roughly form-controls →
 * actions → display → navigation.
 */
export const COMPONENTS: ComponentEntry[] = [
  { slug: 'button', name: 'Button', Specimen: ButtonSpecimen },
  { slug: 'button-icon', name: 'ButtonIcon', Specimen: ButtonIconSpecimen },
  { slug: 'button-menu', name: 'ButtonMenu', Specimen: ButtonMenuSpecimen },
  { slug: 'switch', name: 'Switch', Specimen: SwitchSpecimen },
  { slug: 'checkbox', name: 'Checkbox', Specimen: CheckboxSpecimen },
  { slug: 'radio', name: 'Radio', Specimen: RadioSpecimen },
  { slug: 'input', name: 'Input', Specimen: InputSpecimen },
  { slug: 'input-text-area', name: 'InputTextArea', Specimen: InputTextAreaSpecimen },
  { slug: 'search', name: 'Search', Specimen: SearchSpecimen },
  { slug: 'select', name: 'Select', Specimen: SelectSpecimen },
  { slug: 'tag', name: 'Tag', Specimen: TagSpecimen },
  { slug: 'breadcrumb', name: 'Breadcrumb', Specimen: BreadcrumbSpecimen },
  { slug: 'tooltip', name: 'Tooltip', Specimen: TooltipSpecimen },
  { slug: 'sidebars', name: 'Sidebars', Specimen: SidebarsSpecimen },
];

export function findComponent(slug: string | undefined): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
