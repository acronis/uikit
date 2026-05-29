import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@acronis-platform/shadcn-uikit';

const countries = [
  { code: 'af', name: 'Afghanistan' },
  { code: 'al', name: 'Albania' },
  { code: 'dz', name: 'Algeria' },
  { code: 'ar', name: 'Argentina' },
  { code: 'au', name: 'Australia' },
  { code: 'at', name: 'Austria' },
  { code: 'bd', name: 'Bangladesh' },
  { code: 'be', name: 'Belgium' },
  { code: 'br', name: 'Brazil' },
  { code: 'ca', name: 'Canada' },
  { code: 'cl', name: 'Chile' },
  { code: 'cn', name: 'China' },
  { code: 'co', name: 'Colombia' },
  { code: 'dk', name: 'Denmark' },
  { code: 'eg', name: 'Egypt' },
  { code: 'fi', name: 'Finland' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'gr', name: 'Greece' },
  { code: 'in', name: 'India' },
  { code: 'id', name: 'Indonesia' },
  { code: 'ie', name: 'Ireland' },
  { code: 'il', name: 'Israel' },
  { code: 'it', name: 'Italy' },
  { code: 'jp', name: 'Japan' },
  { code: 'mx', name: 'Mexico' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'no', name: 'Norway' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'pl', name: 'Poland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'ru', name: 'Russia' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'sg', name: 'Singapore' },
  { code: 'za', name: 'South Africa' },
  { code: 'kr', name: 'South Korea' },
  { code: 'es', name: 'Spain' },
  { code: 'se', name: 'Sweden' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'th', name: 'Thailand' },
  { code: 'tr', name: 'Turkey' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'ae', name: 'United Arab Emirates' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'us', name: 'United States' },
  { code: 'vn', name: 'Vietnam' },
]

export function ScrollableSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
