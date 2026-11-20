# NetworkGraph

Display a network hierarchy and connections from nodes, edges, and roots.
Use the consumer's page surface around the graph; the graph canvas is transparent.

```tsx
import {
  NetworkGraph,
  type NetworkGraphData,
} from '@acronis-platform/ui-react';

const data: NetworkGraphData = {
  roots: ['network'],
  nodes: [
    { id: 'network', title: 'Network', icon: 'cloud', variant: 'network' },
    {
      id: 'switch',
      title: 'Switch',
      subtitle: '192.168.1.2',
      icon: 'ethernet',
      variant: 'device',
      deviceType: 'networking',
    },
  ],
  edges: [{ source: 'network', target: 'switch', type: 'layer1' }],
};

<NetworkGraph
  graphData={data}
  ariaLabel="Network topology"
  onNodeClick={(node) => console.log(node)}
/>;
```

Set `graphDraggable` to enable canvas panning. Zoom is available by buttons and
wheel. Set `selectedNodeIds`, `selectedNodePairs`, or `selectedEdgeIndices` for
controlled highlighting. Consumers implement dialogs and other actions using
the click callbacks. Node `deviceIndicators` and `alerts` add details below the
card; `renderNodeText` customizes its text and `emptyState` supplies empty content.
Set `expandable` on nodes with children to show branch toggles. Use
`collapsedNodeIds` and `onCollapsedNodeIdsChange` for controlled expansion, or
`defaultCollapsedNodeIds` for an initial uncontrolled state. Use
`deviceIndicatorsLabel` to provide an accessible summary of the markers.
For the Figma collapsed-group treatment, set a parent's `collapsedGroupId` to
the ID of its immediate group child and include both that group and the real
children as nodes and edges. The group appears only while the parent is collapsed.

```tsx
const data: NetworkGraphData = {
  roots: ['switch'],
  nodes: [
    {
      id: 'switch',
      title: 'Switch',
      expandable: true,
      collapsedGroupId: 'group',
    },
    {
      id: 'group',
      title: 'Connected',
      subtitle: '2 devices',
      variant: 'group',
    },
    { id: 'one', title: 'Device one' },
    { id: 'two', title: 'Device two' },
  ],
  edges: [
    { source: 'switch', target: 'group' },
    { source: 'switch', target: 'one' },
    { source: 'switch', target: 'two' },
  ],
};

<NetworkGraph graphData={data} defaultCollapsedNodeIds={['switch']} />;
```

Use `viewportRef` to fit or change zoom and `onZoomChange` to display the scale
in a consumer-owned toolbar. The ordinary ref remains the graph DOM element.
The `horizontalGap` prop controls the spacing between sibling subtrees.
