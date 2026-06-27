// Figma Code Connect — status: NEEDS_FIGMA_URL
// Layout primitive ported from ui-legacy; no dedicated Figma node. Replace
// 'FIGMA_NODE_URL' and flip to COMPLETE via `/figma-component Section <url> --update`.
import figma from '@figma/code-connect';

import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from './section';

figma.connect(Section, 'FIGMA_NODE_URL', {
  example: () => (
    <Section>
      <SectionHeader>
        <SectionTitle>Title</SectionTitle>
        <SectionDescription>Description</SectionDescription>
      </SectionHeader>
      <SectionContent>Content</SectionContent>
    </Section>
  ),
});
