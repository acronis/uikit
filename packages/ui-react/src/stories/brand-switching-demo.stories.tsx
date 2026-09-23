import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

// Design/QA aid, not a library component — mirrors spacing-demo.stories.tsx /
// breakpoints-demo.stories.tsx: never exported from `src/index.ts`, so no JS
// from this file ships. It exists to answer "how do I re-theme at runtime?"
// for a consumer that only learns its brand after the page has loaded (e.g. a
// multi-tenant shell resolving the tenant per request) — see
// apps/docs/content/docs/theming.mdx#runtime-brand-switching for the written
// version of the same pattern.
//
// The mechanism below is deliberately the *runtime* one: swap a `<style>`
// element's content to a brand's full `tokens-pd` bundle
// (`bundles/<brand>.css` — semantics + every component tier merged). It is
// NOT the build-time pattern (picking imports in `src/styles/index.css`,
// still the recommended path when the brand is known at build time) — see
// `.storybook/globals.ts`'s `applyBrand`, which uses this same technique to
// drive the Storybook toolbar's "Brand" control for every other story.
import bundleDeepSky from '@acronis-platform/tokens-pd/bundles/deep_sky_itkontoret.css?raw';
import bundleLightGray from '@acronis-platform/tokens-pd/bundles/light_gray.css?raw';
import bundleTelstra from '@acronis-platform/tokens-pd/bundles/telstra.css?raw';
import bundleVirtuozzo from '@acronis-platform/tokens-pd/bundles/virtuozzo.css?raw';
import bundleYellow1c from '@acronis-platform/tokens-pd/bundles/yellow_1c.css?raw';
import {
  Alert,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { InputText } from '../components/ui/input-text';
import { Switch } from '../components/ui/switch';
import { Tag } from '../components/ui/tag';

const BRANDS = [
  { value: 'default', label: 'Default', bundle: null },
  {
    value: 'deep_sky_itkontoret',
    label: 'Deep Sky (ITkontoret)',
    bundle: bundleDeepSky,
  },
  { value: 'light_gray', label: 'Light Gray', bundle: bundleLightGray },
  { value: 'telstra', label: 'Telstra', bundle: bundleTelstra },
  { value: 'virtuozzo', label: 'Virtuozzo', bundle: bundleVirtuozzo },
  { value: 'yellow_1c', label: 'Yellow (1C)', bundle: bundleYellow1c },
] as const;

type BrandValue = (typeof BRANDS)[number]['value'];

const RUNTIME_SWAP_SNIPPET = `// Runtime brand switching via a managed <style> element.
// Import each bundle at build time with Vite's ?raw suffix; swap the
// element's content at runtime to re-theme. One file covers semantics AND
// every component — unlike swapping only css/<brand>.css, which leaves
// components on the default brand's colors.

// Static ?raw imports (Vite resolves these at build time):
import bundleTelstra from '@acronis-platform/tokens-pd/bundles/telstra.css?raw';
// … one import per brand you support

// Create one managed <style> element:
const el = document.createElement('style');
document.head.appendChild(el);

// To switch brands, replace the element's content:
el.textContent = bundleTelstra; // or the bundle constant for the active brand`;

/**
 * Swaps a managed `<style>` element's content to the selected brand's full
 * bundle. Isolated from `.storybook/globals.ts`'s own `#sb-brand-override`
 * element (used by the toolbar's "Brand" control) via a distinct id. Appended
 * after mount so it wins source order when both elements are present — except
 * when this story's brand is "Default" (textContent set to ''), in which case
 * the element overrides nothing and the toolbar's brand shows through; and
 * globals.ts removes #sb-brand-override on 'default' and re-appends it on the
 * next non-default selection, which would land it after this element and invert
 * source order. Use this story for demonstrating per-brand bundle content, not
 * as a reliable source-order isolation fixture.
 */
function useStoryBrandOverride(brand: BrandValue): void {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const el = document.createElement('style');
    document.head.appendChild(el);
    styleRef.current = el;
    return () => {
      el.remove();
      styleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const entry = BRANDS.find((b) => b.value === brand);
    if (styleRef.current) styleRef.current.textContent = entry?.bundle ?? '';
  }, [brand]);
}

function BrandSwitchingDemo() {
  const [brand, setBrand] = useState<BrandValue>('default');
  useStoryBrandOverride(brand);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-wrap items-center gap-2">
        {BRANDS.map(({ value, label }) => (
          <Button
            key={value}
            variant={brand === value ? 'default' : 'secondary'}
            onClick={() => setBrand(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 rounded-lg border border-[var(--ui-border-on-surface-border)] p-6">
        <div className="flex flex-col gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
        </div>

        <div className="flex flex-col gap-3">
          <Tag variant="info">Info</Tag>
          <Tag variant="success">Success</Tag>
          <Tag variant="warning">Warning</Tag>
        </div>

        <div className="flex w-64 flex-col gap-3">
          <InputText label="Email" placeholder="you@example.com" />
          <Switch label="Enabled" defaultChecked />
        </div>

        <Alert variant="info" className="w-72">
          <AlertContent>
            <AlertTitle>This brand is live</AlertTitle>
            <AlertDescription>
              Every token — semantic and component — updated from one file.
            </AlertDescription>
          </AlertContent>
        </Alert>
      </div>

      <pre className="overflow-x-auto rounded-lg bg-[var(--ui-background-surface-secondary)] p-4 text-xs">
        <code>{RUNTIME_SWAP_SNIPPET}</code>
      </pre>
    </div>
  );
}

const meta: Meta<typeof BrandSwitchingDemo> = {
  title: 'Themes/Brand Switching',
  component: BrandSwitchingDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Live demo of **runtime** brand switching via `@acronis-platform/tokens-pd`'s " +
          'per-brand bundle (`bundles/<brand>.css`): clicking a brand swaps a single ' +
          '`<style>` element and re-themes every control on this page — semantic tokens ' +
          'and every component tier at once. This is the pattern for a consumer that ' +
          'only learns its brand at runtime (e.g. a multi-tenant shell); a consumer that ' +
          'knows its brand at build time should still prefer the opt-in per-component ' +
          'imports `src/styles/index.css` uses (see the "Theme switching" section of ' +
          '`apps/docs/content/docs/theming.mdx`). Swapping only the semantic-tier file ' +
          '(`css/<brand>.css`) — the trap this story is built to make visible — would ' +
          "leave every component below on the default brand's colors.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BrandSwitchingDemo>;

export const BrandSwitching: Story = {
  render: () => <BrandSwitchingDemo />,
};
