// Figma Code Connect — status: COMPLETE
// Node 7987:25477 ("Timer"). A single component, not a component set: it has
// no variant axis, only a `value` TEXT property and the nested ButtonGroup's
// `ListItem` slot.
//
// The nested `ButtonGroup` instance is not mapped as a prop — the Timer renders
// it itself (`variant="inlined"`, as the design instantiates it). What varies
// is only its contents, so `figma.children('ButtonGroup')` would hand back the
// whole group; instead the example shows the three actions the design ships, as
// the `ButtonGroupItem` children the component actually takes.
import figma from '@figma/code-connect';
import {
  CirclePauseIcon,
  PencilIcon,
  PlusIcon,
} from '@acronis-platform/icons-react/stroke-mono';

// A relative specifier, not the `@/` alias: the Code Connect CLI resolves
// imports itself and cannot follow the tsconfig path mapping.
import { ButtonGroupItem } from '../button-group';
import { Timer } from './timer';

figma.connect(
  Timer,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=7987-25477',
  {
    props: {
      value: figma.string('value'),
    },
    example: ({ value }) => (
      <Timer value={value}>
        <ButtonGroupItem aria-label="Pause">
          <CirclePauseIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Rename">
          <PencilIcon size={16} />
        </ButtonGroupItem>
        <ButtonGroupItem aria-label="Add entry">
          <PlusIcon size={16} />
        </ButtonGroupItem>
      </Timer>
    ),
  }
);
