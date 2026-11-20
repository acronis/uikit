import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  NetworkGraph,
  type NetworkGraphData,
  type NetworkGraphViewportHandle,
} from '../network-graph';
import {
  findNetworkGraphPaths,
  layoutNetworkGraph,
} from '../network-graph-layout';

const baseData: NetworkGraphData = {
  roots: ['root'],
  nodes: [
    { id: 'root', title: 'Root network', icon: 'router' },
    { id: 'branch', title: 'Office subnet', subtitle: '10.0.0.0/24' },
    { id: 'server', title: 'Server', subtitle: 'SRV-01', caption: 'Online' },
    { id: 'client', title: 'Client', subtitle: 'LT-04' },
    { id: 'isolated', title: 'Disconnected device' },
  ],
  edges: [
    { source: 'root', target: 'branch', type: 'layer1', metadata: 'uplink' },
    { source: 'branch', target: 'server', type: 'layer1', metadata: 'wired' },
    { source: 'branch', target: 'client', type: 'wifi', style: 'dotted' },
    { source: 'root', target: 'server', type: 'layer3-inferred' },
  ],
};

function renderGraph(
  graphData: NetworkGraphData = baseData,
  props: Partial<React.ComponentProps<typeof NetworkGraph>> = {}
) {
  return render(
    <NetworkGraph
      graphData={graphData}
      ariaLabel="Network topology"
      {...props}
    />
  );
}

function graphTransform(container: HTMLElement) {
  return container.querySelector('svg > g')?.getAttribute('transform');
}

describe('NetworkGraph layout', () => {
  it('allows the Figma device rows to use a smaller gap without overlapping', () => {
    const nodes = [{ id: 'parent' }, { id: 'left' }, { id: 'right' }];
    const edges = [
      { source: 'parent', target: 'left' },
      { source: 'parent', target: 'right' },
    ];
    const layout = layoutNetworkGraph(nodes, edges, ['parent'], 16);
    expect(
      layout.positions.get('right')!.x - layout.positions.get('left')!.x
    ).toBe(208);
  });
  it('places one rooted hierarchy top-down and centers each parent over its children', () => {
    const layout = layoutNetworkGraph(
      [{ id: 'root' }, { id: 'left' }, { id: 'right' }, { id: 'leaf' }],
      [
        { source: 'root', target: 'left' },
        { source: 'root', target: 'right' },
        { source: 'left', target: 'leaf' },
      ],
      ['root']
    );

    expect(layout.positions.get('root')?.depth).toBe(0);
    expect(layout.positions.get('left')?.depth).toBe(1);
    expect(layout.positions.get('leaf')?.depth).toBe(2);
    expect(layout.positions.get('root')?.x).toBe(
      ((layout.positions.get('left')?.x ?? 0) +
        (layout.positions.get('right')?.x ?? 0)) /
        2
    );
  });

  it('matches the Figma topology card sizes and level spacing', () => {
    const subnets = ['primary', 'secondary', 'wireless', 'clients'];
    const nodes = [
      { id: 'network', variant: 'network' as const },
      { id: 'gateway', variant: 'gateway' as const },
      ...subnets.map((id) => ({
        id: `subnet-${id}`,
        variant: 'subnet' as const,
      })),
      ...subnets.map((id) => ({
        id: `device-${id}`,
        variant: 'device' as const,
      })),
      { id: 'group-primary', variant: 'group' as const },
      { id: 'group-secondary', variant: 'group' as const },
    ];
    const edges = [
      { source: 'network', target: 'gateway' },
      ...subnets.map((id) => ({ source: 'gateway', target: `subnet-${id}` })),
      ...subnets.map((id) => ({
        source: `subnet-${id}`,
        target: `device-${id}`,
      })),
      { source: 'device-primary', target: 'group-primary' },
      { source: 'device-secondary', target: 'group-secondary' },
    ];
    const layout = layoutNetworkGraph(nodes, edges, ['network']);

    expect(layout.width).toBe(960);
    expect(layout.height).toBe(698);
    expect(layout.positions.get('network')).toEqual({
      x: 480,
      y: 56,
      depth: 0,
    });
    expect(layout.positions.get('gateway')?.y).toBe(188);
    expect(layout.positions.get('subnet-primary')).toEqual({
      x: 96,
      y: 352,
      depth: 2,
    });
    expect(layout.positions.get('device-clients')?.y).toBe(482);
    expect(layout.positions.get('group-primary')?.y).toBe(670);
    expect(layout.nodeSizes.get('network')).toEqual({
      width: 139,
      height: 112,
    });
    expect(layout.nodeSizes.get('subnet-primary')).toEqual({
      width: 128,
      height: 104,
    });
    expect(layout.nodeSizes.get('device-primary')).toEqual({
      width: 192,
      height: 56,
    });
  });

  it('adds the Figma device markers and alert rows to the node footprint', () => {
    const layout = layoutNetworkGraph(
      [
        {
          id: 'switch',
          variant: 'device' as const,
          deviceIndicators: [...Array(19), ...Array(5)],
          alerts: [{ label: 'Collector offline' }],
        },
      ],
      [],
      ['switch']
    );

    expect(layout.nodeSizes.get('switch')).toEqual({
      width: 192,
      height: 132,
    });
    expect(layout.height).toBe(132);
  });

  it('accounts for the larger Figma marker when its row wraps', () => {
    const layout = layoutNetworkGraph(
      [
        {
          id: 'device',
          width: 30,
          deviceIndicators: [{ state: 'active', size: 14 }, 'active', 'active'],
        },
      ],
      [],
      ['device']
    );
    expect(layout.nodeSizes.get('device')?.height).toBe(
      56 + 16 + 14 + 4 + 12 + 4
    );
  });

  it('lays out multiple declared roots and preserves disconnected nodes', () => {
    const layout = layoutNetworkGraph(
      [
        { id: 'first' },
        { id: 'first-child' },
        { id: 'second' },
        { id: 'loose' },
      ],
      [{ source: 'first', target: 'first-child' }],
      ['first', 'second']
    );

    expect([...layout.positions.keys()]).toEqual([
      'first',
      'first-child',
      'second',
      'loose',
    ]);
    expect(layout.positions.get('second')?.depth).toBe(0);
    expect(layout.positions.get('loose')?.depth).toBe(0);
    expect(layout.positions.get('first')?.x).toBeLessThan(
      layout.positions.get('second')?.x ?? 0
    );
  });

  it('supports an empty graph and an isolated node', () => {
    const empty = layoutNetworkGraph([], [], []);
    const isolated = layoutNetworkGraph([{ id: 'alone' }], [], []);

    expect(empty.positions.size).toBe(0);
    expect(empty.width).toBe(0);
    expect(isolated.positions.get('alone')?.depth).toBe(0);
  });

  it('rejects duplicate node ids', () => {
    expect(() =>
      layoutNetworkGraph([{ id: 'same' }, { id: 'same' }], [], ['same'])
    ).toThrow('NetworkGraph node id must be unique: same');
  });

  it('keeps cycles and cross-edges while skipping edges with missing endpoints', () => {
    const edges = [
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
      { source: 'c', target: 'a' },
      { source: 'a', target: 'c' },
      { source: 'missing', target: 'a' },
    ];
    const layout = layoutNetworkGraph(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      edges,
      ['a']
    );

    expect(layout.positions.size).toBe(3);
    expect(layout.validEdges.map(({ index }) => index)).toEqual([0, 1, 2, 3]);
  });

  it('chooses shortest paths and unions selected path nodes and edges', () => {
    const selection = findNetworkGraphPaths(
      new Set(['a', 'b', 'c', 'd']),
      [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'd' },
        { source: 'a', target: 'c' },
        { source: 'c', target: 'b' },
      ],
      [{ from: 'a', to: 'd' }]
    );

    expect([...selection.nodeIds]).toEqual(['d', 'b', 'a']);
    expect([...selection.edgeIndices]).toEqual([1, 0]);
  });
});

