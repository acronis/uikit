'use client';

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
      deviceIndicators: ['active', 'active', 'inactive'],
    },
    {
      id: 'client',
      title: 'Workstation',
      subtitle: '192.168.1.3',
      icon: 'laptop',
      variant: 'device',
      deviceType: 'endpoint',
    },
  ],
  edges: [
    { source: 'network', target: 'switch', type: 'layer1' },
    { source: 'switch', target: 'client', type: 'layer1' },
  ],
};

export function NetworkGraphDemo() {
  return (
    <NetworkGraph graphData={data} height={440} ariaLabel="Network topology" />
  );
}
