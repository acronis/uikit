# Theme Architecture

## Overview

The shadcn-uikit uses a **3-layer token architecture** for theming:

```
Layer 1: Primitives (Figma colors)
    ↓
Layer 2: Semantic Tokens (purpose-based)
    ↓
Layer 3: Tailwind Tokens (utility classes)
    ↓
Components
```

## UI Package Token System (Production)

### Layer 1: Primitive Tokens (`primitives.scss`)

Foundation colors directly from Figma design system:

```scss
:root {
  /* Brand Colors */
  --color-brand-primary: 213 65% 46%;
  --color-brand-secondary: 211 100% 45%;

  /* Text Colors */
  --color-text-primary: 215 26% 20%;
  --color-text-inverse: 0 0% 100%;

  /* Status Colors */
  --color-status-success: 73 68% 45%;
  --color-status-danger: 0 77% 57%;
  // ... etc
}
```

**Purpose**: Raw color values that should NOT be used directly in components.

### Layer 2: Semantic Tokens (`semantic.scss`)

Purpose-based mappings that define color meaning:

```scss
:root {
  /* Map primitives to semantic purpose */
  --av-background: var(--color-surface-primary);
  --av-foreground: var(--color-text-primary);
  --av-primary: var(--color-brand-primary);
  --av-border: 213 65% 85%;
  // ... etc
}

.dark {
  /* Override for dark mode */
  --av-background: var(--color-text-primary);
  --av-foreground: var(--color-surface-primary);
  // ... etc
}
```

**Purpose**: Define what colors mean (background, foreground, primary, etc.) and enable theme switching.

### Layer 3: Tailwind Config

Maps semantic tokens to Tailwind utility classes:

```javascript
// packages/legacy/ui/tailwind.config.js
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--av-background))',
      foreground: 'hsl(var(--av-foreground))',
      primary: {
        DEFAULT: 'hsl(var(--av-primary))',
        foreground: 'hsl(var(--av-primary-foreground))',
      },
      // ... etc
    }
  }
}
```

**Purpose**: Enable Tailwind classes like `bg-background`, `text-primary`, etc.

### Benefits of This Architecture

✅ **Clear separation of concerns** - Each layer has a specific purpose  
✅ **Easy theming** - Change primitives or semantic mappings without touching components  
✅ **Dark mode support** - Override semantic tokens in `.dark` class  
✅ **Type safety** - HSL format works with Tailwind  
✅ **Figma alignment** - Primitives match design system exactly

## Demo Playground System (Development Tool)

The demo app includes a **separate theme playground** for testing custom themes:

### Single Source of Truth: `themeConfig.ts`

All playground theme mappings are defined in one place:

```typescript
// apps/demo/src/lib/playground/themeConfig.ts
export const THEME_COLOR_MAPPINGS: ThemeColorMapping[] = [
  {
    cssVar: '--av-background',
    tailwindKey: 'background',
    paletteKey: 'background',
  },
  // ... all other mappings
];
```

### How Playground Works

```
┌─────────────────────────────────────────┐
│      themeConfig.ts (Source of Truth)   │
│   THEME_COLOR_MAPPINGS: Array<Mapping>  │
└────────────┬────────────────────────────┘
             │
             ▼
      ┌──────────────────┐
      │  Runtime (JS)    │
      │  cssVariables.ts │
      └──────────────────┘
             │
             ▼
      document.style.setProperty()
```

**Purpose**: Allows developers to test custom color palettes by dynamically applying CSS variables at runtime.

### Playground Benefits

✅ **Single source of truth** - Change once, updates everywhere  
✅ **Type safety** - TypeScript validates all mappings  
✅ **Live preview** - See theme changes instantly  
✅ **No duplication** - Mappings defined once

### Runtime Implementation

```typescript
// apps/demo/src/lib/playground/cssVariables.ts
import { getCssVarToPaletteMap } from './themeConfig';

function applyColorPalette(root: HTMLElement, palette: ColorPalette): void {
  const colorMap = getCssVarToPaletteMap();

  Object.entries(colorMap).forEach(([cssVar, paletteKey]) => {
    const colorToken = palette[paletteKey as keyof ColorPalette];
    if (colorToken) {
      root.style.setProperty(cssVar, colorToken.css);
    }
  });
}
```

## File Locations

### UI Package (Production)

- `packages/legacy/ui/src/styles/tokens/primitives.scss` - Layer 1: Primitive tokens
- `packages/legacy/ui/src/styles/tokens/semantic.scss` - Layer 2: Semantic tokens
- `packages/legacy/ui/tailwind.config.js` - Layer 3: Tailwind config

