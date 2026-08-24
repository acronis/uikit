import { readdirSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { join } from 'node:path';

/**
 * Storybook stories in this package double as visual-regression cases, so a story
 * that fetches an asset over the network makes its baseline depend on a third
 * party being reachable from inside the Docker capture.
 *
 * That is not a hypothetical: `ui-avatar--default` pulled `github.com/shadcn.png`
 * and rendered either the photo or the `AvatarFallback` initials depending on
 * whether the fetch landed — a ~7.8% diff that passed and failed on identical code
 * within the same hour of CI. The aspect-ratio stories had the same shape with a
 * third-party photo host.
 *
 * Use a `data:` URI (see the `SAMPLE_IMAGE` constants in those stories) or an asset
 * imported from the repo. Both are deterministic and need no network.
 */
const STORY_SUFFIX = '.stories.tsx';

/**
 * Only attributes that make the browser FETCH something. `href` is deliberately
 * excluded: a link target is not loaded while the story renders, and several
 * stories legitimately link to acronis.com. `url(...)` covers a background image
 * smuggled through a style prop.
 */
const REMOTE_ASSET =
  /\b(?:src|srcSet|poster)\s*=\s*["'`]https?:\/\/|url\(\s*["']?https?:\/\//i;

function storyFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return storyFiles(path);
    return path.endsWith(STORY_SUFFIX) ? [path] : [];
  });
}

describe('story assets are local', () => {
  it('never loads an asset over the network', () => {
    const offenders = storyFiles(join(process.cwd(), 'src'))
      .map((file) => ({ file, source: readFileSync(file, 'utf8') }))
      .filter(({ source }) => REMOTE_ASSET.test(source))
      .map(({ file }) => file.replace(`${process.cwd()}/`, ''));

    expect(
      offenders,
      `These stories fetch an asset over the network, so their visual-regression ` +
        `baselines depend on a third party being reachable from the Docker ` +
        `capture. Inline the asset as a data: URI instead.\n` +
        offenders.map((f) => `  - ${f}`).join('\n')
    ).toEqual([]);
  });

  it('recognises a fetched remote asset, and ignores a link target', () => {
    // Guards the guard: a check that only ever asserts "no offenders today" would
    // keep passing if the pattern silently stopped matching anything.
    expect(REMOTE_ASSET.test('<img src="https://github.com/shadcn.png" />')).toBe(
      true
    );
    expect(REMOTE_ASSET.test("<img src='http://example.com/a.png' />")).toBe(
      true
    );
    expect(
      REMOTE_ASSET.test('style={{ backgroundImage: "url(https://x/y.png)" }}')
    ).toBe(true);

    // Not fetches: a link target, and a local or inlined asset.
    expect(REMOTE_ASSET.test('<a href="https://www.acronis.com" />')).toBe(false);
    expect(REMOTE_ASSET.test('<img src={SAMPLE_IMAGE} />')).toBe(false);
    expect(REMOTE_ASSET.test('<img src="data:image/svg+xml;utf8,<svg/>" />')).toBe(
      false
    );
    expect(REMOTE_ASSET.test('<img src="/local/asset.png" />')).toBe(false);
  });
});
