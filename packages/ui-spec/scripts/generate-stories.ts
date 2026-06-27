/**
 * Generate Storybook stories from component specs.
 *
 * Drives output from each state's `kind` (see anatomy.yaml):
 *   - kind=prop     → static matrix / variations (snapshot by passing props)
 *   - kind=pseudo   → a story per CSS pseudo-state. `:hover`/`:active` emit
 *                     addon-ready `parameters.pseudo` (needs a pseudo-states
 *                     addon to paint); `:focus-visible` is driven by a real
 *                     `play` tab() so it works without one.
 *   - kind=internal → an Interaction `play` story that performs the real
 *                     interaction so the component lands in the after-interaction
 *                     state (e.g. Switch click → checked).
 *
 * Output: packages/ui-react/src/components/ui/<name>/__stories__/<name>.generated.stories.tsx
 * Run:    pnpm --filter @acronis-platform/ui-spec generate:stories
 *
 * NOTE (spike limitation): the state *axes* are spec-derived; the small
 * per-component "how to instantiate" hint below (sample content, aria-label) is
 * not yet in the spec — a future `story` hint in api.yaml would remove it.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listComponentNames, loadSpec } from '../lib/load';
import type { AnatomySpec, ApiSpec } from '../types';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI_REACT_UI = resolve(PKG_ROOT, '../ui-react/src/components/ui');

interface RenderHint {
  sample?: string;
  extraImports?: string[];
  ariaLabel?: string;
  /** Fixed prop string applied to every generated instance, for components
   *  driven by props rather than children (e.g. CardFilter's `label`/`value`). */
  props?: string;
  /** Root component/import to render when it differs from `index.component`
   *  (e.g. Resizable's root export is `ResizablePanelGroup`). */
  root?: string;
  /** Skip story generation entirely — for imperative components whose static
   *  render shows nothing (e.g. Toast: the region is empty until `toast()` is
   *  called, so a generated "All States" story is a blank snapshot). Such
   *  components rely on their hand-written stories for VR. */
  skip?: boolean;
}

