// Figma Code Connect — status: NEEDS_FIGMA_URL
// Ported from ui-legacy without a "ready for dev" Figma node. Tabs is a
// compositional component (the only enum-ish prop, orientation, lives on Base
// UI's Root), so there are no property mappings to verify here — only the node
// URL is missing. Replace 'FIGMA_NODE_URL' with the component-set link and flip
// the status to COMPLETE via `/figma-component Tabs <url> --update`, then
// validate with `figma:connect`.
import figma from '@figma/code-connect';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

figma.connect(Tabs, 'FIGMA_NODE_URL', {
  example: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="password">Password settings</TabsContent>
    </Tabs>
  ),
});
