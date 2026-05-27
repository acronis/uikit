#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ComponentInfo {
  name: string;
  file: string;
  description: string;
  variants?: string[];
  sizes?: string[];
}

const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  accordion: 'Collapsible content sections with expand/collapse functionality',
  'alert-dialog': 'Modal dialog for important confirmations and alerts',
  alert: 'Contextual feedback messages for user actions',
  avatar: 'User profile image with fallback support',
  badge: 'Small status indicators and labels',
  breadcrumb: 'Navigation trail showing current page location',
  button: 'Interactive button with multiple variants and sizes',
  'button-group': 'Group of related buttons with consistent styling',
  calendar: 'Date picker calendar component',
  card: 'Container with header, content, and footer sections',
  carousel: 'Image/content slider with navigation controls',
  chart: 'Data visualization charts using Recharts',
  checkbox: 'Toggle input for binary choices',
  chip: 'Compact element for tags, filters, or selections',
  combobox: 'Searchable dropdown with autocomplete',
  command: 'Command palette for keyboard-driven navigation',
  'data-table': 'Feature-rich table with sorting, filtering, and pagination',
  'date-picker': 'Date selection input with calendar popup',
  dialog: 'Modal overlay for focused content and forms',
  drawer: 'Slide-out panel from screen edge',
  'dropdown-menu': 'Contextual menu with actions and options',
  empty: 'Empty state placeholder with icon and actions',
  field: 'Form field wrapper with label and validation',
  filter: 'Data filtering controls',
  form: 'Form handling with validation using react-hook-form',
  input: 'Text input field',
  label: 'Form field label',
  'navigation-menu': 'Main navigation menu with dropdowns',
  pagination: 'Page navigation controls',
  popover: 'Floating content container',
  progress: 'Progress indicator bar',
  'radio-group': 'Mutually exclusive option selector',
  'scroll-area': 'Custom scrollable container',
  'secondary-menu': 'Secondary navigation menu',
  select: 'Dropdown selection input',
  separator: 'Visual divider between content',
  sheet: 'Slide-out panel similar to drawer',
  sidebar: 'Collapsible side navigation panel',
  skeleton: 'Loading placeholder animation',
  sonner: 'Toast notification system',
  spinner: 'Loading spinner indicator',
  switch: 'Toggle switch for on/off states',
  table: 'Basic table layout components',
  tabs: 'Tabbed content switcher',
  tag: 'Label or category indicator',
  textarea: 'Multi-line text input',
  tooltip: 'Contextual hint on hover',
  tree: 'Hierarchical tree view',
};

function extractComponentInfo(componentFile: string): ComponentInfo | null {
  const fileName = path.basename(componentFile, '.tsx');
  const content = fs.readFileSync(componentFile, 'utf-8');

  const info: ComponentInfo = {
    name: fileName,
    file: fileName,
    description: COMPONENT_DESCRIPTIONS[fileName] || 'UI component',
  };

  // Extract variants from cva definition
  const variantsMatch = content.match(/variants:\s*{([^}]+)}/s);
  if (variantsMatch) {
    const variantMatch = variantsMatch[1].match(/variant:\s*{([^}]+)}/s);
    if (variantMatch) {
      const variants = variantMatch[1].match(/(\w+):/g);
      if (variants) {
        info.variants = variants.map((v) => v.replace(':', ''));
      }
    }

    const sizeMatch = variantsMatch[1].match(/size:\s*{([^}]+)}/s);
    if (sizeMatch) {
      const sizes = sizeMatch[1].match(/(\w+):/g);
      if (sizes) {
        info.sizes = sizes.map((s) => s.replace(':', ''));
      }
    }
  }

  return info;
}

