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
const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt.js', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
]

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

export function ComboboxForm() {
  const [frameworkOpen, setFrameworkOpen] = React.useState(false)
  const [frameworkValue, setFrameworkValue] = React.useState('')

  return (
    <div className="max-w-md space-y-4 rounded-lg border p-6">
      <div className="space-y-2">
        <label htmlFor="framework-select" className="text-sm font-medium">
          Framework
        </label>
        <Popover open={frameworkOpen} onOpenChange={setFrameworkOpen}>
          <PopoverTrigger
            render={
              <Button
                id="framework-select"
                variant="outline"
                role="combobox"
                aria-expanded={frameworkOpen}
                className="w-full justify-between"
              />
            }
          >
            {frameworkValue
              ? frameworks.find((framework) => framework.value === frameworkValue)?.label
              : 'Select framework...'}
            <ChevronUpdownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setFrameworkValue(currentValue === frameworkValue ? '' : currentValue)
                        setFrameworkOpen(false)
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          frameworkValue === framework.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-500">
          Choose the framework you want to use for your project.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="language-select" className="text-sm font-medium">
          Programming Language
        </label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                id="language-select"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              />
            }
          >
            Select language...
            <ChevronUpdownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang) => (
                    <CommandItem key={lang.value} value={lang.value}>
                      <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                      {lang.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p className="text-sm text-gray-500">Select your preferred programming language.</p>
      </div>
    </div>
  )
}
