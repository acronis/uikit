'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

// Lets a demo portal its Base UI overlays (Select dropdown, Tooltip popup) INTO
// the shadow root instead of document.body, so the popup inherits the shadow's
// ui-react styles. Pass it to a component's `portalContainer` prop.
const ShadowMountContext = createContext<HTMLElement | null>(null);
export function useShadowMount(): HTMLElement | null {
  return useContext(ShadowMountContext);
}

// ui-react ships its styles authored for `:root,:host`, so the same stylesheet
// works inside a shadow root. We fetch it once, build a single Constructable
// Stylesheet, and every preview adopts that one sheet — no duplicated CSS in
// the page, and the shadow boundary keeps ui-react's Tailwind preflight from
// leaking into (or being clobbered by) the docs document.
let sheetPromise: Promise<CSSStyleSheet | null> | null = null;

function getSheet(): Promise<CSSStyleSheet | null> {
  if (!sheetPromise) {
    sheetPromise = fetch('/api/ui-react-css')
      .then((r) => r.text())
      .then((cssText) => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        return sheet;
      })
      .catch(() => null);
  }
  return sheetPromise;
}

// Layout for the demo surface inside the shadow root. Uses ui-react's own
// surface tokens (defined on :host by the adopted sheet) so the canvas matches
// the rendered components in light and dark.
const WRAPPER_CSS = `
.sd-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 2rem;
  min-height: 96px;
  background: var(--ui-background-surface-primary, transparent);
  color: var(--ui-text-on-surface-primary, inherit);
  font-family: var(--font-sans);
}
.sd-wrapper[data-center='true'] { justify-content: center; }
`;

function isDark(): boolean {
  const el = document.documentElement;
  return (
    el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark'
  );
}

interface ShadowDemoProps {
  children: ReactNode;
  center?: boolean;
}

export function ShadowDemo({ children, center }: ShadowDemoProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // A shadow root can only be attached once per element, so on a re-run
    // (React Strict Mode double-invokes effects in dev) reuse the existing one
    // rather than bailing — bailing here would leave `mount` unset after the
    // first run's cleanup cancelled it, so the preview renders empty on
    // client-side navigation.
    let root = host.shadowRoot;
    if (!root) {
      root = host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      style.textContent = WRAPPER_CSS;
      root.appendChild(style);
      const wrapper = document.createElement('div');
      wrapper.className = 'sd-wrapper';
      root.appendChild(wrapper);
    }
    const wrapper = root.querySelector<HTMLElement>('.sd-wrapper');

    let cancelled = false;
    getSheet().then((sheet) => {
      if (cancelled || !sheet || !wrapper) return;
      root.adoptedStyleSheets = [sheet];
      setMount(wrapper);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Mirror the docs theme onto the shadow wrapper so ui-react's `light-dark()`
  // tokens resolve to the matching scheme.
  useEffect(() => {
    const update = () => setDark(isDark());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mount) return;
    mount.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (center) mount.setAttribute('data-center', 'true');
  }, [mount, dark, center]);

  return (
    <div ref={hostRef} className="min-h-[96px]">
      {mount &&
        createPortal(
          <ShadowMountContext.Provider value={mount}>
            {children}
          </ShadowMountContext.Provider>,
          mount
        )}
    </div>
  );
}
