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
      // Revalidate on every load. This serves ui-react's *compiled* stylesheet,
      // which changes whenever the library does. A long max-age made the
      // shadow-root demos (ShadowDemo) keep adopting a stale sheet — a newly
      // added utility (e.g. Dialog's `bg-muted`) would be missing, so the demo
      // rendered unstyled until the cache expired (in dev, and for up to an hour
      // for returning users after a deploy). `no-cache` keeps it cached but
      // forces revalidation (304 via ETag when unchanged) so a rebuilt library
      // shows immediately.
      'cache-control': 'no-cache',
    },
  });
}