describe('NetworkGraph', () => {
  it('exposes a labeled region with full-width and default-height dimensions', () => {
    renderGraph();

    expect(
      screen.getByRole('region', { name: 'Network topology' })
    ).toHaveStyle({
      width: '100%',
      height: '770px',
    });
  });

  it('leaves the canvas background to the consumer', () => {
    renderGraph();

    const graph = screen.getByRole('region', { name: 'Network topology' });
    expect(graph.className).not.toContain(
      'bg-[var(--ui-background-surface-secondary)]'
    );
  });

  it('renders consumer empty-state content without product copy', () => {
    renderGraph(
      { nodes: [], edges: [], roots: [] },
      {
        emptyState: <p>Topology is empty</p>,
      }
    );

    expect(screen.getByText('Topology is empty')).toBeInTheDocument();
  });

  it('renders node labels, icon, shape, and token color', () => {
    const graphData: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        {
          id: 'root',
          title: 'Main router',
          subtitle: 'HQ',
          caption: 'Active',
          icon: 'router',
          shape: 'circle',
          color: 'var(--ui-border-on-surface-border-active)',
        },
      ],
      edges: [],
    };
    const { container } = renderGraph(graphData);

    expect(
      screen.getByRole('button', { name: 'Main router, HQ, Active' })
    ).toBeInTheDocument();
    expect(container.querySelector('circle')).toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-border-active)'
    );
    expect(container.querySelector('foreignObject svg')).toBeInTheDocument();
    expect(screen.getByText('Main router')).toBeInTheDocument();
    expect(screen.getByText('HQ')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Figma network, subnet, device, and group cards with semantic tokens', () => {
    const graphData: NetworkGraphData = {
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
        },
        {
          id: 'subnet',
          title: 'SUBNET',
          subtitle: '10.0.1.0/8',
          icon: 'node-network',
          variant: 'subnet',
        },
        {
          id: 'device',
          title: 'UbiSwitch_Primary',
          subtitle: '192.168.1.2',
          icon: 'ethernet',
          variant: 'device',
        },
        {
          id: 'group',
          title: 'Connected',
          subtitle: '13 devices',
          variant: 'group',
        },
      ],
      edges: [
        { source: 'network', target: 'gateway' },
        { source: 'gateway', target: 'subnet' },
        { source: 'subnet', target: 'device' },
        { source: 'device', target: 'group' },
      ],
    };
    const { container } = renderGraph(graphData);
    const network = container.querySelector('[data-network-node="network"]')!;
    const subnet = container.querySelector('[data-network-node="subnet"]')!;
    const device = container.querySelector('[data-network-node="device"]')!;

    expect(network).toHaveAttribute('data-network-node-variant', 'network');
    const networkCard = network.querySelector('[data-network-card="network"]')!;
    const subnetCard = subnet.querySelector('[data-network-card="subnet"]')!;
    const deviceCard = device.querySelector('[data-network-card="device"]')!;
    expect(network.querySelector('foreignObject')).toHaveAttribute(
      'width',
      '139'
    );
    expect(network.querySelector('foreignObject')).toHaveAttribute(
      'height',
      '112'
    );
    expect(networkCard.className).toContain(
      'bg-[var(--ui-background-surface-active)]'
    );
    expect(networkCard.getAttribute('style')).toContain('border-width: 0px');
    expect(subnet.querySelector('foreignObject')).toHaveAttribute(
      'width',
      '128'
    );
    expect(subnet.querySelector('foreignObject')).toHaveAttribute(
      'height',
      '104'
    );
    expect(subnetCard).toHaveAttribute('data-network-card', 'subnet');
    expect(device.querySelector('foreignObject')).toHaveAttribute(
      'width',
      '192'
    );
    expect(device.querySelector('foreignObject')).toHaveAttribute(
      'height',
      '56'
    );
    expect(deviceCard.className).toContain(
      'bg-[var(--ui-background-surface-primary)]'
    );
    expect(deviceCard.getAttribute('style')).toContain(
      'border-color: var(--ui-border-on-surface-divider)'
    );
    expect(deviceCard.getAttribute('style')).toContain('border-width: 1px');
    expect(screen.getByText('192.168.1.2')).toBeInTheDocument();
    expect(screen.getByText('UbiSwitch_Primary')).toBeInTheDocument();
    expect(screen.getByText('13 devices')).toBeInTheDocument();
    expect(
      device.querySelector('foreignObject [data-network-card] > div > span')
        ?.className
    ).toContain('var(--ui-background-status-info)');
  });

  it('renders Figma device types and disabled/error card states', () => {
    const graphData: NetworkGraphData = {
      roots: [
        'networking',
        'endpoint',
        'disabled-networking',
        'disabled-endpoint',
        'error-endpoint',
        'hover-endpoint',
        'active-endpoint',
        'focus-endpoint',
      ],
      nodes: [
        {
          id: 'networking',
          title: 'Networking device',
          icon: 'ethernet',
          variant: 'device',
          deviceType: 'networking',
        },
        {
          id: 'endpoint',
          title: 'Endpoint',
          icon: 'laptop',
          variant: 'device',
          deviceType: 'endpoint',
        },
        {
          id: 'disabled-networking',
          title: 'Disabled networking',
          icon: 'ethernet',
          variant: 'device',
          deviceType: 'networking',
          state: 'disabled',
        },
        {
          id: 'disabled-endpoint',
          title: 'Disabled endpoint',
          icon: 'laptop',
          variant: 'device',
          deviceType: 'endpoint',
          state: 'disabled',
        },
        {
          id: 'error-endpoint',
          title: 'Error endpoint',
          icon: 'laptop',
          variant: 'device',
          deviceType: 'endpoint',
          state: 'error',
        },
        {
          id: 'hover-endpoint',
          title: 'Hover endpoint',
          icon: 'laptop',
          variant: 'device',
          deviceType: 'endpoint',
          state: 'hover',
        },
        {
          id: 'active-endpoint',
          title: 'Active endpoint',
          subtitle: '192.168.1.20',
          icon: 'laptop',
          variant: 'device',
          deviceType: 'endpoint',
          state: 'active',
        },
        {
          id: 'focus-endpoint',
          title: 'Focus endpoint',
          icon: 'laptop',
          variant: 'device',
          deviceType: 'endpoint',
          state: 'focus',
        },
      ],
      edges: [],
    };
    const onNodeClick = vi.fn();
    const { container } = renderGraph(graphData, { onNodeClick });
    const node = (id: string) =>
      container.querySelector(`[data-network-node="${id}"]`)!;
    const iconTile = (id: string) =>
      node(id).querySelector('foreignObject span')!;

    expect(iconTile('networking').className).toContain('rounded-[4px]');
    expect(iconTile('endpoint').className).toContain('rounded-[24px]');
    expect(iconTile('disabled-networking').className).toContain(
      'var(--ui-background-status-neutral)'
    );
    expect(iconTile('disabled-networking').className).toContain(
      'rounded-[4px]'
    );
    expect(iconTile('disabled-endpoint').className).toContain('rounded-[24px]');
    expect(node('disabled-endpoint')).toHaveAttribute('aria-disabled', 'true');
    expect(node('disabled-endpoint')).toHaveAttribute('tabindex', '-1');
    expect(iconTile('error-endpoint').className).toContain(
      'var(--ui-background-status-danger)'
    );
    expect(
      node('error-endpoint')
        .querySelector('[data-network-card]')
        ?.getAttribute('style')
    ).toContain('border-color: var(--ui-border-on-status-danger)');
    expect(
      node('hover-endpoint').querySelector('[data-network-card]')?.className
    ).toContain('bg-[var(--ui-background-status-info-hover)]');
    expect(
      node('active-endpoint').querySelector('[data-network-card]')?.className
    ).toContain('bg-[var(--ui-background-status-info-pressed)]');
    expect(
      node('focus-endpoint').querySelector('[data-network-card]')?.className
    ).toContain('ring-[3px]');
    expect(screen.getByText('192.168.1.20').className).toContain(
      'var(--ui-text-on-surface-link-idle)'
    );

    fireEvent.click(
      node('disabled-endpoint').querySelector('[data-network-card]')!
    );
    fireEvent.click(node('endpoint').querySelector('[data-network-card]')!);

    expect(onNodeClick).toHaveBeenCalledTimes(1);
    expect(onNodeClick).toHaveBeenCalledWith(graphData.nodes[1]);
  });

  it('renders Figma device indicators and a Collector offline status beneath the card', () => {
    const graphData: NetworkGraphData = {
      roots: ['switch'],
      nodes: [
        {
          id: 'switch',
          title: 'UbiSwitch_Primary',
          subtitle: '192.168.1.2',
          icon: 'ethernet',
          variant: 'device',
          deviceType: 'networking',
          deviceIndicators: [
            ...Array.from({ length: 19 }, () => 'active' as const),
            ...Array.from({ length: 5 }, () => 'inactive' as const),
          ],
          alerts: [{ label: 'Collector offline', severity: 'danger' }],
        },
      ],
      edges: [],
    };
    const { container } = renderGraph(graphData);
    const node = container.querySelector('[data-network-node="switch"]')!;

    expect(
      node.querySelectorAll('[data-network-device-indicator="active"]')
    ).toHaveLength(19);
    expect(
      node.querySelectorAll('[data-network-device-indicator="inactive"]')
    ).toHaveLength(5);
    expect(
      node.querySelector('[data-network-device-indicator="inactive"]')
    ).toHaveClass('border-[var(--ui-border-on-surface-divider)]');
    expect(
      node.querySelector('[data-network-node-alert="Collector offline"]')
    ).toBeInTheDocument();
    expect(node).toHaveAttribute(
      'aria-label',
      'UbiSwitch_Primary, 192.168.1.2, Collector offline'
    );
    expect(node.querySelector('rect[fill="transparent"]')).toHaveAttribute(
      'height',
      '132'
    );
  });

  it('renders Figma marker status colors and exposes a consumer-supplied summary', () => {
    const data: NetworkGraphData = {
      roots: ['device'],
      nodes: [
        {
          id: 'device',
          title: 'Switch',
          deviceIndicators: [
            { state: 'active', size: 14 },
            'muted',
            'error',
            'inactive',
          ],
          deviceIndicatorsLabel:
            'One active, one offline, one error, one inactive',
        },
      ],
      edges: [],
    };
    const { container } = renderGraph(data);
    expect(
      screen.getByRole('button', {
        name: 'Switch, One active, one offline, one error, one inactive',
      })
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-network-device-indicator="active"]')
    ).toHaveClass('size-[14px]');
    expect(
      container.querySelector('[data-network-device-indicator="error"]')
    ).toHaveClass('bg-[var(--ui-background-status-strong-danger)]');
    expect(
      container.querySelector('[data-network-device-indicator="muted"]')
    ).toHaveClass('bg-[var(--ui-border-on-surface-divider)]');
  });

  it('collapses and expands a branch with its descendants and edges', () => {
    const data: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        { id: 'root', title: 'Root', expandable: true },
        { id: 'branch', title: 'Branch', expandable: true },
        { id: 'leaf', title: 'Leaf' },
        { id: 'other', title: 'Other' },
      ],
      edges: [
        { source: 'root', target: 'branch' },
        { source: 'branch', target: 'leaf' },
        { source: 'root', target: 'other' },
        { source: 'leaf', target: 'root' },
      ],
    };
    const onNodeClick = vi.fn();
    const onCollapsedNodeIdsChange = vi.fn();
    const { container } = renderGraph(data, {
      onNodeClick,
      onCollapsedNodeIdsChange,
    });
    const collapse = screen.getByRole('button', { name: 'Collapse Branch' });
    expect(collapse).toHaveAttribute('aria-expanded', 'true');
    fireEvent.wheel(screen.getByRole('region', { name: 'Network topology' }), {
      deltaY: -10,
      clientX: 150,
      clientY: 100,
    });
    const zoomed = graphTransform(container);

    fireEvent.click(collapse);
    expect(graphTransform(container)).toBe(zoomed);
    expect(onNodeClick).not.toHaveBeenCalled();
    expect(onCollapsedNodeIdsChange).toHaveBeenCalledWith(['branch']);
    expect(
      screen.queryByRole('button', { name: 'Leaf' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Other' })).toBeInTheDocument();
    expect(
      container.querySelector('[data-network-edge="2"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-network-edge="1"]')
    ).not.toBeInTheDocument();
    const expand = screen.getByRole('button', { name: 'Expand Branch' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(expand, { key: 'Enter' });
    expect(screen.getByRole('button', { name: 'Leaf' })).toBeInTheDocument();
    expect(onCollapsedNodeIdsChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps controlled branch state until the consumer updates it', () => {
    const data: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        { id: 'root', title: 'Root', expandable: true },
        { id: 'child', title: 'Child' },
      ],
      edges: [{ source: 'root', target: 'child' }],
    };
    const onCollapsedNodeIdsChange = vi.fn();
    const { rerender } = renderGraph(data, {
      collapsedNodeIds: [],
      onCollapsedNodeIdsChange,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Collapse Root' }));
    expect(onCollapsedNodeIdsChange).toHaveBeenCalledWith(['root']);
    expect(screen.getByRole('button', { name: 'Child' })).toBeInTheDocument();
    rerender(<NetworkGraph graphData={data} collapsedNodeIds={['root']} />);
    expect(
      screen.queryByRole('button', { name: 'Child' })
    ).not.toBeInTheDocument();
  });

  it('shows the Figma group summary only while its branch is collapsed', () => {
    const data: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        { id: 'root', title: 'Root', expandable: true },
        {
          id: 'switch',
          title: 'Switch',
          expandable: true,
          collapsedGroupId: 'summary',
        },
        {
          id: 'summary',
          title: 'Connected',
          subtitle: '2 devices',
          variant: 'group',
          custom: 'summary context',
        },
        { id: 'a', title: 'Device A' },
        { id: 'b', title: 'Device B' },
      ],
      edges: [
        { source: 'root', target: 'switch' },
        { source: 'switch', target: 'summary', custom: 'summary connection' },
        { source: 'switch', target: 'a' },
        { source: 'switch', target: 'b' },
      ],
    };
    const onNodeClick = vi.fn();
    const onEdgeClick = vi.fn();
    const { container, rerender } = renderGraph(data, {
      defaultCollapsedNodeIds: ['switch'],
      onNodeClick,
      onEdgeClick,
    });
    expect(
      screen.getByRole('button', { name: 'Connected, 2 devices' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Device A' })).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Expand Switch' })
    ).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(
      screen.getByRole('button', { name: 'Connected, 2 devices' })
    );
    expect(onNodeClick).toHaveBeenCalledWith(data.nodes[2]);
    fireEvent.click(container.querySelector('[data-network-edge="1"]')!);
    expect(onEdgeClick).toHaveBeenCalledWith(data.edges[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Expand Switch' }));
    expect(
      screen.queryByRole('button', { name: 'Connected, 2 devices' })
    ).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Device A' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Device B' })
    ).toBeInTheDocument();
    rerender(
      <NetworkGraph graphData={data} collapsedNodeIds={['root', 'switch']} />
    );
    expect(
      screen.queryByRole('button', { name: 'Connected, 2 devices' })
    ).toBeNull();
    expect(screen.queryByRole('button', { name: 'Switch' })).toBeNull();
  });

  it('fits newly expanded branches when they would otherwise be clipped', () => {
    const data: NetworkGraphData = {
      roots: ['switch'],
      nodes: [
        {
          id: 'switch',
          title: 'Switch',
          expandable: true,
          collapsedGroupId: 'summary',
        },
        { id: 'summary', title: 'Connected', variant: 'group' },
        ...Array.from({ length: 8 }, (_, index) => ({
          id: `device-${index}`,
          title: `Device ${index}`,
        })),
      ],
      edges: [
        { source: 'switch', target: 'summary' },
        ...Array.from({ length: 8 }, (_, index) => ({
          source: 'switch',
          target: `device-${index}`,
        })),
      ],
    };
    const onZoomChange = vi.fn();
    const { container } = renderGraph(data, {
      width: 400,
      height: 400,
      defaultCollapsedNodeIds: ['switch'],
      onZoomChange,
    });
    const originalScale = onZoomChange.mock.lastCall![0];
    fireEvent.click(screen.getByRole('button', { name: 'Expand Switch' }));
    expect(onZoomChange.mock.lastCall![0]).toBeLessThan(originalScale);
    expect(container.querySelectorAll('[data-network-node]')).toHaveLength(9);
    const fitted = graphTransform(container)!;
    const match = fitted.match(
      /translate\(([-\d.]+)[, ]+([-\d.]+)\) scale\(([-\d.]+)\)/
    );
    expect(match).not.toBeNull();
    const [, x, y, scale] = match!.map(Number);
    const expanded = layoutNetworkGraph(
      data.nodes.filter((node) => node.id !== 'summary'),
      data.edges.filter((edge) => edge.target !== 'summary'),
      data.roots
    );
    expect(x).toBeGreaterThanOrEqual(15.99);
    expect(y).toBeGreaterThanOrEqual(15.99);
    expect(x + expanded.width * scale).toBeLessThanOrEqual(384.01);
    expect(y + expanded.height * scale).toBeLessThanOrEqual(384.01);
  });

  it('allows a consumer to collapse and expand all branches', () => {
    const data: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        { id: 'root', title: 'Root' },
        { id: 'a', title: 'A', expandable: true },
        { id: 'b', title: 'B', expandable: true },
        { id: 'a1', title: 'A child' },
        { id: 'b1', title: 'B child' },
      ],
      edges: [
        { source: 'root', target: 'a' },
        { source: 'root', target: 'b' },
        { source: 'a', target: 'a1' },
        { source: 'b', target: 'b1' },
      ],
    };
    const { rerender } = renderGraph(data, { collapsedNodeIds: ['a', 'b'] });
    expect(screen.queryByRole('button', { name: 'A child' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'B child' })).toBeNull();
    rerender(<NetworkGraph graphData={data} collapsedNodeIds={[]} />);
    expect(screen.getByRole('button', { name: 'A child' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B child' })).toBeInTheDocument();
  });

  it('fits wide topologies inside the viewport with card clearance', () => {
    const graphData: NetworkGraphData = {
      roots: Array.from({ length: 12 }, (_, index) => `device-${index}`),
      nodes: Array.from({ length: 12 }, (_, index) => ({
        id: `device-${index}`,
        title: `Long endpoint name ${index}`,
        subtitle: `192.168.1.${index}`,
        variant: 'device' as const,
      })),
      edges: [],
    };
    const layout = layoutNetworkGraph(
      graphData.nodes,
      graphData.edges,
      graphData.roots
    );
    const { container } = renderGraph(graphData, { width: 960, height: 300 });
    const match = graphTransform(container)?.match(
      /translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/
    );
    expect(match).not.toBeNull();
    const [, translateX, translateY, scaleValue] = match!;
    const scale = Number(scaleValue);
    const x = Number(translateX);
    const y = Number(translateY);

    for (const node of graphData.nodes) {
      const position = layout.positions.get(node.id)!;
      const size = layout.nodeSizes.get(node.id)!;
      const left = x + (position.x - size.width / 2) * scale;
      const right = x + (position.x + size.width / 2) * scale;
      const top = y + (position.y - size.height / 2) * scale;
      const bottom = y + (position.y + size.height / 2) * scale;
      expect(left).toBeGreaterThanOrEqual(15);
      expect(right).toBeLessThanOrEqual(945);
      expect(top).toBeGreaterThanOrEqual(15);
      expect(bottom).toBeLessThanOrEqual(285);
    }
    expect(
      container.querySelector('[data-network-card="device-0"]')
    ).toHaveClass('overflow-hidden');
  });

  it('uses custom node text when provided', () => {
    const { container } = renderGraph(baseData, {
      renderNodeText: (node) => <strong>Custom {node.title}</strong>,
    });
    const customText = screen.getByText('Custom Office subnet');
    const customTextContainer = customText.parentElement;

    expect(customText).toBeInTheDocument();
    expect(customTextContainer).toHaveClass('min-w-0', 'overflow-hidden');
    expect(
      container.querySelector('[data-network-node="branch"]')
    ).toBeTruthy();
    expect(screen.queryByText('10.0.0.0/24')).not.toBeInTheDocument();
  });

  it('passes complete node and edge metadata to click callbacks', () => {
    const onNodeClick = vi.fn();
    const onEdgeClick = vi.fn();
    const { container } = renderGraph(baseData, { onNodeClick, onEdgeClick });

    const root = screen.getByRole('button', { name: 'Root network' });
    expect(root.querySelector('foreignObject')).toHaveAttribute(
      'pointer-events',
      'none'
    );
    const rootHitArea = root.querySelector('rect[fill="transparent"]')!;
    expect(rootHitArea).toHaveAttribute('pointer-events', 'all');
    const viewport = screen.getByRole('region', { name: 'Network topology' });
    fireEvent.pointerDown(rootHitArea, {
      button: 0,
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(viewport, {
      pointerId: 1,
      clientX: 140,
      clientY: 130,
    });
    fireEvent.pointerUp(viewport, {
      pointerId: 1,
      clientX: 140,
      clientY: 130,
    });
    fireEvent.click(rootHitArea);
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Root network to Office subnet, 10.0.0.0/24',
      })
    );

    expect(onNodeClick).toHaveBeenCalledWith(baseData.nodes[0]);
    expect(onNodeClick).toHaveBeenCalledTimes(1);
    expect(onEdgeClick).toHaveBeenCalledWith(baseData.edges[0]);
    expect(
      container.querySelector('[data-network-node="root"]')
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard node activation', () => {
    const onNodeClick = vi.fn();
    renderGraph(baseData, { onNodeClick });
    const node = screen.getByRole('button', { name: 'Server, SRV-01, Online' });

    fireEvent.keyDown(node, { key: 'Enter' });

    expect(onNodeClick).toHaveBeenCalledWith(baseData.nodes[2]);
  });

  it('highlights selected nodes, shortest paths, and their edges', () => {
    const { container, rerender } = renderGraph(baseData, {
      selectedNodeIds: ['isolated'],
      selectedNodePairs: [{ from: 'root', to: 'server' }],
    });

    const node = (id: string) =>
      container.querySelector(`[data-network-node="${id}"]`);
    const visualEdges = [
      ...container.querySelectorAll('svg g > path:not([data-network-edge])'),
    ];
    expect(
      node('isolated')
        ?.querySelector('[data-network-card]')
        ?.getAttribute('style')
    ).toContain('border-width: 1px');
    expect(
      node('isolated')
        ?.querySelector('[data-network-card]')
        ?.getAttribute('style')
    ).toContain('border-color: var(--ui-border-on-surface-border-active)');
    expect(
      node('root')?.querySelector('[data-network-card]')?.getAttribute('style')
    ).toContain('border-width: 1px');
    expect(
      node('root')?.querySelector('[data-network-card]')?.getAttribute('style')
    ).toContain('border-color: var(--ui-border-on-surface-border-active)');
    expect(visualEdges[0]).toHaveAttribute(
      'stroke',
      'var(--ui-border-on-surface-divider)'
    );
    expect(visualEdges[3]).toHaveAttribute(
      'stroke',
      'var(--ui-background-status-strong-info)'
    );

    rerender(
      <NetworkGraph
        graphData={baseData}
        ariaLabel="Network topology"
        selectedNodeIds={[]}
        selectedNodePairs={[]}
      />
    );
    expect(
      node('root')?.querySelector('[data-network-card]')?.getAttribute('style')
    ).toContain('border-color: var(--ui-border-on-surface-divider)');
  });

  it('renders semantic edge categories and dotted styling while preserving metadata', () => {
    const { container } = renderGraph(baseData);
    const dottedEdge = container.querySelector('[data-network-edge="2"]');
    const visibleLine = container.querySelector('svg g > path');

    expect(dottedEdge).toHaveAttribute(
      'aria-label',
      'Office subnet, 10.0.0.0/24 to Client, LT-04'
    );
    expect(visibleLine?.getAttribute('stroke-dasharray')).toBeNull();
    expect(
      container.querySelector('path[stroke-dasharray="2 6"]')
    ).toBeInTheDocument();
  });

  it('rounds the outer branch corners using the Figma connection treatment', () => {
    const data: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        { id: 'root' },
        { id: 'left' },
        { id: 'middle' },
        { id: 'right' },
      ],
      edges: [
        { source: 'root', target: 'left' },
        { source: 'root', target: 'middle' },
        { source: 'root', target: 'right' },
      ],
    };
    const { container } = renderGraph(data);
    expect(
      container.querySelector('[data-network-edge="0"]')?.getAttribute('d')
    ).toContain(' Q ');
    expect(
      container.querySelector('[data-network-edge="1"]')?.getAttribute('d')
    ).not.toContain(' Q ');
    expect(
      container.querySelector('[data-network-edge="2"]')?.getAttribute('d')
    ).toContain(' Q ');
  });

  it('renders cycles, cross-edges, self-edges, and skips only invalid endpoints', () => {
    const graphData: NetworkGraphData = {
      roots: ['a'],
      nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
      edges: [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
        { source: 'c', target: 'a' },
        { source: 'a', target: 'c' },
        { source: 'c', target: 'c' },
        { source: 'missing', target: 'a' },
      ],
    };
    const { container } = renderGraph(graphData);

    expect(container.querySelectorAll('[data-network-edge]')).toHaveLength(5);
    expect(
      container.querySelector('[data-network-edge="4"]')?.getAttribute('d')
    ).toContain(' C ');
  });

  it('does not pan or show a grab cursor by default', () => {
    const { container } = renderGraph();
    const region = screen.getByRole('region', { name: 'Network topology' });
    const before = graphTransform(container);

    fireEvent.pointerDown(region, {
      button: 0,
      pointerId: 1,
      clientX: 20,
      clientY: 20,
    });
    fireEvent.pointerMove(region, {
      pointerId: 1,
      clientX: 80,
      clientY: 40,
    });
    fireEvent.pointerUp(region, { pointerId: 1, clientX: 80, clientY: 40 });

    expect(graphTransform(container)).toBe(before);
    expect(region.className).not.toContain('cursor-grab');
  });

  it('pans the canvas without selecting a node when explicitly enabled', () => {
    const onNodeClick = vi.fn();
    const { container } = renderGraph(baseData, {
      graphDraggable: true,
      onNodeClick,
    });
    const region = screen.getByRole('region', { name: 'Network topology' });
    const before = graphTransform(container);

    fireEvent.pointerDown(region, {
      button: 0,
      pointerId: 1,
      clientX: 20,
      clientY: 20,
    });
    fireEvent.pointerMove(region, {
      pointerId: 1,
      clientX: 80,
      clientY: 40,
    });
    fireEvent.pointerUp(region, { pointerId: 1, clientX: 80, clientY: 40 });

    expect(graphTransform(container)).not.toBe(before);
    expect(onNodeClick).not.toHaveBeenCalled();
  });

  it('supports zoom buttons and clamps zoom to the configured bounds', () => {
    const { container } = renderGraph();
    const zoomIn = screen.getByRole('button', { name: 'Zoom in' });
    const zoomOut = screen.getByRole('button', { name: 'Zoom out' });

    for (let i = 0; i < 20; i += 1) fireEvent.click(zoomIn);
    expect(graphTransform(container)).toContain('scale(4)');
    for (let i = 0; i < 80; i += 1) fireEvent.click(zoomOut);
    expect(graphTransform(container)).toContain('scale(0.001)');
  });

  it('exposes zoom and fit to consumer controls and reports the current scale', () => {
    const controls = React.createRef<NetworkGraphViewportHandle>();
    const dom = React.createRef<HTMLDivElement>();
    const onZoomChange = vi.fn();
    const { container } = renderGraph(baseData, {
      viewportRef: controls,
      ref: dom,
      onZoomChange,
      showZoomControls: false,
    });
    const fitted = graphTransform(container);
    expect(dom.current).toHaveAttribute('data-slot', 'network-graph');
    expect(screen.queryByRole('button', { name: 'Zoom in' })).toBeNull();
    act(() => controls.current!.setZoom(2));
    expect(graphTransform(container)).toContain('scale(2)');
    expect(onZoomChange).toHaveBeenLastCalledWith(2);
    act(() => controls.current!.zoomOut());
    expect(onZoomChange.mock.lastCall![0]).toBeLessThan(2);
    act(() => controls.current!.zoomIn());
    expect(onZoomChange.mock.lastCall![0]).toBeCloseTo(2);
    act(() => controls.current!.setZoom(Number.NaN));
    expect(onZoomChange.mock.lastCall![0]).toBeCloseTo(2);
    act(() => controls.current!.fit());
    expect(graphTransform(container)).toBe(fitted);
  });

  it('zooms with the mouse wheel and preserves the view for selection-only changes', () => {
    const { container, rerender } = renderGraph(baseData);
    const region = screen.getByRole('region', { name: 'Network topology' });
    const before = graphTransform(container);

    fireEvent.wheel(region, {
      deltaY: -100,
      clientX: 300,
      clientY: 240,
    });
    const zoomed = graphTransform(container);
    expect(zoomed).not.toBe(before);

    rerender(
      <NetworkGraph
        graphData={baseData}
        ariaLabel="Network topology"
        selectedNodeIds={['server']}
      />
    );
    expect(graphTransform(container)).toBe(zoomed);
  });

  it('moves nodes only when nodeDraggable is enabled', () => {
    const { container, rerender } = renderGraph(baseData, {
      graphDraggable: false,
    });
    const root = container.querySelector('[data-network-node="root"]')!;
    const rootCard = root.querySelector('foreignObject');
    const originalX = rootCard?.getAttribute('x');
    const originalTransform = graphTransform(container);

    fireEvent.pointerDown(root, {
      button: 0,
      pointerId: 4,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(root, {
      pointerId: 4,
      clientX: 140,
      clientY: 130,
    });
    fireEvent.pointerUp(root, { pointerId: 4, clientX: 140, clientY: 130 });

    expect(rootCard?.getAttribute('x')).toBe(originalX);
    expect(graphTransform(container)).toBe(originalTransform);

    rerender(
      <NetworkGraph
        graphData={baseData}
        ariaLabel="Network topology"
        graphDraggable={false}
        nodeDraggable
      />
    );
    const draggableRoot = container.querySelector(
      '[data-network-node="root"]'
    )!;
    const draggableCard = draggableRoot.querySelector('foreignObject');
    const beforeX = Number(draggableCard?.getAttribute('x'));
    fireEvent.pointerDown(draggableRoot, {
      button: 0,
      pointerId: 5,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(draggableRoot, {
      pointerId: 5,
      clientX: 140,
      clientY: 130,
    });
    fireEvent.pointerUp(draggableRoot, {
      pointerId: 5,
      clientX: 140,
      clientY: 130,
    });

    expect(Number(draggableCard?.getAttribute('x'))).toBeGreaterThan(beforeX);
  });

  it('fits moved nodes without discarding their new positions', () => {
    const controls = React.createRef<NetworkGraphViewportHandle>();
    const onZoomChange = vi.fn();
    const { container } = renderGraph(baseData, {
      nodeDraggable: true,
      viewportRef: controls,
      onZoomChange,
    });
    const root = container.querySelector('[data-network-node="root"]')!;
    const card = root.querySelector('foreignObject')!;
    const initialScale = onZoomChange.mock.lastCall![0];
    fireEvent.pointerDown(root, {
      button: 0,
      pointerId: 8,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(root, { pointerId: 8, clientX: 2100, clientY: 100 });
    fireEvent.pointerUp(root, { pointerId: 8, clientX: 2100, clientY: 100 });
    const movedX = card.getAttribute('x');
    act(() => controls.current!.fit());
    expect(onZoomChange.mock.lastCall![0]).toBeLessThan(initialScale);
    expect(card.getAttribute('x')).toBe(movedX);
  });

  it('preserves view, moved positions, and uncontrolled selection for equivalent new data', () => {
    const controls = React.createRef<NetworkGraphViewportHandle>();
    const { container, rerender } = renderGraph(baseData, {
      nodeDraggable: true,
      viewportRef: controls,
    });
    const root = container.querySelector('[data-network-node="root"]')!;
    fireEvent.pointerDown(root, {
      button: 0,
      pointerId: 11,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(root, { pointerId: 11, clientX: 180, clientY: 120 });
    fireEvent.pointerUp(root, { pointerId: 11, clientX: 180, clientY: 120 });
    fireEvent.keyDown(root, { key: 'Enter' });
    act(() => controls.current!.setZoom(1.5));
    const position = root.querySelector('foreignObject')!.getAttribute('x');
    const transform = graphTransform(container);
    expect(root).toHaveAttribute('aria-pressed', 'true');

    const equivalent = {
      roots: [...baseData.roots],
      nodes: baseData.nodes.map((node) => ({ ...node })),
      edges: baseData.edges.map((edge) => ({ ...edge })),
    };
    rerender(
      <NetworkGraph
        graphData={equivalent}
        nodeDraggable
        viewportRef={controls}
      />
    );
    expect(root.querySelector('foreignObject')).toHaveAttribute('x', position);
    expect(root).toHaveAttribute('aria-pressed', 'true');
    expect(graphTransform(container)).toBe(transform);

    rerender(
      <NetworkGraph
        graphData={{
          ...equivalent,
          nodes: [...equivalent.nodes, { id: 'new' }],
        }}
        nodeDraggable
        viewportRef={controls}
      />
    );
    expect(root).toHaveAttribute('aria-pressed', 'false');
    expect(graphTransform(container)).not.toBe(transform);
  });

  it.each(['unknown', 'constructor', '__proto__', 'toString'])(
    'safely ignores unknown icon %s',
    (icon) => {
      const { container } = renderGraph({
        roots: ['root'],
        nodes: [{ id: 'root', title: 'Root', icon }],
        edges: [],
      });
      expect(screen.getByRole('button', { name: 'Root' })).toBeInTheDocument();
      expect(
        container.querySelector('[data-network-node] foreignObject svg')
      ).toBeNull();
    }
  );

  it('keeps circular content inside its footprint and reserves room for all three card lines', () => {
    const data: NetworkGraphData = {
      roots: ['circle', 'device'],
      nodes: [
        {
          id: 'circle',
          title: 'Circle',
          subtitle: 'Address',
          caption: 'Online',
          icon: 'router',
          shape: 'circle',
        },
        {
          id: 'device',
          title: 'Device',
          subtitle: 'Address',
          caption: 'Online',
          icon: 'router',
        },
      ],
      edges: [],
    };
    const { container } = renderGraph(data);
    const circleNode = container.querySelector('[data-network-node="circle"]')!;
    const circle = circleNode.querySelector('circle')!;
    const content = circleNode.querySelector('foreignObject')!;
    const radius = Number(circle.getAttribute('r'));
    expect(Number(content.getAttribute('width'))).toBeLessThanOrEqual(
      radius * 2
    );
    expect(Number(content.getAttribute('height'))).toBeLessThanOrEqual(
      radius * 2
    );
    expect(content.firstElementChild).toHaveStyle({
      clipPath: 'circle(50% at center)',
    });
    const device = container.querySelector(
      '[data-network-node="device"] foreignObject'
    )!;
    expect(Number(device.getAttribute('height'))).toBeGreaterThanOrEqual(74);
    expect(
      layoutNetworkGraph(data.nodes, data.edges, data.roots).nodeSizes.get(
        'device'
      )!.height
    ).toBeGreaterThanOrEqual(74);
  });

  it('keeps a single-child edge attached when either endpoint moves horizontally', () => {
    const data: NetworkGraphData = {
      roots: ['parent'],
      nodes: [{ id: 'parent' }, { id: 'child' }],
      edges: [{ source: 'parent', target: 'child' }],
    };
    const { container } = renderGraph(data, { nodeDraggable: true });
    const path = container.querySelector('[data-network-edge="0"]')!;
    for (const [index, id] of ['child', 'parent'].entries()) {
      const node = container.querySelector(`[data-network-node="${id}"]`)!;
      fireEvent.pointerDown(node, {
        button: 0,
        pointerId: 20 + index,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(node, {
        pointerId: 20 + index,
        clientX: 60,
        clientY: 0,
      });
      fireEvent.pointerUp(node, {
        pointerId: 20 + index,
        clientX: 60,
        clientY: 0,
      });
      const source = container.querySelector(
        '[data-network-node="parent"] foreignObject'
      )!;
      const target = container.querySelector(
        '[data-network-node="child"] foreignObject'
      )!;
      const sourceX =
        Number(source.getAttribute('x')) +
        Number(source.getAttribute('width')) / 2;
      const targetX =
        Number(target.getAttribute('x')) +
        Number(target.getAttribute('width')) / 2;
      expect(path.getAttribute('d')).toMatch(new RegExp(`^M ${sourceX} `));
      if (sourceX !== targetX)
        expect(path.getAttribute('d')).toMatch(
          new RegExp(`(?:H ${targetX} V|Q ${targetX} [-\\d.]+ ${targetX} )`)
        );
      else expect(path.getAttribute('d')).not.toContain(' H ');
    }
  });

  it('activates nodes and edges by keyboard after panning while suppressing the drag click', () => {
    const onNodeClick = vi.fn();
    const onEdgeClick = vi.fn();
    const { container } = renderGraph(baseData, {
      graphDraggable: true,
      onNodeClick,
      onEdgeClick,
    });
    const region = screen.getByRole('region', { name: 'Network topology' });
    const node = container.querySelector('[data-network-node="root"]')!;
    const edge = container.querySelector('[data-network-edge="0"]')!;
    const pan = (id: number) => {
      fireEvent.pointerDown(region, {
        button: 0,
        pointerId: id,
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerMove(region, { pointerId: id, clientX: 30, clientY: 0 });
      fireEvent.pointerUp(region, { pointerId: id, clientX: 30, clientY: 0 });
    };
    pan(30);
    fireEvent.keyDown(node, { key: 'Enter' });
    expect(onNodeClick).toHaveBeenCalledTimes(1);
    pan(31);
    fireEvent.keyDown(edge, { key: ' ' });
    expect(onEdgeClick).toHaveBeenCalledTimes(1);
    pan(32);
    fireEvent.click(node);
    expect(onNodeClick).toHaveBeenCalledTimes(1);
  });

  it('allows edge labels to be localized using complete endpoint data', () => {
    const getEdgeLabel = vi.fn(
      (edge, source, target) =>
        `${source.title} hacia ${target.title}: ${edge.type}`
    );
    renderGraph(baseData, { getEdgeLabel });
    expect(
      screen.getByRole('button', {
        name: 'Root network hacia Office subnet: layer1',
      })
    ).toBeInTheDocument();
    expect(getEdgeLabel).toHaveBeenCalledWith(
      baseData.edges[0],
      baseData.nodes[0],
      baseData.nodes[1]
    );
  });

  it('uses logical text alignment and preserves disabled and error colors when selected', () => {
    const data: NetworkGraphData = {
      roots: ['disabled', 'error'],
      nodes: [
        {
          id: 'disabled',
          title: 'Disabled',
          subtitle: 'Address',
          state: 'disabled',
        },
        { id: 'error', title: 'Error', subtitle: 'Address', state: 'error' },
      ],
      edges: [],
    };
    const { container } = renderGraph(data, {
      selectedNodeIds: ['disabled', 'error'],
      dir: 'rtl',
    });
    const disabled = container.querySelector('[data-network-node="disabled"]')!;
    const error = container.querySelector('[data-network-node="error"]')!;
    expect(
      disabled.querySelector('[data-network-card]')!.getAttribute('style')
    ).toContain('border-color: var(--ui-border-on-status-neutral)');
    expect(
      error.querySelector('[data-network-card]')!.getAttribute('style')
    ).toContain('border-color: var(--ui-border-on-status-danger)');
    expect(disabled.querySelector('.text-start')).toBeInTheDocument();
    expect(error.querySelector('.text-start')).toBeInTheDocument();
    expect(
      error.querySelector('.text-start')!.firstElementChild!.className
    ).toContain('text-[var(--ui-text-on-surface-destructive)]');
  });

  it('fits dragged positions when a branch expands', () => {
    const data: NetworkGraphData = {
      roots: ['root'],
      nodes: [
        { id: 'root', title: 'Root', expandable: true },
        { id: 'child', title: 'Child' },
      ],
      edges: [{ source: 'root', target: 'child' }],
    };
    const { container } = renderGraph(data, {
      width: 400,
      height: 400,
      nodeDraggable: true,
      defaultCollapsedNodeIds: ['root'],
    });
    const root = container.querySelector('[data-network-node="root"]')!;
    fireEvent.pointerDown(root, {
      button: 0,
      pointerId: 40,
      clientX: 0,
      clientY: 0,
    });
    fireEvent.pointerMove(root, { pointerId: 40, clientX: 1000, clientY: 0 });
    fireEvent.pointerUp(root, { pointerId: 40, clientX: 1000, clientY: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Expand Root' }));
    const match = graphTransform(container)!.match(
      /translate\(([-\d.]+)[, ]+([-\d.]+)\) scale\(([-\d.]+)\)/
    )!;
    const [, x, y, scale] = match.map(Number);
    for (const card of container.querySelectorAll(
      '[data-network-node] > foreignObject'
    )) {
      const left = Number(card.getAttribute('x'));
      const top = Number(card.getAttribute('y'));
      expect(x + left * scale).toBeGreaterThanOrEqual(15.99);
      expect(y + top * scale).toBeGreaterThanOrEqual(15.99);
      expect(
        x + (left + Number(card.getAttribute('width'))) * scale
      ).toBeLessThanOrEqual(384.01);
      expect(
        y + (top + Number(card.getAttribute('height'))) * scale
      ).toBeLessThanOrEqual(384.01);
    }
  });
});
