import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
  EditOnGitHub,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { AutoTypeTable, type AutoTypeTableProps } from 'fumadocs-typescript/ui';
import { createGenerator } from 'fumadocs-typescript';

// fumadocs-typescript v5 split the TS analyzer out of <AutoTypeTable>: the
// component now requires a `generator` prop rather than constructing one
// itself. Create it once and inject it via the global MDX component map so
// MDX files can keep using <AutoTypeTable path=... name=... /> unchanged.
const generator = createGenerator();

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const editUrl = `https://github.com/acronis/uikit/edit/main/apps/docs/content/${page.path}`;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            AutoTypeTable: (props: Omit<AutoTypeTableProps, 'generator'>) => (
              <AutoTypeTable {...props} generator={generator} />
            ),
          }}
        />
        <EditOnGitHub href={editUrl} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
  };
}
