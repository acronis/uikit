# @acronis-platform/shadcn-uikit

Custom shadcn UI components library with multiple color schemes.

## Installation

```bash
npm install @acronis-platform/shadcn-uikit
# or
yarn add @acronis-platform/shadcn-uikit
# or
pnpm add @acronis-platform/shadcn-uikit
```

## Usage

### React

```tsx
import { Button, Input, Dialog } from '@acronis-platform/shadcn-uikit/react';
import '@acronis-platform/shadcn-uikit/styles';

function App() {
  return (
    <div>
      <Button variant="primary">Click me</Button>
      <Input placeholder="Enter text..." />
    </div>
  );
}
```

## Components

### React Components

- **Accordion** - Collapsible content sections
- **Alert** - Display important messages
- **Badge** - Small status indicators
- **Breadcrumb** - Navigation breadcrumbs
- **Button** - Interactive buttons with variants
- **Calendar** - Date selection calendar
- **Card** - Content containers
- **Carousel** - Image/content carousel
- **Checkbox** - Checkbox input
- **Chip** - Removable tags
- **Combobox** - Searchable select
- **Command** - Command palette
- **DataTable** - Feature-rich data tables
- **DatePicker** - Date picker input
- **Dialog** - Modal dialogs
- **Drawer** - Side panel drawer
- **DropdownMenu** - Dropdown menus
- **Empty** - Empty state displays
- **Filter** - Filter controls
- **Form** - Form components
- **Input** - Text input fields
- **Label** - Form labels
- **NavigationMenu** - Navigation menus
- **Pagination** - Pagination controls
- **Popover** - Popover tooltips
- **Progress** - Progress indicators
- **RadioGroup** - Radio button groups
- **ScrollArea** - Custom scroll areas
- **SecondaryMenu** - Secondary navigation
- **Select** - Select dropdowns
- **Separator** - Visual separators
- **Sidebar** - Sidebar navigation
- **Sonner** - Toast notifications
- **Spinner** - Loading spinners
- **Switch** - Toggle switches
- **Table** - Data tables
- **Tabs** - Tabbed interfaces
- **Tag** - Content tags
- **Textarea** - Multi-line text input
- **Tooltip** - Hover tooltips
- **Tree** - Hierarchical tree views

### Vue Components

- **AvButton** - Interactive buttons (more components coming soon)

## CSS Import Options

### Full CSS Bundle (Recommended for Quick Start)

```tsx
import '@acronis-platform/shadcn-uikit/styles/full';
```

- Size: ~200-300KB (uncompressed)
- Includes all Tailwind utilities (not purged)
- Best for: Rapid prototyping, small projects

### Optimized Bundle (Recommended for Production)

```tsx
import '@acronis-platform/shadcn-uikit/styles';
```

- Size: ~96KB (current bundle)
- Includes only CSS used in imported components
- Best for: Production builds

### Modular Imports (Advanced)

```tsx
import '@acronis-platform/shadcn-uikit/styles/base';
import '@acronis-platform/shadcn-uikit/styles/components';
import '@acronis-platform/shadcn-uikit/styles/utilities';
```

### Tokens Only

```tsx
import '@acronis-platform/shadcn-uikit/styles/tokens';
```

- Just CSS variables
- Use with Tailwind preset for custom builds

### Theme Styles

```tsx
import '@acronis-platform/shadcn-uikit/styles/themes/acronis-default';
import '@acronis-platform/shadcn-uikit/styles/themes/acronis-ocean';
import '@acronis-platform/shadcn-uikit/styles/themes/cyber-chat';
```

### Customization

You can customize the theme by overriding CSS variables:

```css
:root {
  --av-primary: 213 65% 46%; /* Acronis blue */
  --av-background: 0 0% 100%;
  --av-foreground: 215 26% 20%;
  /* ... more variables */
}
```

## Using with Tailwind CSS

If you're building your own Tailwind setup:

```javascript
// tailwind.config.js
import preset from '@acronis-platform/shadcn-uikit/tailwind-preset';

export default {
  presets: [preset],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@acronis-platform/shadcn-uikit/dist/**/*.js',
  ],
};
```

Then import only the tokens:

```tsx
import '@acronis-platform/shadcn-uikit/styles/tokens';
```

This approach:

- Gives you all design tokens as CSS variables
- Tailwind generates utilities based on preset configuration
- Smallest bundle size (only utilities you actually use)
- Full control over Tailwind configuration

### Customizing the Preset

You can extend or override the preset configuration:

```javascript
// tailwind.config.js
import preset from '@acronis-platform/shadcn-uikit/tailwind-preset';

export default {
  presets: [preset],
  theme: {
    extend: {
      colors: {
        // Add your custom colors
        brand: '#ff0000',
      },
    },
  },
};
```

## TypeScript

The library is written in TypeScript and includes type definitions out of the box.

```tsx
import type { ButtonProps } from '@acronis-platform/shadcn-uikit/react';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Design Tokens

All components follow the Acronis Design System specifications with design tokens extracted from Figma:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- And more...

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Migration Guide

### v0.14.x → v0.15.0

**No Breaking Changes** - All existing imports continue to work.

**Before:**

```tsx
import '@acronis-platform/shadcn-uikit/styles';
```

**After (same behavior):**

```tsx
import '@acronis-platform/shadcn-uikit/styles';
```

**New Options Available:**

- `styles/full` - Complete unpurged CSS
- `styles/tokens` - CSS variables only
- `styles/base`, `styles/components`, `styles/utilities` - Modular imports
- `tailwind-preset` - Tailwind configuration preset

## License

MIT © Acronis

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## Links

- [Documentation](https://github.com/acronis/shadcn-uikit)
- [GitHub Repository](https://github.com/acronis/shadcn-uikit)
- [Issue Tracker](https://github.com/acronis/shadcn-uikit/issues)
