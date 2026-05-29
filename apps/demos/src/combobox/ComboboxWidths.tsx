import * as React from 'react'
import { cn } from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@acronis-platform/shadcn-uikit/react'
import { Popover, PopoverContent, PopoverTrigger } from '@acronis-platform/shadcn-uikit/react'

import { CheckIcon, ChevronUpdownIcon } from '@acronis-platform/shadcn-uikit'
const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
]

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
]

export function ComboboxWidths() {
  const [languageOpen, setLanguageOpen] = React.useState(false)
  const [languageValue, setLanguageValue] = React.useState('')

  const [countryOpen, setCountryOpen] = React.useState(false)
  const [countryValue, setCountryValue] = React.useState('')

  return (
    <div className="flex flex-wrap gap-4">
      <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={languageOpen}
              className="w-[200px] justify-between"
            />
          }
        >
          {languageValue
            ? languages.find((lang) => lang.value === languageValue)?.label
            : 'Select language...'}
          <ChevronUpdownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languages.map((lang) => (
                  <CommandItem
                    key={lang.value}
                    value={lang.value}
                    onSelect={(currentValue) => {
                      setLanguageValue(currentValue === languageValue ? '' : currentValue)
                      setLanguageOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        languageValue === lang.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {lang.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={countryOpen} onOpenChange={setCountryOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={countryOpen}
              className="w-[320px] justify-between"
            />
          }
        >
          {countryValue
            ? countries.find((country) => country.value === countryValue)?.label
            : 'Select country...'}
          <ChevronUpdownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      setCountryValue(currentValue === countryValue ? '' : currentValue)
                      setCountryOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        countryValue === country.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {country.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
