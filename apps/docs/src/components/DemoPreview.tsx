import { type ReactNode } from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { highlight } from 'fumadocs-core/highlight';
import { CodeBlock } from 'fumadocs-ui/components/codeblock';

interface DemoPreviewProps {
  children: ReactNode;
  /** Path to source file, relative to monorepo root */
  sourcePath?: string;
  /** Center content horizontally in the preview area */
  center?: boolean;
}

export async function DemoPreview({ children, sourcePath, center }: DemoPreviewProps) {
  let highlighted: ReactNode | undefined;

  if (sourcePath) {
    try {
      const source = readFileSync(
        resolve(process.cwd(), '..', '..', sourcePath),
        'utf-8',
      );
      highlighted = await highlight(source, {
        lang: 'tsx',
        themes: { light: 'github-light', dark: 'github-dark' },
      });
    } catch {
      // Source file not found or highlight failed — render without source toggle
    }
  }

  return (
    <div className="demo-preview my-6 rounded-xl border overflow-hidden shadow-sm">
      <div
        className={`demo-preview__canvas p-8 min-h-[120px] flex flex-wrap items-start gap-4 [&>*]:min-w-0${center ? ' justify-center' : ''}`}
      >
        {children}
      </div>
      <div className="demo-preview__footer border-t px-4 py-2 flex items-center">
        <span className="text-xs opacity-50">Preview</span>
      </div>
      {highlighted && (
        <details className="group">
          <summary className="demo-preview__footer border-t px-4 py-2 text-xs opacity-60 hover:opacity-100 cursor-pointer list-none select-none">
            <span className="group-open:hidden">View source</span>
            <span className="hidden group-open:inline">Hide source</span>
          </summary>
          <div className="border-t">
            <CodeBlock className="rounded-none border-0 shadow-none my-0">
              {highlighted}
            </CodeBlock>
          </div>
        </details>
      )}
    </div>
  );
}
