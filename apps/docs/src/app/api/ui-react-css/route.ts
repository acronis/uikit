import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Serve @acronis-platform/ui-react's compiled stylesheet so the live component
// previews can inject it into an isolated shadow root (see ShadowDemo). Reading
// it here — rather than importing it globally — keeps ui-react's Tailwind
// preflight + tokens out of the docs document, where they would collide with
// the legacy shadcn-uikit styles and Fumadocs' own CSS.
//
// `process.cwd()` is `apps/docs/` at build time (same assumption DemoPreview
// relies on); the workspace dep resolves through the local node_modules symlink.
let css: string | null = null;

function loadCss(): string {
  if (css === null) {
    css = readFileSync(
      join(
        process.cwd(),
        'node_modules/@acronis-platform/ui-react/dist/ui-react.css'
      ),
      'utf-8'
    );
  }
  return css;
}

export const dynamic = 'force-static';

export function GET() {
  return new Response(loadCss(), {
    headers: {
      'content-type': 'text/css; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    }
  });
}
