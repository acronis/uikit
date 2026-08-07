// Figma Code Connect — status: COMPLETE
// Two component sets back one React component: `TimelineItem` (8077:20862) is
// `variant="default"`, `TimelineItemTree` (8192:7465) is `variant="tree"` with a
// disclosure button. Both expose the same `Nesting` variant, which maps onto the
// orthogonal pair `level` (depth) + `branchStart` (Figma's `-First`, the elbow
// joining a row to its parent's connector). The maps are inlined per `connect`
// because Code Connect parses these files statically — a shared const or an
// `as const` assertion makes `figma.enum` unreadable to the parser.
import { CircleInfoIcon } from '@acronis-platform/icons-react/stroke-mono';
import figma from '@figma/code-connect';

import { Tag } from '../tag';
import { Timeline } from './timeline';

figma.connect(
  Timeline,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8077-20862',
  {
    props: {
      level: figma.enum('Nesting', {
        L1: 1,
        'L2-First': 2,
        L2: 2,
        'L3-First': 3,
        L3: 3,
      }),
      branchStart: figma.enum('Nesting', {
        'L2-First': true,
        'L3-First': true,
      }),
      connector: figma.boolean('Connecting line'),
    },
    example: ({ level, branchStart, connector }) => (
      <Timeline>
        <Timeline.Item
          level={level}
          branchStart={branchStart}
          connector={connector}
          icon={<CircleInfoIcon />}
          title="Title"
          tag={<Tag variant="warning">Tag</Tag>}
          timestamp="Dec 22, 08:30 AM"
          description="Description"
        />
      </Timeline>
    ),
  }
);

figma.connect(
  Timeline,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=8192-7465',
  {
    props: {
      level: figma.enum('Nesting', {
        L1: 1,
        'L2-First': 2,
        L2: 2,
        'L3-First': 3,
        L3: 3,
      }),
      branchStart: figma.enum('Nesting', {
        'L2-First': true,
        'L3-First': true,
      }),
      connector: figma.boolean('Connecting line'),
    },
    example: ({ level, branchStart, connector }) => (
      <Timeline variant="tree">
        <Timeline.Item
          level={level}
          branchStart={branchStart}
          connector={connector}
          collapsible
          defaultExpanded
          icon={<CircleInfoIcon />}
          title="Title"
          tag={<Tag variant="warning">Tag</Tag>}
          timestamp="Dec 22, 08:30 AM"
          description="Description"
        />
      </Timeline>
    ),
  }
);
