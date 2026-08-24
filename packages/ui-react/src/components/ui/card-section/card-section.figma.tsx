// Figma Code Connect — status: COMPLETE
// Node 7662:8727 ("CardSection"). Figma's PascalCase `variant` options map to
// the kebab-case cva keys; `hasBottomBorder` is a Figma *variant* (string
// "false"/"true"), not a boolean property, so it maps through `figma.enum`.
// The header's `↳title` / `↳extras` / `↳actions` keep Figma's arrow-prefixed
// property names; the per-variant content slots (`content`, `contentTag`,
// `contentList`, `contentTable`) don't carry the prefix in Figma.
//
// `hasHeader` is deliberately NOT mapped. In code it forms a discriminated
// union with `title` (header on ⇒ title required), so it can only ever be the
// literal `true` alongside a `title` — a plain `boolean` from
// `figma.boolean('hasHeader')` doesn't satisfy either union member, and a cast
// makes Code Connect's prop-mapping parser fail outright. The snippet therefore
// always shows the header form, which is the more useful of the two; a designer
// on `hasHeader=false` simply drops `hasHeader`/`title` from the paste.
import figma from '@figma/code-connect';

import { CardSection } from './card-section';

figma.connect(
  CardSection,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7662-8727',
  {
    props: {
      variant: figma.enum('variant', {
        Slot: 'slot',
        Tag: 'tag',
        List: 'list',
        'Table + Actions': 'table-actions',
        'Card (primary)': 'card-primary',
        'Card (secondary)': 'card-secondary',
      }),
      hasBottomBorder: figma.enum('hasBottomBorder', {
        true: true,
        false: false,
      }),
      title: figma.string('↳title'),
      extras: figma.instance('↳extras'),
      actions: figma.instance('↳actions'),
      content: figma.instance('content'),
      contentTag: figma.instance('contentTag'),
      contentList: figma.instance('contentList'),
      contentTable: figma.instance('contentTable'),
    },
    example: ({
      variant,
      hasBottomBorder,
      title,
      extras,
      actions,
      content,
      contentTag,
      contentList,
      contentTable,
    }) => (
      <CardSection
        variant={variant}
        hasBottomBorder={hasBottomBorder}
        hasHeader
        title={title}
        extras={extras}
        actions={actions}
        content={content}
        contentTag={contentTag}
        contentList={contentList}
        contentTable={contentTable}
      />
    ),
  }
);
