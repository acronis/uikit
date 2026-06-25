import type { ComponentType } from 'react';

import { AvatarSpecimen } from './avatar';
import { BreadcrumbSpecimen } from './breadcrumb';
import { ButtonSpecimen } from './button';
import { ButtonMenuSpecimen } from './button-menu';
import { ButtonIconSpecimen } from './button-icon';
import { CardFilterSpecimen } from './card-filter';
import { CheckboxSpecimen } from './checkbox';
import { InputSpecimen } from './input';
import { InputDatePickerSpecimen } from './input-date-picker';
import { InputSearchSpecimen } from './input-search';
import { InputSelectSpecimen } from './input-select';
import { InputTextSpecimen } from './input-text';
import { InputTextAreaSpecimen } from './input-text-area';
import { LinkSpecimen } from './link';
import { RadioSpecimen } from './radio';
import { ResizableSpecimen } from './resizable';
import { SearchSpecimen } from './search';
import { SearchGlobalSpecimen } from './search-global';
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
  { slug: 'avatar', name: 'Avatar', Specimen: AvatarSpecimen },
  { slug: 'button', name: 'Button', Specimen: ButtonSpecimen },
  { slug: 'button-icon', name: 'ButtonIcon', Specimen: ButtonIconSpecimen },
  { slug: 'button-menu', name: 'ButtonMenu', Specimen: ButtonMenuSpecimen },
  { slug: 'card-filter', name: 'CardFilter', Specimen: CardFilterSpecimen },
  { slug: 'switch', name: 'Switch', Specimen: SwitchSpecimen },
  { slug: 'checkbox', name: 'Checkbox', Specimen: CheckboxSpecimen },
  { slug: 'radio', name: 'Radio', Specimen: RadioSpecimen },
  { slug: 'input', name: 'Input', Specimen: InputSpecimen },
  { slug: 'input-date-picker', name: 'InputDatePicker', Specimen: InputDatePickerSpecimen },
  { slug: 'input-search', name: 'InputSearch', Specimen: InputSearchSpecimen },
  { slug: 'input-select', name: 'InputSelect', Specimen: InputSelectSpecimen },
  { slug: 'input-text', name: 'InputText', Specimen: InputTextSpecimen },
  { slug: 'input-text-area', name: 'InputTextArea', Specimen: InputTextAreaSpecimen },
  { slug: 'link', name: 'Link', Specimen: LinkSpecimen },
  { slug: 'resizable', name: 'Resizable', Specimen: ResizableSpecimen },
  { slug: 'search', name: 'Search', Specimen: SearchSpecimen },
  { slug: 'search-global', name: 'SearchGlobal', Specimen: SearchGlobalSpecimen },
  { slug: 'select', name: 'Select', Specimen: SelectSpecimen },
  { slug: 'sidebar-primary', name: 'SidebarPrimary', Specimen: SidebarsSpecimen },
  { slug: 'sidebar-secondary', name: 'SidebarSecondary', Specimen: SidebarsSpecimen },
  { slug: 'tag', name: 'Tag', Specimen: TagSpecimen },
  { slug: 'breadcrumb', name: 'Breadcrumb', Specimen: BreadcrumbSpecimen },
  { slug: 'tooltip', name: 'Tooltip', Specimen: TooltipSpecimen },
];

export function findComponent(slug: string | undefined): ComponentEntry | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
