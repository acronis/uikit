import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  NetworkGraph,
  type NetworkGraphData,
  type NetworkGraphViewportHandle,
} from '../network-graph';

const basicData: NetworkGraphData = {
  roots: ['network'],
  nodes: [
    {
      id: 'network',
      title: 'Network',
      subtitle: '10.0.0.0/8',
      icon: 'cloud',
      variant: 'network',
    },
    {
      id: 'gateway',
      title: 'Unifi_Gateway001',
      subtitle: '192.168.0.1',
      icon: 'router',
      variant: 'gateway',
      deviceType: 'networking',
    },
    {
      id: 'subnet-primary',
      title: 'SUBNET',
      subtitle: '10.0.1.0/8',
      icon: 'node-network',
      variant: 'subnet',
    },
    {
      id: 'subnet-secondary',
      title: 'SUBNET',
      subtitle: '10.0.2.0/8',
      icon: 'node-network',
      variant: 'subnet',
    },
    {
      id: 'subnet-wireless',
      title: 'SUBNET',
      subtitle: '10.0.3.0/8',
      icon: 'node-network',
      variant: 'subnet',
    },
    {
      id: 'subnet-clients',
      title: 'SUBNET',
      subtitle: '10.0.4.0/8',
      icon: 'node-network',
      variant: 'subnet',
    },
    {
      id: 'switch-primary',
      title: 'UbiSwitch_Primary',
      subtitle: '192.168.1.2',
      icon: 'ethernet',
      variant: 'device',
      deviceType: 'networking',
    },
    {
      id: 'switch-secondary',
      title: 'SW-TP01',
      subtitle: '192.168.3.1',
      icon: 'ethernet',
      variant: 'device',
      deviceType: 'networking',
    },
    {
      id: 'workstation',
      title: 'DESKTOP-AX018',
      subtitle: '192.168.60.3',
      icon: 'laptop',
      variant: 'device',
      deviceType: 'endpoint',
    },
    {
      id: 'access-point',
      title: 'LX-00',
      subtitle: '192.168.70.30',
      icon: 'pc-tower',
      variant: 'device',
      deviceType: 'endpoint',
    },
    {
      id: 'primary-connected',
      title: 'Connected',
      subtitle: '13 devices',
      variant: 'group',
    },
    {
      id: 'secondary-connected',
      title: 'Connected',
      subtitle: '4 devices',
      variant: 'group',
    },
  ],
  edges: [
    { source: 'network', target: 'gateway', type: 'layer1' },
    { source: 'gateway', target: 'subnet-primary', type: 'layer1' },
    { source: 'gateway', target: 'subnet-secondary', type: 'layer1' },
    { source: 'gateway', target: 'subnet-wireless', type: 'layer1' },
    { source: 'gateway', target: 'subnet-clients', type: 'layer1' },
    {
      source: 'subnet-primary',
      target: 'switch-primary',
      type: 'layer1',
    },
    {
      source: 'subnet-secondary',
      target: 'switch-secondary',
      type: 'layer1',
    },
    {
      source: 'subnet-wireless',
      target: 'workstation',
      type: 'layer1',
    },
    {
      source: 'subnet-clients',
      target: 'access-point',
      type: 'wifi',
    },
    {
      source: 'switch-primary',
      target: 'primary-connected',
      type: 'layer1',
    },
    {
      source: 'switch-secondary',
      target: 'secondary-connected',
      type: 'layer1',
    },
    {
      source: 'switch-primary',
      target: 'workstation',
      type: 'layer3-inferred',
      style: 'dotted',
      color: 'var(--ui-border-on-surface-border-active)',
    },
    {
      source: 'secondary-connected',
      target: 'access-point',
      type: 'vpn',
      style: 'dotted',
    },
  ],
};

