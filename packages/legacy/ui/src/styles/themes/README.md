# Themes

This directory contains pre-built theme files for the shadcn-uikit.

## Available Themes

### `acronis-default.scss`

The standard Acronis brand theme with the official color palette. This is the default theme applied to all applications.

### `acronis-ocean.scss`

An alternative blue-focused theme with deeper ocean tones. Provides a fresh, modern look while maintaining Acronis brand identity.

### `cyber-chat.scss`

A tech-focused theme designed for chat applications with bright cyber blue (#0285FF) and deep navy (#00204D). Features high contrast and modern aesthetics optimized for conversational interfaces.

### `_template.scss`

A template file for creating custom themes. Copy this file and customize the color values to create your own theme.

## Usage

### Import All Themes

```scss
@use '@acronis/shadcn-uikit/styles/themes';
```

### Import Specific Themes (Recommended)

```scss
@use '@acronis/shadcn-uikit/styles/themes/acronis-default';
@use '@acronis/shadcn-uikit/styles/themes/acronis-ocean';
@use '@acronis/shadcn-uikit/styles/themes/cyber-chat';
```

### Apply Theme via JavaScript

```typescript
import { applyTheme } from '@acronis/shadcn-uikit';

applyTheme('acronis-ocean');
// or
applyTheme('cyber-chat');
```

### Apply Theme via CSS Class

```html
<html class="theme-acronis-ocean">
  <!-- Your app -->
</html>

<!-- For cyber chat theme -->
<html class="theme-cyber-chat">
  <!-- Your chat app -->
</html>
```

## Creating Custom Themes

1. Copy `_template.scss` to a new file (e.g., `my-custom-theme.scss`)
2. Replace color values with your brand colors
3. Import the theme in your application
4. Apply using `applyTheme('my-custom')`

See the [THEMES.md](../../../../docs/THEMES.md) documentation for detailed instructions.

## Theme Structure

Each theme file contains:

1. **Primitive Tokens** - Raw color values from your design system
2. **Semantic Tokens** - Purpose-based mappings (light mode)
3. **Dark Mode Overrides** - Adjustments for dark mode
4. **Theme Classes** - CSS classes for applying the theme

## Color Format

All colors use HSL format without the `hsl()` wrapper:

```scss
--color-brand-primary: 210 100% 50%;
```

This format is required for Tailwind CSS compatibility.