### Demo Package (Playground)

- `apps/demo/src/lib/playground/themeConfig.ts` - Playground mappings
- `apps/demo/src/lib/playground/cssVariables.ts` - Runtime application
- `apps/demo/src/types/playground/tokens.ts` - Type definitions

## Recommended Approach: Token Order

The current **primitives → semantic → Tailwind** order is **excellent** and follows industry best practices:

✅ **Scalable** - Easy to add new themes or color schemes  
✅ **Maintainable** - Changes cascade through layers automatically  
✅ **Flexible** - Can swap entire color systems by changing primitives  
✅ **Standard** - Matches design token methodology used by major design systems

**Recommendation**: Keep this architecture. It's well-designed and production-ready.

## Proposed: Color Scheme Management

### Current Limitations

The UI package currently has:

- ❌ Only one color scheme (Acronis brand colors)
- ❌ Dark mode defined inline in `semantic.scss`
- ❌ No easy way for consumers to apply different themes

### Recommended Solution: CSS Class-Based Themes

Create separate CSS files for each color scheme that can be applied via classes:

```scss
// packages/legacy/ui/src/styles/themes/acronis-default.scss
.theme-acronis-default {
  &:root,
  &.light {
    --color-brand-primary: 213 65% 46%;
    --color-brand-secondary: 211 100% 45%;
    // ... all primitives
  }

  &.dark {
    --color-brand-primary: 213 65% 56%;
    // ... dark mode overrides
  }
}

// packages/legacy/ui/src/styles/themes/acronis-blue.scss
.theme-acronis-blue {
  &:root,
  &.light {
    --color-brand-primary: 210 100% 50%;
    // ... different blue palette
  }
}

// packages/legacy/ui/src/styles/themes/custom.scss
.theme-custom {
  // Consumer can override this file
}
```

### Implementation Plan

**1. Create theme files structure:**

```
packages/legacy/ui/src/styles/themes/
├── index.scss           # Export all themes
├── acronis-default.scss # Current Acronis theme
├── acronis-ocean.scss   # Alternative blue theme
└── _template.scss       # Template for custom themes
```

**2. Update semantic tokens to use CSS classes:**

```scss
// semantic.scss - Remove :root, use theme classes
@layer base {
  // Default theme applied to root
  :root {
    @include theme-acronis-default;
  }
}
```

**3. Provide theme switcher utility:**

```typescript
// packages/legacy/ui/src/utils/theme-switcher.ts
export function applyTheme(
  theme: 'acronis-default' | 'acronis-ocean' | 'custom'
) {
  document.documentElement.className = `theme-${theme}`;
}

export function applyColorMode(mode: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', mode === 'dark');
}
```

**4. Document usage:**

```typescript
// Consumer usage
import { applyTheme, applyColorMode } from '@acronis/shadcn-uikit';

// Apply theme
applyTheme('acronis-ocean');

// Toggle dark mode
applyColorMode('dark');
```

### Alternative Approaches Comparison

| Approach                               | Pros                                                                                          | Cons                                                                 | Recommendation          |
| -------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------- |
| **CSS Classes** (Recommended)          | ✅ No JS required<br>✅ SSR-friendly<br>✅ Fast switching<br>✅ Can bundle only needed themes | ❌ Larger CSS bundle if all themes included                          | **Best for production** |
| **Inline Styles (Current Playground)** | ✅ Dynamic<br>✅ Good for testing                                                             | ❌ No SSR<br>❌ Performance overhead<br>❌ Flash of unstyled content | Good for dev tools only |
| **JS Variables**                       | ✅ Type-safe<br>✅ Programmatic                                                               | ❌ Requires JS<br>❌ Runtime overhead<br>❌ Complex implementation   | Avoid for themes        |

### Recommended: Hybrid Approach

**For UI Package (Production):**

- Use CSS class-based themes (2-3 pre-built schemes)
- Ship with Acronis default + 1-2 alternatives
- Provide template for custom themes
- Document how to create custom themes

**For Demo Package (Development):**

- Keep current playground system for testing
- Add "Export to CSS" feature to generate theme files
- Use playground to prototype new themes

### Benefits of This Approach

✅ **Zero JS overhead** - Themes are pure CSS  
✅ **SSR compatible** - Works with server-side rendering  
✅ **Tree-shakeable** - Import only themes you need  
✅ **Fast switching** - Just change a class name  
✅ **Easy customization** - Override CSS variables  
✅ **Multiple schemes** - Ship 2-3 pre-built themes  
✅ **Developer-friendly** - Clear documentation and templates