const denseData: NetworkGraphData = (() => {
  const nodes: NetworkGraphData['nodes'] = [
    {
      id: 'dense-root',
      title: 'Core network',
      icon: 'cloud',
      variant: 'network',
    },
  ];
  const edges: NetworkGraphData['edges'] = [];

  for (let groupIndex = 0; groupIndex < 10; groupIndex += 1) {
    const groupId = `group-${groupIndex + 1}`;
    nodes.push({
      id: groupId,
      title: `Building ${groupIndex + 1}`,
      subtitle: `10.${groupIndex + 1}.0.0/16`,
      icon: 'node-network',
      variant: 'subnet',
    });
    edges.push({
      source: 'dense-root',
      target: groupId,
      type: 'layer1',
    });

    const groupCount = groupIndex === 9 ? 24 : 25;
    let previousId = groupId;
    for (let deviceIndex = 1; deviceIndex < groupCount; deviceIndex += 1) {
      const deviceId = `device-${groupIndex + 1}-${deviceIndex + 1}`;
      nodes.push({
        id: deviceId,
        title: `Device ${groupIndex + 1}.${deviceIndex + 1}`,
        subtitle: 'Connected',
        icon: deviceIndex % 4 === 0 ? 'server' : 'laptop',
        variant: 'device',
      });
      edges.push({
        source: previousId,
        target: deviceId,
        type: deviceIndex % 3 === 0 ? 'wifi' : 'layer1',
        style: deviceIndex % 3 === 0 ? 'dotted' : 'solid',
      });
      previousId = deviceId;
    }
  }

  for (let groupIndex = 0; groupIndex < 9; groupIndex += 1) {
    edges.push({
      source: `device-${groupIndex + 1}-6`,
      target: `device-${groupIndex + 2}-6`,
      type: 'layer3-inferred',
      style: 'dotted',
    });
  }

  return { roots: ['dense-root'], nodes, edges };
})();