function generateLlmsTxt(): string {
  const componentsDir = path.join(__dirname, '../src/components/ui');
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
  );

  // Get all component files
  const componentFiles = fs
    .readdirSync(componentsDir)
    .filter((file) => file.endsWith('.tsx') && !file.includes('test'))
    .sort();

  const components: ComponentInfo[] = componentFiles
    .map((file) => extractComponentInfo(path.join(componentsDir, file)))
    .filter((c): c is ComponentInfo => c !== null);

  // Generate llms.txt content
  let content = `# ${packageJson.name}\n\n`;
  content += `> ${packageJson.description}\n\n`;
  content += `A React component library built on shadcn/ui principles with Radix UI primitives and Tailwind CSS. Provides ${components.length} production-ready components with TypeScript support, multiple variants, and full accessibility.\n\n`;

  content += `**Key Features:**\n`;
  content += `- Built with React 18+ and TypeScript\n`;
  content += `- Radix UI primitives for accessibility\n`;
  content += `- Tailwind CSS for styling with CSS variables\n`;
  content += `- Class Variance Authority (CVA) for variant management\n`;
  content += `- Dark mode support with next-themes\n`;
  content += `- Fully customizable through CSS variables\n\n`;

  content += `**Important Notes:**\n`;
  content += `- All components use the "av-" prefix for CSS classes\n`;
  content += `- CSS variables follow the pattern: --av-[property]\n`;
  content += `- Components support \`className\` prop for custom styling\n`;
  content += `- Import from '@acronis-platform/shadcn-uikit/react' for React components\n\n`;

  // Getting Started section
  content += `## Getting Started\n\n`;
  content += `- [Installation Guide](https://github.com/acronis/shadcn-uikit/blob/main/apps/docs/GETTING_STARTED.md): Complete setup instructions with Tailwind configuration\n`;
  content += `- [Architecture Overview](https://github.com/acronis/shadcn-uikit/blob/main/apps/docs/ARCHITECTURE.md): Project structure and design decisions\n`;
  content += `- [Main README](https://github.com/acronis/shadcn-uikit/blob/main/README.md): Project overview and quick start\n\n`;

  // Basic Usage Examples
  content += `## Usage Examples\n\n`;
  content += `**Basic Button:**\n`;
  content += `\`\`\`tsx\n`;
  content += `import { Button } from '@acronis-platform/shadcn-uikit/react';\n\n`;
  content += `<Button variant="default">Click me</Button>\n`;
  content += `<Button variant="destructive" size="lg">Delete</Button>\n`;
  content += `\`\`\`\n\n`;

  content += `**Card with Form:**\n`;
  content += `\`\`\`tsx\n`;
  content += `import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@acronis-platform/shadcn-uikit/react';\n\n`;
  content += `<Card>\n`;
  content += `  <CardHeader>\n`;
  content += `    <CardTitle>Login</CardTitle>\n`;
  content += `  </CardHeader>\n`;
  content += `  <CardContent>\n`;
  content += `    <Input placeholder="Email" />\n`;
  content += `    <Button>Submit</Button>\n`;
  content += `  </CardContent>\n`;
  content += `</Card>\n`;
  content += `\`\`\`\n\n`;

  content += `**Dialog:**\n`;
  content += `\`\`\`tsx\n`;
  content += `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, Button } from '@acronis-platform/shadcn-uikit/react';\n\n`;
  content += `<Dialog>\n`;
  content += `  <DialogTrigger asChild>\n`;
  content += `    <Button>Open Dialog</Button>\n`;
  content += `  </DialogTrigger>\n`;
  content += `  <DialogContent>\n`;
  content += `    <DialogHeader>\n`;
  content += `      <DialogTitle>Dialog Title</DialogTitle>\n`;
  content += `    </DialogHeader>\n`;
  content += `    <p>Dialog content goes here</p>\n`;
  content += `  </DialogContent>\n`;
  content += `</Dialog>\n`;
  content += `\`\`\`\n\n`;

  // Components section
  content += `## Components\n\n`;

  // Group components by category
  const categories = {
    'Form Inputs': [
      'input',
      'textarea',
      'select',
      'checkbox',
      'radio-group',
      'switch',
      'combobox',
      'date-picker',
      'calendar',
    ],
    'Buttons & Actions': ['button', 'button-group'],
    Layout: ['card', 'separator', 'scroll-area', 'sidebar', 'tabs'],
    Navigation: [
      'navigation-menu',
      'secondary-menu',
      'breadcrumb',
      'pagination',
    ],
    Overlays: [
      'dialog',
      'alert-dialog',
      'drawer',
      'sheet',
      'popover',
      'tooltip',
    ],
    Feedback: ['alert', 'progress', 'spinner', 'skeleton', 'sonner', 'empty'],
    'Data Display': [
      'table',
      'data-table',
      'badge',
      'chip',
      'tag',
      'avatar',
      'carousel',
      'chart',
      'tree',
      'accordion',
    ],
    Forms: ['form', 'field', 'label', 'filter'],
    Menus: ['dropdown-menu', 'command'],
  };

  Object.entries(categories).forEach(([category, componentNames]) => {
    const categoryComponents = components.filter((c) =>
      componentNames.includes(c.name)
    );
    if (categoryComponents.length === 0) return;

    content += `**${category}:**\n`;
    categoryComponents.forEach((comp) => {
      content += `- **${comp.name}**: ${comp.description}`;
      if (comp.variants && comp.variants.length > 0) {
        content += ` (variants: ${comp.variants.join(', ')})`;
      }
      if (comp.sizes && comp.sizes.length > 0) {
        content += ` (sizes: ${comp.sizes.join(', ')})`;
      }
      content += `\n`;
    });
    content += `\n`;
  });

  // Styling section
  content += `## Styling & Customization\n\n`;
  content += `- [Tailwind Configuration](https://github.com/acronis/shadcn-uikit/blob/main/apps/docs/GETTING_STARTED.md#configure-tailwind-css): Required Tailwind setup\n`;
  content += `- CSS Variables: Override theme colors using \`--av-primary\`, \`--av-background\`, etc.\n`;
  content += `- Dark Mode: Add \`dark\` class to root element\n`;
  content += `- Custom Variants: Use \`cn()\` utility to merge classes\n\n`;

  // Dependencies section
  content += `## Optional\n\n`;
  content += `- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction): Underlying primitive components\n`;
  content += `- [Tailwind CSS Documentation](https://tailwindcss.com/docs): Styling framework\n`;
  content += `- [Class Variance Authority](https://cva.style/docs): Variant management\n`;
  content += `- [React Hook Form](https://react-hook-form.com/): Form handling (used in form components)\n`;
  content += `- [Recharts Documentation](https://recharts.org/): Chart library (used in chart component)\n`;

  return content;
}

function main() {
  try {
    const content = generateLlmsTxt();
    const outputPath = path.join(__dirname, '../dist/llms.txt');

    // Ensure dist directory exists
    const distDir = path.dirname(outputPath);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log('✓ Generated llms.txt successfully at:', outputPath);
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    process.exit(1);
  }
}

main();
