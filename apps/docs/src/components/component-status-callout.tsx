import { Callout } from 'fumadocs-ui/components/callout';

interface ComponentStatusCalloutProps {
  internal?: boolean;
  deprecated?: { replacement: string; reason?: string };
}

// Rendered structurally from frontmatter in src/app/[...slug]/page.tsx, so
// every internal/deprecated component page carries this banner without each
// MDX file having to author it by hand.
export function ComponentStatusCallout({
  internal,
  deprecated,
}: ComponentStatusCalloutProps) {
  if (!internal && !deprecated) return null;

  return (
    <>
      {internal && (
        <Callout type="info" title="Internal only">
          Not exported from `@acronis-platform/ui-react`&apos;s public entry
          point. It is an implementation detail of other components — don&apos;t
          import it directly.
        </Callout>
      )}
      {deprecated && (
        <Callout type="warn" title="Deprecated">
          {deprecated.reason ? `${deprecated.reason} ` : ''}Use{' '}
          <a href={`/components/${deprecated.replacement}`}>
            {deprecated.replacement}
          </a>{' '}
          instead.
        </Callout>
      )}
    </>
  );
}