const auvikTopologyData: NetworkGraphData = {
  roots: ['auvik-network'],
  nodes: [
    {
      id: 'auvik-network',
      title: 'Network',
      subtitle: '10.0.0.0/8',
      icon: 'cloud',
      variant: 'network',
    },
    {
      id: 'auvik-gateway',
      title: 'Unifi_Gateway001',
      subtitle: '192.168.0.1',
      icon: 'router',
      variant: 'gateway',
      deviceType: 'networking',
      expandable: true,
    },
    ...[
      ['primary', '10.0.1.0/8'],
      ['secondary', '10.0.2.0/8'],
      ['wireless', '10.0.3.0/8'],
      ['clients', '10.0.4.0/8'],
    ].map(([id, subnet]) => ({
      id: `auvik-subnet-${id}`,
      title: 'SUBNET',
      subtitle: subnet,
      icon: 'node-network',
      variant: 'subnet' as const,
    })),
    {
      id: 'auvik-switch-primary',
      title: 'UbiSwitch_Primary',
      subtitle: '192.168.1.2',
      icon: 'ethernet',
      variant: 'device',
      deviceType: 'networking',
      expandable: true,
      deviceIndicatorsLabel: '19 active devices and 5 inactive devices',
      deviceIndicators: [
        ...Array.from({ length: 7 }, () => 'active' as const),
        'inactive',
        'inactive',
        ...Array.from({ length: 12 }, () => 'active' as const),
        ...Array.from({ length: 3 }, () => 'inactive' as const),
      ],
    },
    {
      id: 'auvik-device-2',
      title: 'DESKTOP-GUNBI-01',
      subtitle: '192.168.1.24',
      icon: 'laptop',
      variant: 'device',
      deviceType: 'endpoint',
      deviceIndicators: Array.from({ length: 8 }, () => 'active' as const),
    },
    {
      id: 'auvik-device-3',
      title: 'DESKTOP-GUNBI-02',
      subtitle: '192.168.1.25',
      icon: 'laptop',
      variant: 'device',
      deviceType: 'endpoint',
    },
    {
      id: 'auvik-connected-primary',
      title: 'Connected',
      subtitle: '13 devices',
      variant: 'group',
    },
    {
      id: 'auvik-switch-secondary',
      title: 'SW-TP01',
      subtitle: '192.168.3.1',
      icon: 'ethernet',
      variant: 'device',
      deviceType: 'networking',
      expandable: true,
      deviceIndicatorsLabel: '2 offline and 2 devices with errors',
      deviceIndicators: [
        'muted',
        'muted',
        'error',
        'error',
        'inactive',
        'inactive',
        'inactive',
        'inactive',
      ],
    },
    {
      id: 'auvik-server-secondary',
      title: 'Server Room',
      subtitle: '192.168.3.22',
      icon: 'server',
      variant: 'device',
      deviceType: 'endpoint',
      state: 'error',
    },
    {
      id: 'auvik-connected-secondary',
      title: 'Connected',
      subtitle: '4 devices',
      variant: 'group',
    },
    {
      id: 'auvik-laptop',
      title: 'DESKTOP-AX018',
      subtitle: '192.168.60.3',
      icon: 'laptop',
      variant: 'device',
      deviceType: 'endpoint',
    },
    {
      id: 'auvik-tablet',
      title: 'Tablet-Frontdesk',
      subtitle: '192.168.60.19',
      icon: 'laptop',
      variant: 'device',
      deviceType: 'endpoint',
      state: 'disabled',
      alerts: [{ label: 'Collector offline', severity: 'danger' }],
    },
    {
      id: 'auvik-access-point',
      title: 'LX-00',
      subtitle: '192.168.70.30',
      icon: 'wifi',
      variant: 'device',
      deviceType: 'networking',
    },
    {
      id: 'auvik-workstation',
      title: 'DESKTOP-LAB-05',
      subtitle: '192.168.70.31',
      icon: 'pc-tower',
      variant: 'device',
      deviceType: 'endpoint',
    },
  ],
  edges: [
    { source: 'auvik-network', target: 'auvik-gateway', type: 'layer1' },
    ...['primary', 'secondary', 'wireless', 'clients'].map((id) => ({
      source: 'auvik-gateway',
      target: `auvik-subnet-${id}`,
      type: 'layer1',
    })),
    {
      source: 'auvik-subnet-primary',
      target: 'auvik-switch-primary',
      type: 'layer1',
    },
    {
      source: 'auvik-switch-primary',
      target: 'auvik-device-2',
      type: 'layer1',
    },
    { source: 'auvik-switch-primary', target: 'auvik-device-3', type: 'wifi' },
    {
      source: 'auvik-switch-primary',
      target: 'auvik-connected-primary',
      type: 'layer1',
    },
    {
      source: 'auvik-subnet-secondary',
      target: 'auvik-switch-secondary',
      type: 'layer1',
    },
    {
      source: 'auvik-switch-secondary',
      target: 'auvik-server-secondary',
      type: 'layer1',
    },
    {
      source: 'auvik-server-secondary',
      target: 'auvik-connected-secondary',
      type: 'layer1',
    },
    { source: 'auvik-subnet-wireless', target: 'auvik-laptop', type: 'wifi' },
    {
      source: 'auvik-laptop',
      target: 'auvik-tablet',
      type: 'wifi',
      style: 'dotted',
    },
    {
      source: 'auvik-subnet-clients',
      target: 'auvik-access-point',
      type: 'wifi',
    },
    {
      source: 'auvik-access-point',
      target: 'auvik-workstation',
      type: 'wifi',
    },
    {
      source: 'auvik-device-2',
      target: 'auvik-server-secondary',
      type: 'layer3-inferred',
      style: 'dotted',
    },
  ],
};

const figmaCompactData: NetworkGraphData = {
  roots: ['auvik-network'],
  nodes: auvikTopologyData.nodes
    .filter((node) =>
      [
        'auvik-network',
        'auvik-gateway',
        'auvik-subnet-primary',
        'auvik-subnet-secondary',
        'auvik-subnet-wireless',
        'auvik-subnet-clients',
        'auvik-switch-primary',
        'auvik-switch-secondary',
        'auvik-laptop',
        'auvik-access-point',
        'auvik-connected-primary',
        'auvik-connected-secondary',
      ].includes(node.id)
    )
    .map((node) =>
      node.id === 'auvik-access-point'
        ? { ...node, icon: 'pc-tower', deviceType: 'endpoint' }
        : node
    ),
  edges: [
    ...auvikTopologyData.edges.filter((edge) =>
      [
        'auvik-network',
        'auvik-gateway',
        'auvik-subnet-primary',
        'auvik-subnet-secondary',
        'auvik-subnet-wireless',
        'auvik-subnet-clients',
      ].includes(edge.source)
    ),
    { source: 'auvik-switch-primary', target: 'auvik-connected-primary' },
    { source: 'auvik-switch-secondary', target: 'auvik-connected-secondary' },
  ],
};

