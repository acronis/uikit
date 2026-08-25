// Figma Code Connect — status: COMPLETE
// Node 8262:6179 ("Section"). `isCollapsable` (`false` / `true-expanded` /
// `true-collapsed`) maps to composing `AccordionContainer` around the header
// and content, with `collapsible`/`defaultOpen` derived from the variant —
// the same trick `card.figma.tsx` uses.
//
// `hasHeader` is deliberately NOT mapped: this is a compound component, so a
// designer on `hasHeader=false` simply drops the `SectionHeader` line from the
// paste. The per-variant content slots (`content`, `contentColumn`,
// `contentGrid`) collapse onto `SectionContent`'s `children` /
// `secondaryContent`, since the layout itself comes from the root's `variant`.
import figma from '@figma/code-connect';

import { AccordionContainer } from '../accordion-container';
import { Section, SectionContent, SectionHeader } from './section';

figma.connect(
  Section,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8262-6179',
  {
    props: {
      variant: figma.enum('variant', {
        column1: 'column1',
        'column2-70-30': 'column2-70-30',
        grid3: 'grid3',
        table: 'table',
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
            <SectionContent secondaryContent={contentColumn}>
              {content}
              {contentGrid}
            </SectionContent>
          </AccordionContainer.Content>
        </AccordionContainer>
      </Section>
    ),
  }
);
