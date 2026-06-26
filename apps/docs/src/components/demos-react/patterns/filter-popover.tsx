'use client';

import {
  Button,
  InputSelect,
  InputSelectContent,
  InputSelectField,
  InputSelectItem,
  InputSelectLabel,
  InputSelectTrigger,
  InputSelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@acronis-platform/ui-react';
import { useShadowMount } from '@/components/ShadowDemo';

const statuses = { active: 'Active', idle: 'Idle', error: 'Error' };
const regions = { us: 'United States', eu: 'Europe', apac: 'Asia Pacific' };

export function FilterPopoverDemo() {
  const mount = useShadowMount();
  return (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Filters</Button>} />
      <PopoverContent
        align="start"
        sideOffset={8}
        portalContainer={mount}
        className="w-80 p-0"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold leading-none">Filters</p>
          </div>
          <div className="grid gap-4 px-5 py-4">
            <InputSelect items={statuses}>
              <InputSelectField>
                <InputSelectLabel>Status</InputSelectLabel>
                <InputSelectTrigger>
                  <InputSelectValue placeholder="Any status" />
                </InputSelectTrigger>
              </InputSelectField>
              <InputSelectContent portalContainer={mount}>
                <InputSelectItem value="active">Active</InputSelectItem>
                <InputSelectItem value="idle">Idle</InputSelectItem>
                <InputSelectItem value="error">Error</InputSelectItem>
              </InputSelectContent>
            </InputSelect>
            <InputSelect items={regions}>
              <InputSelectField>
                <InputSelectLabel>Region</InputSelectLabel>
                <InputSelectTrigger>
                  <InputSelectValue placeholder="Any region" />
                </InputSelectTrigger>
              </InputSelectField>
              <InputSelectContent portalContainer={mount}>
                <InputSelectItem value="us">United States</InputSelectItem>
                <InputSelectItem value="eu">Europe</InputSelectItem>
                <InputSelectItem value="apac">Asia Pacific</InputSelectItem>
              </InputSelectContent>
            </InputSelect>
          </div>
          <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
            <Button type="reset" variant="ghost">
              Reset
            </Button>
            <Button type="submit">Apply</Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