const expandedDevices = [
  ['primary-pc', 'DESKTOP-EUIN9NJ', '192.168.1.21', 'pc-tower'],
  ['primary-switch', 'UbiSwitch_Primary', '192.168.1.12', 'ethernet'],
  ['primary-desktop', 'DESKTOP-GUIN9NJ', '192.168.1.9', 'pc-tower'],
  ['primary-laptop', 'WIN-11-A', '192.168.1.4', 'laptop'],
  ['primary-connect', 'WIN11-13A', '192.168.1.3', 'circle-connect'],
  ['primary-linux', 'LX-01', '192.168.1.112', 'pc-tower'],
  ['primary-mac', 'MacBook16-ax001', '192.168.1.48', 'laptop'],
  ['primary-mac-pro', 'macbookPro16', '192.168.1.31', 'laptop'],
  ['primary-acp', 'acp-arif-win7-1', '192.168.1.42', 'pc-tower'],
  ['primary-ap', 'AP-01', '192.168.1.7', 'wifi'],
  ['primary-mac-device', 'mac-12345', '192.168.1.73', 'pc-tower'],
  ['primary-ax', 'DESKTOP-AX001', '192.168.1.211', 'pc-tower'],
  ['switch-pc', 'DESKTOP-GUIN9NJ', '192.168.1.81', 'pc-tower'],
  ['switch-laptop', 'WIN11-13A', '192.168.1.82', 'laptop'],
  ['switch-linux', 'Linux001', '192.168.1.84', 'box'],
  ['switch-linux-test', 'Linux002-test', '192.168.1.89', 'box'],
  ['ap-pc', 'ER-PC-007', '192.168.1.91', 'pc-tower'],
  ['ap-laptop', 'WORKSTATION-11B', '192.168.1.92', 'laptop'],
  ['ap-server', 'SERVER-ALPHA', '192.168.1.93', 'box'],
  ['ap-linux', 'TEST-LINUX-002', '192.168.1.95', 'box'],
  ['secondary-pc', 'DESKTOP-GUIN9NJ', '192.168.3.16', 'pc-tower'],
  ['secondary-offline', 'WIN11-13A', '192.168.3.4', 'circle-connect'],
  ['secondary-linux', 'Linux001', '192.168.3.3', 'box'],
  ['secondary-test', 'Linux002-test', '192.168.3.16', 'box'],
  ['wireless-pc', 'DESKTOP-WWINJ', '192.168.3.2', 'pc-tower'],
  ['wireless-offline', 'WIN11-15B', '192.168.3.4', 'circle-connect'],
  ['wireless-linux', 'Lin002', '192.168.3.3', 'box'],
  ['wireless-test', 'Lin001', '192.168.3.16', 'box'],
] as const;

