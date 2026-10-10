import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — never exported from `src/index.ts`
// and outside the `__stories__` glob the lib build's JS entries scan, so no
// JS from this file ships. Mirrors `sizing-demo.stories.tsx`/
// `layout-demo.stories.tsx`: shows the effect of the framework-agnostic
// `.ui-text-*`/`.ui-bg-*`/`.ui-border-*` semantic color utility classes and
// doubles as a visual regression net. This is a curated subset, not the full
// 129-class set — the exhaustive listing lives in the docs'
// `<TokenReference />` component; this demo exists to prove the class
// mechanism works, not to enumerate every role.

const TEXT_ROLES = [
  'on-surface-primary',
  'on-surface-secondary',
  'on-surface-link-idle',
  'on-surface-destructive',
  'on-status-success',
  'on-status-warning',
  'on-status-danger',
] as const;

const BG_ROLES = [
  'surface-primary',
  'surface-secondary',
  'brand-primary',
  'status-success',
  'status-warning',
  'status-danger',
  'status-info',
] as const;

const BORDER_ROLES = [
  'on-surface-border',
  'on-surface-border-active',
  'on-surface-divider',
  'on-brand-border',
  'on-status-danger',
] as const;

function TextSwatch({ role }: { role: string }) {
  return (
    <div className="color-row flex items-center gap-3 py-1">
      <span className="color-label w-56 shrink-0 truncate font-mono text-xs">
        .ui-text-{role}
      </span>
      <span className={`ui-text-${role}`}>The quick brown fox</span>
    </div>
  );
}

function BgSwatch({ role }: { role: string }) {
  return (
    <div className="color-row flex items-center gap-3 py-1">
      <span className="color-label w-56 shrink-0 truncate font-mono text-xs">
        .ui-bg-{role}
      </span>
      <div className={`ui-bg-${role} color-swatch h-8 w-24 rounded`} />
    </div>
  );
}

function BorderSwatch({ role }: { role: string }) {
  return (
    <div className="color-row flex items-center gap-3 py-1">
      <span className="color-label w-56 shrink-0 truncate font-mono text-xs">
        .ui-border-{role}
      </span>
      <div className={`ui-border-${role} h-8 w-24 rounded border-2 border-solid`} />
    </div>
  );
}

function StateVariantsDemo() {
  return (
    <div className="mt-8">
      <p className="color-section-title mb-3 font-mono text-xs font-semibold">
        ui-hover: / ui-disabled: / ui-last:
      </p>

      <div className="color-row mb-2 flex items-center gap-3">
        <span className="color-label w-56 shrink-0 font-mono text-xs">
          ui-hover:bg-brand-primary (hover me)
        </span>
        <div
          data-testid="state-variant-hover-chip"
          className="ui-bg-surface-secondary ui-hover:bg-brand-primary color-swatch h-8 w-24 rounded"
        />
      </div>

      <div className="color-row mb-2 flex items-center gap-3">
        <span className="color-label w-56 shrink-0 font-mono text-xs">
          ui-disabled:text-on-surface-secondary
        </span>
        <button
          disabled
          className="ui-text-on-surface-primary ui-disabled:text-on-surface-secondary"
        >
          Disabled button
        </button>
      </div>

      <div className="color-row flex items-center gap-3">
        <span className="color-label w-56 shrink-0 font-mono text-xs">
          ui-last:bg-status-danger (last item only)
        </span>
        <div className="flex gap-1">
          <div className="ui-bg-surface-secondary color-swatch h-8 w-12 rounded" />
          <div className="ui-bg-surface-secondary color-swatch h-8 w-12 rounded" />
          <div className="ui-bg-surface-secondary ui-last:bg-status-danger color-swatch h-8 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}

function SemanticColorDemo() {
  return (
    <div className="p-8">
      <style>{`
        .color-label { color: var(--ui-text-on-surface-secondary); }
        .color-section-title { color: var(--ui-text-on-surface-primary); }
        .color-swatch { border: 1px dashed var(--ui-border-on-surface-border); }
      `}</style>

      <p className="color-section-title mb-3 font-mono text-xs font-semibold">
        .ui-text-*
      </p>
      {TEXT_ROLES.map((role) => (
        <TextSwatch key={role} role={role} />
      ))}

      <p className="color-section-title mt-8 mb-3 font-mono text-xs font-semibold">
        .ui-bg-*
      </p>
      {BG_ROLES.map((role) => (
        <BgSwatch key={role} role={role} />
      ))}

      <p className="color-section-title mt-8 mb-3 font-mono text-xs font-semibold">
        .ui-border-*
      </p>
      {BORDER_ROLES.map((role) => (
        <BorderSwatch key={role} role={role} />
      ))}

      <StateVariantsDemo />
    </div>
  );
}

const meta: Meta<typeof SemanticColorDemo> = {
  title: 'Foundations/Semantic Color',
  component: SemanticColorDemo,
  parameters: {
    layout: 'fullscreen',
    // Three sections × several rows exceed the default viewport — capture
    // the full page so nothing below the fold is missing from the visual
    // regression baseline. Real mouse hover (only a Playwright-level
    // capability, not a synthetic pointer event) proves the ui-hover:*
    // variant actually applies on hover, not just that the class exists.
    snapshot: {
      fullPage: true,
      hoverSelector: '[data-testid="state-variant-hover-chip"]',
    },
    docs: {
      description: {
        component:
          'Live demo (curated subset) of the `.ui-text-*`/`.ui-bg-*`/' +
          '`.ui-border-*` semantic color utility classes — one class per ' +
          'existing `--ui-text-*`/`--ui-background-*`/`--ui-border-*` ' +
          'custom property (129 total), full path with no truncation — ' +
          'plus their `ui-hover:`/`ui-disabled:`/`ui-last:` state-variant ' +
          'forms, for framework-agnostic (non-Tailwind) consumers. See the ' +
          'Token reference page for the exhaustive color list.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof SemanticColorDemo>;

export const SemanticColorDemoStory: Story = {
  name: 'SemanticColorDemo',
  render: () => <SemanticColorDemo />,
};
