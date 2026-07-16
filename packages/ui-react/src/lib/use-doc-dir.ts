import * as React from 'react';

/**
 * Document direction — SSR-safe (defaults to 'ltr', syncs after mount).
 * Checks both the `dir` attribute and the computed `direction` style so a
 * page that sets RTL purely via CSS (no `dir` attribute) is still detected.
 */
export function useDocDir(): 'ltr' | 'rtl' {
  const [dir, setDir] = React.useState<'ltr' | 'rtl'>('ltr');
  React.useEffect(() => {
    const html = document.documentElement;
    const isRtl =
      html.dir === 'rtl' || getComputedStyle(html).direction === 'rtl';
    setDir(isRtl ? 'rtl' : 'ltr');
  }, []);
  return dir;
}