const figmaExpandedData: NetworkGraphData = {
  roots: ['auvik-network'],
  nodes: [
    ...figmaCompactData.nodes.filter((node) =>
      [
        'auvik-network',
        'auvik-gateway',
        'auvik-subnet-primary',
        'auvik-subnet-secondary',
        'auvik-subnet-wireless',
        'auvik-subnet-clients',
        'auvik-switch-primary',
        'auvik-laptop',
      ].includes(node.id)
    ),
    {
      id: 'firewall',
      title: 'FortiGate-stage-60f',
      subtitle: '192.168.3.217',
      icon: 'firewall',
      variant: 'device',
      deviceType: 'networking',
    },
    {
      id: 'secondary-switch',
      title: 'SW-TP01',
      subtitle: '192.168.3.2',
      icon: 'ethernet',
      variant: 'device',
      deviceType: 'networking',
      expandable: true,
      deviceIndicators: [
        'muted',
        'muted',
        'error',
        'error',
        'inactive',
        'inactive',
        'inactive',
        'inactive',
      ],
      deviceIndicatorsLabel: '2 offline devices and 2 devices with errors',
    },
    {
      id: 'clients-ap',
      title: 'AP-002',
      subtitle: '192.168.70.30',
      icon: 'wifi',
      variant: 'device',
      deviceType: 'endpoint',
      expandable: true,
    },
    ...expandedDevices.map(([id, title, subtitle, icon]) => ({
      id,
      title,
      subtitle,
      icon,
      variant: 'device' as const,
      deviceType: (icon === 'ethernet' || icon === 'circle-connect'
        ? 'networking'
        : 'endpoint') as 'networking' | 'endpoint',
      ...(['primary-switch', 'primary-ap'].includes(id)
        ? { expandable: true }
        : {}),
      ...(['secondary-pc', 'secondary-offline', 'wireless-offline'].includes(id)
        ? { state: 'disabled' as const }
        : {}),
      ...(['secondary-linux', 'secondary-test'].includes(id)
        ? { state: 'error' as const }
        : {}),
      ...(id.endsWith('-offline')
        ? {
            alerts: [
              { label: 'Collector offline', severity: 'danger' as const },
            ],
          }
        : {}),
      ...(id === 'primary-switch'
        ? {
            deviceIndicators: [
              { state: 'active' as const, size: 14 as const },
              ...Array.from({ length: 3 }, () => 'active' as const),
              ...Array.from({ length: 4 }, () => 'inactive' as const),
            ],
            deviceIndicatorsLabel: '4 active and 4 inactive devices',
          }
        : {}),
    })),
  ],
  edges: [
    ...figmaCompactData.edges.filter((edge) =>
      ['auvik-network', 'auvik-gateway'].includes(edge.source)
    ),
    { source: 'auvik-subnet-primary', target: 'auvik-switch-primary' },
    { source: 'auvik-subnet-secondary', target: 'firewall' },
    { source: 'firewall', target: 'secondary-switch' },
    { source: 'auvik-subnet-wireless', target: 'auvik-laptop' },
    { source: 'auvik-subnet-clients', target: 'clients-ap' },
    ...expandedDevices.map(([id]) => ({
      source: id.startsWith('primary-')
        ? 'auvik-switch-primary'
        : id.startsWith('switch-')
          ? 'primary-switch'
          : id.startsWith('ap-')
            ? 'primary-ap'
            : id.startsWith('secondary-')
              ? 'secondary-switch'
              : 'clients-ap',
      target: id,
    })),
  ],
};

const figmaCompactInteractiveData: NetworkGraphData = {
  roots: figmaCompactData.roots,
  nodes: [
    ...figmaCompactData.nodes.map((node) =>
      node.id === 'auvik-switch-primary'
        ? { ...node, collapsedGroupId: 'auvik-connected-primary' }
        : node.id === 'auvik-switch-secondary'
          ? { ...node, collapsedGroupId: 'auvik-connected-secondary' }
          : node
    ),
    ...figmaExpandedData.nodes.filter(
      (node) =>
        ['primary-', 'switch-', 'ap-', 'secondary-'].some((prefix) =>
          node.id.startsWith(prefix)
        ) && node.id !== 'secondary-switch'
    ),
  ],
  edges: [
    ...figmaCompactData.edges,
    ...figmaExpandedData.edges
      .filter((edge) =>
        [
          'auvik-switch-primary',
          'primary-switch',
          'primary-ap',
          'secondary-switch',
        ].includes(edge.source)
      )
      .map((edge) =>
        edge.source === 'secondary-switch'
          ? { ...edge, source: 'auvik-switch-secondary' }
          : edge
      ),
  ],
};

const FIGMA_CARD_STATES = [
  'default',
  'hover',
  'active',
  'focus',
  'disabled',
  'error',
] as const;

