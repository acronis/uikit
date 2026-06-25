import { type ReactNode } from 'react';
import { ShadowDemo } from './ShadowDemo';

interface DemoReactProps {
  children: ReactNode;
  /** Center the preview content horizontally. */
  center?: boolean;
}

// Live preview wrapper for @acronis-platform/ui-react components. Renders the
// demo inside an isolated shadow root (ShadowDemo) so ui-react's stylesheet
// can't collide with the legacy shadcn-uikit styles or Fumadocs CSS that are
// loaded globally on the docs document. The matching code is shown in the
// page's `## Examples` blocks, so this intentionally has no source toggle.
export function DemoReact({ children, center }: DemoReactProps) {
  return (
    <div className="demo-preview my-6 overflow-hidden rounded-xl border shadow-sm">
      <ShadowDemo center={center}>{children}</ShadowDemo>
      <div className="demo-preview__footer flex items-center border-t px-4 py-2">
        <span className="text-xs opacity-50">Live preview · @acronis-platform/ui-react</span>
      </div>
    </div>
  );
}
