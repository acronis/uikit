// Figma Code Connect — status: COMPLETE
// Node 8262:6179 ("Section"). Property names below come from
// `get_context_for_code_connect` on that node, so they are exact.
//
// `isCollapsable` (`false` / `true-expanded` / `true-collapsed`) maps to
// composing `AccordionContainer` around the header and content, with
// `collapsible`/`defaultOpen` derived from the variant — the same recipe
// `card.figma.tsx` uses.
//
// `hasHeader` is a boolean in Figma but a compound part here — the consumer
// omits `SectionHeader` instead of toggling a flag — so it is left unmapped and
// the example always renders the header, exactly as `card.figma.tsx` does.
// (Code Connect's template parser also rejects conditional JSX in `example`.)
//
// The design's three content slots (`content`, `contentColumn`, `contentGrid`)
// are per-variant: `content` alone for `column1`/`table`, `content` +
// `contentColumn` for `column2-70-30`, `contentGrid` for `grid3`. They all land
// as children of the single `SectionContent` part, which applies the matching
// grid itself. `SectionHeader`'s `icon` prop is deliberately unmapped: the
// component set exposes no icon slot.
import figma from '@figma/code-connect';

import { AccordionContainer } from '../accordion-container';
import { Section, SectionContent, SectionHeader } from './section';

figma.connect(
  Section,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8262-6179',
  {
    props: {
      variant: figma.enum('variant', {
        column1: 'column1' as const,
        'column2-70-30': 'column2-70-30' as const,
        grid3: 'grid3' as const,
        table: 'table' as const,
      }),
      hasBottomBorder: figma.enum('hasBottomBorder', {
        true: true,
        false: false,
      }),
      title: figma.string('↳title'),
      description: figma.string('↳description'),
      hasDescription: figma.boolean('↳hasDescription'),
      isSwitchable: figma.boolean('↳isSwitchable'),
      extras: figma.instance('↳extras'),
      actions: figma.instance('↳actions'),
      content: figma.instance('content'),
      contentColumn: figma.instance('contentColumn'),
      contentGrid: figma.instance('contentGrid'),
      collapsible: figma.enum('isCollapsable', {
        false: false,
        'true-expanded': true,
        'true-collapsed': true,
      }),
      defaultOpen: figma.enum('isCollapsable', {
        false: false,
        'true-expanded': true,
        'true-collapsed': false,
      }),
    },
    example: ({
      variant,
      hasBottomBorder,
      title,
      description,
      hasDescription,
      isSwitchable,
      extras,
      actions,
      content,
      contentColumn,
      contentGrid,
      collapsible,
      defaultOpen,
    }) => (
      <Section variant={variant} hasBottomBorder={hasBottomBorder}>
        <AccordionContainer collapsible={collapsible} defaultOpen={defaultOpen}>
          <SectionHeader
            title={title}
            description={description}
            hasDescription={hasDescription}
            isSwitchable={isSwitchable}
            extras={extras}
            actions={actions}
            isCollapsible={collapsible}
          />
          <AccordionContainer.Content>
            <SectionContent>
              {content}
              {contentColumn}
              {contentGrid}
            </SectionContent>
          </AccordionContainer.Content>
        </AccordionContainer>
      </Section>
    ),
  }
);