function FigmaCardStateSheet() {
  return (
    <div className="grid w-[530px] max-w-full grid-cols-2 gap-x-[52px] p-2">
      {FIGMA_CARD_STATES.flatMap((state) =>
        (['endpoint', 'networking'] as const).map((deviceType) => (
          <div key={`${deviceType}-${state}`} className="-mb-2 min-w-0">
            <NetworkGraph
              width={231}
              height={88}
              showZoomControls={false}
              ariaLabel={`${deviceType} ${state} card`}
              graphData={{
                roots: ['device'],
                nodes: [
                  {
                    id: 'device',
                    title: 'DESKTOP-EUIN9NJ',
                    subtitle: '208.31.204.12',
                    icon: 'pc-tower',
                    variant: 'device',
                    deviceType,
                    state,
                    width: 199,
                  },
                ],
                edges: [],
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}

function graphSource(graphData: NetworkGraphData, props = '') {
  return `import { NetworkGraph, type NetworkGraphData } from '@acronis-platform/ui-react';

const graphData: NetworkGraphData = ${JSON.stringify(graphData, null, 2)};

<NetworkGraph
  graphData={graphData}
  ariaLabel="Network topology"${props}
/>;`;
}

const multipleRootsData: NetworkGraphData = {
  roots: ['primary', 'backup'],
  nodes: [
    {
      id: 'primary',
      title: 'Primary network',
      icon: 'cloud',
      variant: 'network',
    },
    {
      id: 'primary-client',
      title: 'Primary client',
      icon: 'laptop',
      variant: 'device',
    },
    {
      id: 'backup',
      title: 'Backup network',
      icon: 'cloud',
      variant: 'network',
    },
    {
      id: 'backup-server',
      title: 'Backup server',
      icon: 'server',
      variant: 'device',
    },
  ],
  edges: [
    { source: 'primary', target: 'primary-client', type: 'layer1' },
    { source: 'backup', target: 'backup-server', type: 'vpn', style: 'dotted' },
  ],
};

const meta = {
  title: 'UI/NetworkGraph',
  component: NetworkGraph,
  tags: ['autodocs', 'network-graph'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-[720px] p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
  args: {
    graphData: basicData,
    width: '100%',
    height: 680,
    ariaLabel: 'Network topology',
    onNodeClick: fn(),
    onEdgeClick: fn(),
    onCollapsedNodeIdsChange: fn(),
  },
} satisfies Meta<typeof NetworkGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicHierarchy: Story = {
  parameters: { docs: { source: { code: graphSource(basicData) } } },
};

const contentAndStateData: NetworkGraphData = {
  roots: ['circle', 'device', 'disabled', 'error'],
  nodes: [
    {
      id: 'circle',
      title: 'Circular router',
      subtitle: '10.0.0.1',
      caption: 'Online',
      icon: 'router',
      shape: 'circle',
    },
    {
      id: 'device',
      title: 'Device name',
      subtitle: '10.0.0.2',
      caption: 'Online',
      icon: 'laptop',
    },
    {
      id: 'disabled',
      title: 'Disabled device',
      subtitle: '10.0.0.3',
      icon: 'laptop',
      state: 'disabled',
    },
    {
      id: 'error',
      title: 'Device error',
      subtitle: '10.0.0.4',
      icon: 'laptop',
      state: 'error',
    },
  ],
  edges: [],
};

export const ContentAndSelectedStates: Story = {
  args: {
    graphData: contentAndStateData,
    selectedNodeIds: ['disabled', 'error'],
    height: 300,
  },
  parameters: {
    docs: {
      source: {
        code: graphSource(
          contentAndStateData,
          '\n  selectedNodeIds={["disabled", "error"]}'
        ),
      },
    },
  },
};

export const AuvikTopologyExample: Story = {
  args: {
    graphData: auvikTopologyData,
    ariaLabel: 'Auvik network topology example',
    height: 680,
  },
  parameters: {
    docs: {
      source: { code: graphSource(auvikTopologyData) },
      description: {
        story:
          'A multi-branch topology based on the Auvik details view, including Figma networking and endpoint card treatments.',
      },
    },
  },
};

export const FigmaCompactTopology: Story = {
  args: {
    graphData: figmaCompactInteractiveData,
    defaultCollapsedNodeIds: ['auvik-switch-primary', 'auvik-switch-secondary'],
    ariaLabel: 'Compact Figma topology',
  },
  parameters: {
    docs: {
      source: {
        code: graphSource(
          figmaCompactInteractiveData,
          "\n  defaultCollapsedNodeIds={['auvik-switch-primary', 'auvik-switch-secondary']}"
        ),
      },
      description: {
        story:
          'The compact network hierarchy and group branches from Figma 2029.',
      },
    },
  },
};

function ExpandedCanvas(args: React.ComponentProps<typeof NetworkGraph>) {
  const scroller = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (scroller.current)
      scroller.current.scrollLeft =
        (scroller.current.scrollWidth - scroller.current.clientWidth) / 2;
  }, []);
  return (
    <div ref={scroller} className="max-w-full overflow-x-auto">
      <NetworkGraph {...args} />
    </div>
  );
}

export const FigmaExpandedTopology: Story = {
  args: {
    graphData: figmaExpandedData,
    ariaLabel: 'Expanded Figma topology',
    width: 5260,
    height: 1080,
    horizontalGap: 16,
  },
  render: (args) => <ExpandedCanvas {...args} />,
  parameters: {
    snapshot: { fullPage: true },
    docs: {
      source: {
        code: graphSource(
          figmaExpandedData,
          '\n  width={5260}\n  height={1080}\n  horizontalGap={16}'
        )
          .replace(
            '<NetworkGraph\n',
            '<div style={{ maxWidth: "100%", overflowX: "auto" }}>\n<NetworkGraph\n'
          )
          .replace('/>;', '/>\n</div>;'),
      },
      description: {
        story:
          'The expanded Figma 2238 topology at its original canvas width. Scroll horizontally to inspect its branches and device details.',
      },
    },
  },
};

function ConsumerViewportControls() {
  const viewport = React.useRef<NetworkGraphViewportHandle>(null);
  const graph = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);
  const [collapsed, setCollapsed] = React.useState<string[]>([
    'auvik-switch-primary',
    'auvik-switch-secondary',
  ]);
  return (
    <div>
      <div className="flex items-center gap-2">
        <Button onClick={() => viewport.current?.zoomOut()}>Zoom out</Button>
        <span aria-live="polite">{Math.round(zoom * 100)}%</span>
        <Button onClick={() => viewport.current?.zoomIn()}>Zoom in</Button>
        <Button onClick={() => viewport.current?.fit()}>Fit</Button>
        <Button onClick={() => setCollapsed([])}>Expand all</Button>
        <Button
          onClick={() =>
            setCollapsed(
              figmaCompactInteractiveData.nodes
                .filter((node) => node.expandable)
                .map((node) => node.id)
            )
          }
        >
          Collapse all
        </Button>
        <Button onClick={() => graph.current?.requestFullscreen()}>
          Fullscreen
        </Button>
      </div>
      <NetworkGraph
        ref={graph}
        viewportRef={viewport}
        onZoomChange={setZoom}
        graphData={figmaCompactInteractiveData}
        collapsedNodeIds={collapsed}
        onCollapsedNodeIdsChange={setCollapsed}
        showZoomControls={false}
      />
    </div>
  );
}

export const ConsumerControls: Story = {
  render: () => <ConsumerViewportControls />,
  parameters: {
    snapshot: { fullPage: true },
    docs: {
      source: {
        code: `import * as React from 'react';
import { Button, NetworkGraph, type NetworkGraphData, type NetworkGraphViewportHandle } from '@acronis-platform/ui-react';

function Example({ graphData }: { graphData: NetworkGraphData }) {
  const viewport = React.useRef<NetworkGraphViewportHandle>(null);
  const graph = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = React.useState(1);
  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  return (
    <div>
      <Button onClick={() => viewport.current?.zoomOut()}>Zoom out</Button>
      <span>{Math.round(zoom * 100)}%</span>
      <Button onClick={() => viewport.current?.zoomIn()}>Zoom in</Button>
      <Button onClick={() => viewport.current?.fit()}>Fit</Button>
      <Button onClick={() => setCollapsed([])}>Expand all</Button>
      <Button onClick={() => setCollapsed(graphData.nodes.filter(node => node.expandable).map(node => node.id))}>Collapse all</Button>
      <Button onClick={() => graph.current?.requestFullscreen()}>Fullscreen</Button>
      <NetworkGraph ref={graph} viewportRef={viewport} onZoomChange={setZoom}
        graphData={graphData} collapsedNodeIds={collapsed}
        onCollapsedNodeIdsChange={setCollapsed} showZoomControls={false} />
    </div>
  );
}`,
      },
    },
  },
};

export const CollapsedBranches: Story = {
  args: {
    graphData: figmaCompactInteractiveData,
    defaultCollapsedNodeIds: ['auvik-switch-primary', 'auvik-switch-secondary'],
    ariaLabel: 'Topology with a collapsed branch',
  },
  parameters: {
    docs: {
      source: {
        code: graphSource(
          figmaCompactInteractiveData,
          `\n  defaultCollapsedNodeIds={['auvik-switch-primary', 'auvik-switch-secondary']}`
        ),
      },
      description: {
        story:
          'Use the branch chevron to expand and collapse its tree descendants; the Actions panel reports collapsed IDs.',
      },
    },
  },
};

export const PannableTopology: Story = {
  args: {
    graphData: auvikTopologyData,
    graphDraggable: true,
    ariaLabel: 'Pannable Auvik network topology example',
    height: 680,
  },
  parameters: {
    docs: {
      source: { code: graphSource(auvikTopologyData, '\n  graphDraggable') },
      description: {
        story:
          'Canvas panning is opt-in with graphDraggable. The default NetworkGraph story has panning disabled.',
      },
    },
  },
};

export const FigmaCardStates: Story = {
  tags: ['network-graph-card-states'],
  render: () => <FigmaCardStateSheet />,
  parameters: {
    docs: {
      source: {
        code: graphSource({
          roots: FIGMA_CARD_STATES.flatMap((state) =>
            ['endpoint', 'networking'].map(
              (deviceType) => `${deviceType}-${state}`
            )
          ),
          nodes: FIGMA_CARD_STATES.flatMap((state) =>
            (['endpoint', 'networking'] as const).map((deviceType) => ({
              id: `${deviceType}-${state}`,
              title: 'DESKTOP-EUIN9NJ',
              subtitle: '208.31.204.12',
              icon: 'pc-tower',
              variant: 'device' as const,
              deviceType,
              state,
            }))
          ),
          edges: [],
        }),
      },
      description: {
        story:
          'Shows the Figma Endpoint and Networking card variants in Default, Hover, Active, Focus, Disabled, and Error states.',
      },
    },
  },
};

export const MultipleRoots: Story = {
  args: {
    graphData: multipleRootsData,
  },
  parameters: { docs: { source: { code: graphSource(multipleRootsData) } } },
};

export const SelectedNodeAndPath: Story = {
  args: {
    selectedNodeIds: ['switch-primary'],
    selectedNodePairs: [{ from: 'gateway', to: 'workstation' }],
  },
  parameters: {
    docs: {
      source: {
        code: graphSource(
          basicData,
          `\n  selectedNodeIds={['switch-primary']}\n  selectedNodePairs={[{ from: 'gateway', to: 'workstation' }]}`
        ),
      },
    },
  },
};

export const CustomNodeText: Story = {
  tags: ['network-graph-custom-text'],
  args: {
    renderNodeText: (node) => (
      <>
        <strong className="block min-w-0 max-w-full truncate text-[10px] font-bold leading-4 tracking-[1px] text-[var(--ui-text-on-surface-secondary)]">
          {node.title}
        </strong>
        {node.subtitle ? (
          <span className="block min-w-0 max-w-full truncate text-sm leading-6 text-[var(--ui-text-on-surface-primary)]">
            {node.subtitle}
          </span>
        ) : null}
      </>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: graphSource(
          basicData,
          `\n  renderNodeText={(node) => (\n    <>\n      <strong className="block min-w-0 max-w-full truncate text-[10px] font-bold leading-4 tracking-[1px] text-[var(--ui-text-on-surface-secondary)]">\n        {node.title}\n      </strong>\n      {node.subtitle && (\n        <span className="block min-w-0 max-w-full truncate text-sm leading-6 text-[var(--ui-text-on-surface-primary)]">\n          {node.subtitle}\n        </span>\n      )}\n    </>\n  )}`
        ),
      },
    },
  },
};

export const ConsumerEmptyState: Story = {
  args: {
    graphData: { nodes: [], edges: [], roots: [] },
    emptyState: (
      <div className="max-w-sm text-center">
        <h2 className="text-base font-semibold">No topology data</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add content here from the application that owns this graph.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      source: {
        code: graphSource(
          { nodes: [], edges: [], roots: [] },
          `\n  emptyState={\n    <div className="max-w-sm text-center">\n      <h2 className="text-base font-semibold">No topology data</h2>\n      <p className="mt-2 text-sm text-muted-foreground">\n        Add content here from the application that owns this graph.\n      </p>\n    </div>\n  }`
        ),
      },
    },
  },
};

export const DenseTopology: Story = {
  args: { graphData: denseData },
  parameters: { docs: { source: { code: graphSource(denseData) } } },
};
