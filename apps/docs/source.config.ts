import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

interface ComponentPageData {
  title: string;
  description?: string;
  icon?: string;
  full?: boolean;
  internal?: boolean;
  deprecated?: { replacement: string; reason?: string };
}

function issue(message: string) {
  return { issues: [{ message }] };
}

// Hand-rolled Standard Schema (https://standardschema.dev) implementing the
// same shape as Fumadocs' default `pageSchema`, plus `internal`/`deprecated`
// component-status frontmatter. Fumadocs' default schema is a Zod object in
// "strip" mode, so unknown keys like these are silently dropped before
// `page.data` — that's the only reason a schema override is needed here; a
// full validation library isn't, so this avoids adding one just for two
// extra optional fields.
const componentPageSchema = {
  '~standard': {
    version: 1 as const,
    vendor: 'uikit-docs',
    validate(input: unknown) {
      if (typeof input !== 'object' || input === null) {
        return issue('frontmatter must be an object');
      }
      const data = input as Record<string, unknown>;

      if (typeof data.title !== 'string') {
        return issue('"title" is required and must be a string');
      }
      if (data.description !== undefined && typeof data.description !== 'string') {
        return issue('"description" must be a string');
      }
      if (data.icon !== undefined && typeof data.icon !== 'string') {
        return issue('"icon" must be a string');
      }
      if (data.full !== undefined && typeof data.full !== 'boolean') {
        return issue('"full" must be a boolean');
      }
      if (data.internal !== undefined && typeof data.internal !== 'boolean') {
        return issue('"internal" must be a boolean');
      }
      if (data.deprecated !== undefined) {
        const deprecated = data.deprecated;
        if (
          typeof deprecated !== 'object' ||
          deprecated === null ||
          typeof (deprecated as Record<string, unknown>).replacement !== 'string'
        ) {
          return issue('"deprecated.replacement" is required and must be a string');
        }
      }

      return { value: data as unknown as ComponentPageData };
    },
  },
};

export const docs = defineDocs({
  dir: 'content/docs',
  docs: { schema: componentPageSchema },
});

export default defineConfig({
  mdxOptions: {},
});
