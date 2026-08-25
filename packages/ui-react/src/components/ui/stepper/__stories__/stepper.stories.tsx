import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckIcon } from '@acronis-platform/icons-react/stroke-mono';

import { Avatar, AvatarFallback } from '../../avatar';
import { StepperItem } from '../../stepper-item';
import { Stepper } from '../stepper';

// `[box-shadow:none]` switches off Avatar's 2px outset ring (meant to
// separate overlapping avatars in an `AvatarGroup`), the same way
// `Timeline`'s marker does — Figma's Stepper avatars carry no stroke, and the
// ring otherwise shows as an unwanted halo on the `current`/`completed`
// step's filled container. See the "Known quirk" note in `stepper-item`'s
// spec `README.md`.
const checkAvatar = (
  <Avatar color="green" className="[box-shadow:none]">
    <CheckIcon size={16} />
  </Avatar>
);

// Figma recolors the digit inside a `current`/`future` avatar to that step's
// own label-color token (overriding Avatar's own per-scheme color) — see the
// comment in stepper-item.tsx.
const numberAvatar = (
  n: number,
  color: 'blue' | 'gray' = 'blue',
  digitVariant: 'current' | 'future' = 'current'
) => (
  <Avatar
    color={color}
    className={`[box-shadow:none] text-[var(--ui-stepper-item-${digitVariant}-label-color)]`}
  >
    <AvatarFallback>{n}</AvatarFallback>
  </Avatar>
);

/** The six-step row the Figma `size=md` frame draws. */
const steps = (
  <>
    <StepperItem
      variant="completed"
      label="Create an account"
      avatar={checkAvatar}
    />
    <StepperItem
      variant="current"
      label="Choose a plan"
      avatar={numberAvatar(2)}
    />
    <StepperItem
      variant="future"
      label="Add your team"
      avatar={numberAvatar(3, 'gray', 'future')}
    />
    <StepperItem
      variant="future"
      label="Connect a workload"
      avatar={numberAvatar(4, 'gray', 'future')}
    />
    <StepperItem
      variant="future"
      label="Set a protection plan"
      avatar={numberAvatar(5, 'gray', 'future')}
    />
    <StepperItem
      variant="future"
      label="Confirm and pay"
      avatar={numberAvatar(6, 'gray', 'future')}
    />
  </>
);

const meta = {
  title: 'UI/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: 'text',
      description:
        '1-based index of the step the user is on. Rendered in the compact (< 1024px) summary only.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    totalSteps: {
      control: 'text',
      description:
        'How many steps there are in total. Rendered in the compact summary only.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    current: {
      control: 'text',
      description:
        "The current step's name. Rendered in the compact summary only — above the breakpoint the highlighted `StepperItem` carries it.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    next: {
      control: 'text',
      description:
        "The next step's name. Omit it (e.g. on the last step) and the whole “Next: …” line is left out rather than rendered empty.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    stepLabel: {
      control: 'text',
      description:
        'The word introducing the step counter. A prop rather than an inlined literal so it can be translated.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Step' },
        category: 'Behavior',
      },
    },
    ofLabel: {
      control: 'text',
      description:
        'The word joining the current step number to the total. Translatable.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'of' },
        category: 'Behavior',
      },
    },
    nextLabel: {
      control: 'text',
      description: "The label introducing the next step's name. Translatable.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Next:' },
        category: 'Behavior',
      },
    },
    children: {
      control: false,
      description:
        'The `StepperItem` elements. Rendered in the wide (>= 1024px) layout only.',
      table: { type: { summary: 'ReactNode' }, category: 'Composition' },
    },
  },
  args: {
    currentStep: 2,
    totalSteps: 6,
    current: 'Choose a plan',
    next: 'Add your team',
    children: steps,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The wide layout: every step in a start-aligned, wrapping row. The compact summary
 * is in the DOM too, but `display: none` above the `lg` breakpoint.
 */
export const Default: Story = {};

/** The last step — no next step, so the “Next: …” line is not rendered at all. */
export const LastStep: Story = {
  args: {
    currentStep: 6,
    totalSteps: 6,
    current: 'Confirm and pay',
    next: undefined,
    children: (
      <>
        <StepperItem
          variant="completed"
          label="Set a protection plan"
          avatar={checkAvatar}
        />
        <StepperItem
          variant="current"
          label="Confirm and pay"
          avatar={numberAvatar(6)}
        />
      </>
    ),
  },
};

/**
 * The compact layout. Which layout paints is decided by a real viewport media
 * query (Tailwind's `lg:` = `min-width: 1024px`), so it can only be exercised by
 * actually narrowing the viewport — pick `compact` or `md` from the **viewport**
 * toolbar above to see the two-line text summary replace the item row.
 */
export const Compact: Story = {
  // Storybook 10 seeds the viewport from the `viewport` global, not from a
  // `parameters.viewport.defaultViewport` key — so this story opens narrow
  // instead of needing the toolbar before it shows anything at all.
  globals: { viewport: { value: 'compact', isRotated: false } },
  parameters: {
    viewport: {
      options: {
        compact: {
          name: 'compact — 375px (below lg)',
          styles: { width: '375px', height: '240px' },
          type: 'mobile',
        },
        md: {
          name: 'md — 768px (below lg)',
          styles: { width: '768px', height: '240px' },
          type: 'tablet',
        },
        lg: {
          name: 'lg — 1024px (first desktop pixel)',
          styles: { width: '1024px', height: '240px' },
          type: 'desktop',
        },
      },
    },
    // Manual, toolbar-driven viewport picker — same reasoning as
    // `page-header-responsive.stories.tsx` and `src/stories/breakpoints-demo.stories.tsx`:
    // a VR capture happens at the runner's fixed (desktop) viewport, so it would
    // silently snapshot the wide layout and prove nothing about the breakpoint.
    // `Default` already covers this component's VR.
    snapshot: { skip: true },
    docs: {
      description: {
        component:
          'Live demo of the compact (< 1024px) layout. Pick `compact — 375px` or ' +
          '`md — 768px` from the viewport toolbar above to see the item row give way ' +
          'to the “Step 2 of 6: …” / “Next: …” summary; `lg — 1024px` switches back. ' +
          'Note the 1px difference from the Figma variant names (`0-1024` / `>1025`): ' +
          "Tailwind's `lg:` fires at exactly 1024px, so 1024 itself is desktop here.",
      },
    },
  },
};