const RENDER: Record<string, RenderHint> = {
  avatar: {
    extraImports: ["import { AvatarFallback } from '../avatar';"],
    sample: '\n      <AvatarFallback>SN</AvatarFallback>\n    ',
  },
  button: { sample: 'Label' },
  'button-menu': { sample: 'Label' },
  chip: { sample: 'Label' },
  'card-filter': {
    extraImports: [
      "import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    props: 'label="Active filters" value="125" icon={<CircleInfoIcon />}',
  },
  sheet: {
    props: 'defaultOpen',
    extraImports: [
      "import { SheetContent, SheetHeader, SheetTitle, SheetCloseButton, SheetBody, SheetDescription, SheetFooter } from '../sheet';",
      "import { Button } from '../../button';",
    ],
    sample: [
      '',
      '      <SheetContent>',
      '        <SheetHeader>',
      '          <SheetTitle>Workload details</SheetTitle>',
      '          <SheetCloseButton />',
      '        </SheetHeader>',
      '        <SheetBody>',
      '          <SheetDescription>Inspect the selected workload.</SheetDescription>',
      '        </SheetBody>',
      '        <SheetFooter>',
      '          <Button>Edit</Button>',
      '        </SheetFooter>',
      '      </SheetContent>',
      '    ',
    ].join('\n'),
  },
  dialog: {
    props: 'defaultOpen',
    extraImports: [
      "import { DialogContent, DialogHeader, DialogTitle, DialogCloseButton, DialogBody, DialogDescription, DialogFooter } from '../dialog';",
      "import { Button } from '../../button';",
    ],
    sample: [
      '',
      '      <DialogContent>',
      '        <DialogHeader>',
      '          <DialogTitle>Are you absolutely sure?</DialogTitle>',
      '          <DialogCloseButton />',
      '        </DialogHeader>',
      '        <DialogBody>',
      '          <DialogDescription>This action cannot be undone.</DialogDescription>',
      '        </DialogBody>',
      '        <DialogFooter>',
      '          <Button variant="ghost">Cancel</Button>',
      '          <Button variant="destructive">Delete</Button>',
      '        </DialogFooter>',
      '      </DialogContent>',
      '    ',
    ].join('\n'),
  },
  popover: {
    props: 'defaultOpen',
    extraImports: [
      "import { PopoverTrigger, PopoverContent } from '../popover';",
    ],
    sample: [
      '',
      '      <PopoverTrigger>Open</PopoverTrigger>',
      '      <PopoverContent>',
      '        <div className="grid gap-2">',
      '          <h4 className="font-medium leading-none">Dimensions</h4>',
      '          <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>',
      '        </div>',
      '      </PopoverContent>',
      '    ',
    ].join('\n'),
  },
  tabs: {
    props: 'defaultValue="account"',
    extraImports: [
      "import { TabsList, TabsTrigger, TabsContent } from '../tabs';",
    ],
    sample: [
      '',
      '      <TabsList className="grid w-[400px] grid-cols-2">',
      '        <TabsTrigger value="account">Account</TabsTrigger>',
      '        <TabsTrigger value="password">Password</TabsTrigger>',
      '      </TabsList>',
      '      <TabsContent value="account">Account settings</TabsContent>',
      '      <TabsContent value="password">Password settings</TabsContent>',
      '    ',
    ].join('\n'),
  },
  table: {
    extraImports: [
      "import { TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '../table';",
    ],
    sample: [
      '',
      '      <TableCaption>Recent invoices</TableCaption>',
      '      <TableHeader>',
      '        <TableRow>',
      '          <TableHead sortable sortDirection="asc">Invoice</TableHead>',
      '          <TableHead>Status</TableHead>',
      '          <TableHead className="text-right">Amount</TableHead>',
      '        </TableRow>',
      '      </TableHeader>',
      '      <TableBody>',
      '        <TableRow>',
      '          <TableCell>INV001</TableCell>',
      '          <TableCell>Paid</TableCell>',
      '          <TableCell className="text-right">$250.00</TableCell>',
      '        </TableRow>',
      '        <TableRow selected>',
      '          <TableCell>INV002</TableCell>',
      '          <TableCell>Pending</TableCell>',
      '          <TableCell className="text-right">$150.00</TableCell>',
      '        </TableRow>',
      '      </TableBody>',
      '    ',
    ].join('\n'),
  },
  'dropdown-menu': {
    props: 'defaultOpen',
    extraImports: [
      "import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '../dropdown-menu';",
    ],
    sample: [
      '',
      '      <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>',
      '      <DropdownMenuContent className="w-56">',
      '        <DropdownMenuLabel>My account</DropdownMenuLabel>',
      '        <DropdownMenuSeparator />',
      '        <DropdownMenuItem>Profile</DropdownMenuItem>',
      '        <DropdownMenuItem>Settings</DropdownMenuItem>',
      '        <DropdownMenuItem>Log out</DropdownMenuItem>',
      '      </DropdownMenuContent>',
      '    ',
    ].join('\n'),
  },
  empty: {
    extraImports: [
      "import { EmptyIcon, EmptyHeader, EmptyTitle, EmptyDescription } from '../empty';",
      "import { InboxIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    sample: [
      '',
      '      <EmptyIcon>',
      '        <InboxIcon />',
      '      </EmptyIcon>',
      '      <EmptyHeader>',
      '        <EmptyTitle>No messages</EmptyTitle>',
      '        <EmptyDescription>You have no messages yet.</EmptyDescription>',
      '      </EmptyHeader>',
      '    ',
    ].join('\n'),
  },
  card: {
    extraImports: [
      "import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';",
    ],
    sample: [
      '',
      '      <CardHeader>',
      '        <CardTitle>Backup status</CardTitle>',
      '        <CardDescription>Last run 5 minutes ago.</CardDescription>',
      '      </CardHeader>',
      '      <CardContent>All workloads protected.</CardContent>',
      '      <CardFooter>Footer</CardFooter>',
      '    ',
    ].join('\n'),
  },
  'widget-placeholder': {
    extraImports: [
      "import { WidgetPlaceholderHeader, WidgetPlaceholderIcon, WidgetPlaceholderTitle, WidgetPlaceholderContent, WidgetPlaceholderImage, WidgetPlaceholderText, WidgetPlaceholderAction } from '../widget-placeholder';",
      "import { ChartBarVerticalIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    sample: [
      '',
      '      <WidgetPlaceholderHeader>',
      '        <WidgetPlaceholderIcon><ChartBarVerticalIcon /></WidgetPlaceholderIcon>',
      '        <WidgetPlaceholderTitle>Backup statistics</WidgetPlaceholderTitle>',
      '      </WidgetPlaceholderHeader>',
      '      <WidgetPlaceholderContent>',
      '        <WidgetPlaceholderImage><ChartBarVerticalIcon /></WidgetPlaceholderImage>',
      '        <WidgetPlaceholderText>No data available yet</WidgetPlaceholderText>',
      '        <WidgetPlaceholderAction>Set up backup plan</WidgetPlaceholderAction>',
      '      </WidgetPlaceholderContent>',
      '    ',
    ].join('\n'),
  },
  'button-icon': {
    sample: '<PlusIcon />',
    extraImports: [
      "import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    ariaLabel: 'Action',
  },
  switch: { ariaLabel: 'Toggle' },
  checkbox: { ariaLabel: 'Accept' },
  radio: {
    ariaLabel: 'Plan',
    extraImports: ["import { Radio } from '../radio';"],
    sample: [
      '',
      '      <Radio value="a" aria-label="Option A" />',
      '      <Radio value="b" aria-label="Option B" />',
      '    ',
    ].join('\n'),
  },
  input: { ariaLabel: 'Email' },
  'input-date-picker': { props: 'label="Due" placeholder="Pick a date"' },
  'input-search': { props: 'label="Find" placeholder="Search table"' },
  'input-select': {
    extraImports: [
      "import { InputSelectField, InputSelectLabel, InputSelectTrigger, InputSelectValue, InputSelectContent, InputSelectItem } from '../input-select';",
    ],
    sample: [
      '',
      '      <InputSelectField>',
      '        <InputSelectLabel>Fruit</InputSelectLabel>',
      '        <InputSelectTrigger>',
      '          <InputSelectValue placeholder="Select an option" />',
      '        </InputSelectTrigger>',
      '      </InputSelectField>',
      '      <InputSelectContent>',
      '        <InputSelectItem value="apple">Apple</InputSelectItem>',
      '        <InputSelectItem value="banana">Banana</InputSelectItem>',
      '      </InputSelectContent>',
      '    ',
    ].join('\n'),
  },
  'input-text': { props: 'label="Email" placeholder="you@example.com"' },
  'input-text-area': { props: 'label="Bio" placeholder="Tell us about yourself"' },
  link: { sample: 'Link', props: 'href="#"' },
  search: { ariaLabel: 'Search' },
  tooltip: {
    extraImports: [
      "import { TooltipTrigger, TooltipContent } from '../tooltip';",
    ],
    sample: [
      '',
      '      <TooltipTrigger>Hover me</TooltipTrigger>',
      '      <TooltipContent>Helpful hint</TooltipContent>',
      '    ',
    ].join('\n'),
  },
  tag: { sample: 'Label' },
  select: {
    extraImports: [
      "import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';",
    ],
    sample: [
      '',
      '      <SelectTrigger aria-label="Fruit">',
      '        <SelectValue placeholder="Select an option" />',
      '      </SelectTrigger>',
      '      <SelectContent>',
      '        <SelectItem value="apple">Apple</SelectItem>',
      '        <SelectItem value="banana">Banana</SelectItem>',
      '      </SelectContent>',
      '    ',
    ].join('\n'),
  },
  'sidebar-primary': {
    ariaLabel: 'Primary',
    extraImports: [
      "import { SidebarPrimaryHeader, SidebarPrimaryContent, SidebarPrimaryFooter, SidebarPrimarySection, SidebarPrimaryMenu, SidebarPrimaryMenuItem, SidebarPrimaryMenuItemExtras } from '../sidebar-primary';",
      "import { BoxIcon, UsersIcon, CircleHelpIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    sample: [
      '',
      '      <SidebarPrimaryHeader>',
      '        <svg width={24} height={24} />',
      '      </SidebarPrimaryHeader>',
      '      <SidebarPrimaryContent>',
      '        <SidebarPrimarySection>',
      '          <SidebarPrimaryMenu>',
      '            <SidebarPrimaryMenuItem href="#" icon={<BoxIcon />} selected>',
      '              Assets',
      '            </SidebarPrimaryMenuItem>',
      '            <SidebarPrimaryMenuItem href="#" icon={<UsersIcon />}>',
      '              Clients',
      '              <SidebarPrimaryMenuItemExtras variant="shortcut" shortcut="⌘K" />',
      '            </SidebarPrimaryMenuItem>',
      '          </SidebarPrimaryMenu>',
      '        </SidebarPrimarySection>',
      '      </SidebarPrimaryContent>',
      '      <SidebarPrimaryFooter>',
      '        <SidebarPrimaryMenu>',
      '          <SidebarPrimaryMenuItem href="#" icon={<CircleHelpIcon />}>',
      '            Help',
      '          </SidebarPrimaryMenuItem>',
      '        </SidebarPrimaryMenu>',
      '      </SidebarPrimaryFooter>',
      '    ',
    ].join('\n'),
  },
  'sidebar-secondary': {
    ariaLabel: 'Section navigation',
    extraImports: [
      "import { SidebarSecondaryHeader, SidebarSecondaryContent, SidebarSecondaryCollapsedBreadcrumb, SidebarSecondaryFooter, SidebarSecondarySection, SidebarSecondarySectionLabel, SidebarSecondaryMenu, SidebarSecondaryMenuItem, SidebarSecondaryMenuSub, SidebarSecondaryMenuSubTrigger, SidebarSecondaryMenuSubContent, SidebarSecondaryMenuSubItem, SidebarSecondaryMenuItemExtras } from '../sidebar-secondary';",
      "import { LayoutGridIcon, BoxIcon } from '@acronis-platform/icons-react/stroke-mono';",
    ],
    sample: [
      '',
      '      <SidebarSecondaryHeader label="Protection" />',
      '      <SidebarSecondaryContent>',
      '        <SidebarSecondarySection>',
      '          <SidebarSecondarySectionLabel>Overview</SidebarSecondarySectionLabel>',
      '          <SidebarSecondaryMenu>',
      '            <SidebarSecondaryMenuItem href="#" icon={<LayoutGridIcon />} selected>',
      '              Dashboard',
      '              <SidebarSecondaryMenuItemExtras variant="externalLink" />',
      '            </SidebarSecondaryMenuItem>',
      '            <SidebarSecondaryMenuSub defaultOpen>',
      '              <SidebarSecondaryMenuSubTrigger icon={<BoxIcon />}>',
      '                Policies',
      '              </SidebarSecondaryMenuSubTrigger>',
      '              <SidebarSecondaryMenuSubContent>',
      '                <SidebarSecondaryMenuSubItem href="#" selected>',
      '                  Backup',
      '                </SidebarSecondaryMenuSubItem>',
      '                <SidebarSecondaryMenuSubItem href="#">',
      '                  Antivirus',
      '                </SidebarSecondaryMenuSubItem>',
      '              </SidebarSecondaryMenuSubContent>',
      '            </SidebarSecondaryMenuSub>',
      '          </SidebarSecondaryMenu>',
      '        </SidebarSecondarySection>',
      '      </SidebarSecondaryContent>',
      '      <SidebarSecondaryCollapsedBreadcrumb parentLabel="Protection" currentLabel="Dashboard" />',
      '      <SidebarSecondaryFooter>',
      '        <SidebarSecondaryMenu>',
      '          <SidebarSecondaryMenuItem href="#">Settings</SidebarSecondaryMenuItem>',
      '        </SidebarSecondaryMenu>',
      '      </SidebarSecondaryFooter>',
      '    ',
    ].join('\n'),
  },
  toast: {
    // Imperative: the region is empty until `toast()` is called, so a generated
    // "All States" story would be a blank snapshot. VR is covered by the
    // hand-written stories (Default / Variants / WithAction).
    skip: true,
  },
  'data-table': {
    // Generic with required `columns`/`data` (TanStack column defs) — there's no
    // meaningful zero-arg render. VR is covered by the hand-written stories.
    skip: true,
  },
  chart: {
    // A recharts composition: ChartContainer needs a sized box and a plot built
    // from recharts primitives — no meaningful zero-arg render. VR is covered by
    // the hand-written stories (Bars / Lines / Areas / Pies / StackedBars).
    skip: true,
  },
  field: {
    // A multi-part composition: Field needs a label + control + description as
    // children to render meaningfully. VR is covered by the hand-written stories
    // (Default / WithError / Disabled / Horizontal / CheckboxGroup / Grouped).
    skip: true,
  },
  form: {
    // A <form> that needs Field children + a submit control to render anything
    // meaningful. VR is covered by the hand-written stories (Default /
    // WithServerErrors).
    skip: true,
  },
  alert: {
    // A composition needing AlertIcon/AlertContent/AlertTitle/AlertDescription
    // children to render meaningfully. VR is covered by the hand-written stories
    // (Default / Destructive / AllVariants).
    skip: true,
  },
  skeleton: {
    // A bare sized box — meaningful only with a caller-supplied size className.
    // VR is covered by the hand-written stories (Default / Card).
    skip: true,
  },
  combobox: {
    // A multi-part composition needing items + input + list children to render
    // meaningfully. VR is covered by the hand-written stories (Default / Open).
    skip: true,
  },
  'progress-circle': {
    // Driven by `value`; render a representative filled ring (per size grid).
    props: 'value={75} showValue',
  },
  'description-list': {
    extraImports: [
      "import { DescriptionListItem, DescriptionListLabel, DescriptionListValue, DescriptionListValueDescription } from '../description-list';",
    ],
    sample: [
      '',
      '      <DescriptionListItem>',
      '        <DescriptionListLabel>Backup</DescriptionListLabel>',
      '        <DescriptionListValue>',
      '          <div>',
      '            Success',
      '            <DescriptionListValueDescription>150GB backed up</DescriptionListValueDescription>',
      '          </div>',
      '        </DescriptionListValue>',
      '      </DescriptionListItem>',
      '    ',
    ].join('\n'),
  },
  resizable: {
    root: 'ResizablePanelGroup',
    ariaLabel: 'Resizable example',
    extraImports: ["import { ResizablePanel, ResizableHandle } from '../resizable';"],
    sample: [
      '',
      '      <ResizablePanel defaultSize={50}>One</ResizablePanel>',
      '      <ResizableHandle withHandle />',
      '      <ResizablePanel defaultSize={50}>Two</ResizablePanel>',
      '    ',
    ].join('\n'),
  },
  breadcrumb: {
    ariaLabel: 'breadcrumb',
    extraImports: [
      "import { BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '../breadcrumb';",
    ],
    sample: [
      '',
      '      <BreadcrumbList>',
      '        <BreadcrumbItem>',
      '          <BreadcrumbLink href="#">Home</BreadcrumbLink>',
      '        </BreadcrumbItem>',
      '        <BreadcrumbSeparator />',
      '        <BreadcrumbItem>',
      '          <BreadcrumbLink href="#">Products</BreadcrumbLink>',
      '        </BreadcrumbItem>',
      '        <BreadcrumbSeparator />',
      '        <BreadcrumbItem>',
      '          <BreadcrumbPage>Settings</BreadcrumbPage>',
      '        </BreadcrumbItem>',
      '      </BreadcrumbList>',
      '    ',
    ].join('\n'),
  },
};

const HEADER =
  '// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.\n' +
  '// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories\n' +
  '// `:hover` / `:active` stories require a Storybook pseudo-states addon to paint.\n';

const PSEUDO_KEY: Record<string, string> = {
  ':hover': 'hover',
  ':active': 'active',
  ':focus': 'focus',
};

function enumMembers(api: ApiSpec, prop: string): string[] {
  const p = api.contract.properties.find((x) => x.name === prop);
  if (!p) return [];
  return [...p.type.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const hasProp = (api: ApiSpec, name: string): boolean =>
  api.contract.properties.some((p) => p.name === name);

const arr = (values: string[]): string =>
  `[${values.map((v) => `'${v}'`).join(', ')}] as const`;

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

function buildStories(
  comp: string,
  api: ApiSpec,
  anatomy: AnatomySpec,
  hint: RenderHint
): { body: string; needsPlay: boolean } {
  const variants = enumMembers(api, 'variant');
  const sizes = enumMembers(api, 'size');
  const label =
    (hint.ariaLabel ? ` aria-label="${hint.ariaLabel}"` : '') +
    (hint.props ? ` ${hint.props}` : '');
  const children = hint.sample ?? '';
  const inst = (props: string) =>
    children ? `<${comp}${props}>${children}</${comp}>` : `<${comp}${props} />`;
  const base = inst(label);

  const parts: string[] = [];

  // ── kind=prop: static matrix / variations ──
  if (variants.length && sizes.length) {
    parts.push(`const VARIANTS = ${arr(variants)};
const SIZES = ${arr(sizes)};

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: \`repeat(\${SIZES.length + 1}, max-content)\`,
        gap: 12,
        alignItems: 'center',
      }}
    >
      <span />
      {SIZES.map((s) => (
        <span key={s} style={{ fontSize: 12, opacity: 0.6 }}>
          {s}
        </span>
      ))}
      {VARIANTS.flatMap((v) => [
        <span key={\`\${v}-label\`} style={{ fontSize: 12, opacity: 0.6 }}>
          {v}
        </span>,
        ...SIZES.map((s) => ${inst(label + ' key={`${v}-${s}`} variant={v} size={s}')}),
      ])}
    </div>
  ),
};`);
    // Only emit the all-variants Disabled grid when the component actually has a
    // `disabled` prop (e.g. Button does; Tag doesn't).
    if (hasProp(api, 'disabled')) {
      parts.push(`export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {VARIANTS.map((v) => ${inst(label + ' key={v} variant={v} disabled')})}
    </div>
  ),
};`);
    }
  } else if (variants.length) {
    // Variants but no size axis (e.g. Button has a single size): list each variant.
    parts.push(`const VARIANTS = ${arr(variants)};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => ${inst(label + ' key={v} variant={v}')})}
    </div>
  ),
};`);
    if (hasProp(api, 'disabled')) {
      parts.push(`export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      {VARIANTS.map((v) => ${inst(label + ' key={v} variant={v} disabled')})}
    </div>
  ),
};`);
    }
  } else if (hasProp(api, 'checked')) {
    parts.push(`export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <${comp} aria-label="Off" />
      <${comp} aria-label="On" defaultChecked />
      <${comp} aria-label="Disabled off" disabled />
      <${comp} aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};`);
  } else {
    // Only show a disabled instance when the component actually has a
    // `disabled` prop — composable components (e.g. breadcrumb) do not.
    const disabledInst = hasProp(api, 'disabled')
      ? `\n      ${inst(`${label} disabled`)}`
      : '';
    parts.push(`export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      ${inst(label)}${disabledInst}
    </div>
  ),
};`);
  }

  // ── kind=pseudo: one story per pseudo-state ──
  let needsPlay = false;
  for (const state of anatomy.states ?? []) {
    if (state.kind !== 'pseudo' || !state.pseudo) continue;
    if (state.pseudo === ':focus-visible') {
      needsPlay = true;
      parts.push(`export const FocusVisible: Story = {
  render: () => ${base},
  // Real keyboard focus — paints :focus-visible without a pseudo-states addon.
  play: async () => {
    await userEvent.tab();
  },
};`);
    } else if (PSEUDO_KEY[state.pseudo]) {
      const key = PSEUDO_KEY[state.pseudo];
      parts.push(`export const ${cap(key)}: Story = {
  parameters: { pseudo: { ${key}: true } },
  render: () => ${base},
};`);
    }
  }

  // ── transitions: drive each interactive transition, land in the new state ──
  const role = anatomy.root.role ?? 'button';
  const rootSelector = `[role="${role}"], ${anatomy.root.element}`;
  for (const t of (anatomy.transitions ?? []).filter((x) => x.interactive)) {
    needsPlay = true;
    const guard = t.guard ? ` [guard: ${t.guard}]` : '';
    parts.push(`// transition "${t.id}": ${t.on} -> ${String(t.to)}${guard}
export const ${cap(t.id)}: Story = {
  render: () => ${base},
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('${rootSelector}');
    if (el) await userEvent.click(el as HTMLElement);
  },
};`);
  }

  return { body: parts.join('\n\n'), needsPlay };
}

function generate(name: string): boolean {
  if (!existsSync(join(UI_REACT_UI, name))) {
    console.warn(`skip ${name}: no @acronis-platform/ui-react component`);
    return false;
  }
  const hint = RENDER[name] ?? {};
  if (hint.skip) {
    console.log(`skip ${name}: imperative component (no generated story)`);
    return false;
  }
  const { index, api, anatomy } = loadSpec(name);
  const comp = hint.root ?? index.component;
  const { body, needsPlay } = buildStories(comp, api, anatomy, hint);

  const imports = [
    "import type { Meta, StoryObj } from '@storybook/react-vite';",
    ...(needsPlay ? ["import { userEvent } from 'storybook/test';"] : []),
    ...(hint.extraImports ?? []),
    `import { ${comp} } from '../${name}';`,
  ].join('\n');

  const file = `${HEADER}
${imports}

const meta = {
  title: 'UI/${index.component}/All States (generated)',
  component: ${comp},
} satisfies Meta<typeof ${comp}>;

export default meta;
type Story = StoryObj<typeof meta>;

${body}
`;

  const dir = join(UI_REACT_UI, name, '__stories__');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.generated.stories.tsx`), file);
  console.log(`generated ${name}.generated.stories.tsx`);
  return true;
}

let count = 0;
for (const name of listComponentNames()) if (generate(name)) count += 1;
console.log(`\n${count} story file(s) generated.`);
