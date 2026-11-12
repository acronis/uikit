import { describe, expect, it } from 'vitest';

import { loadSpec } from '../lib/load';
import { buildStories, getRenderHint } from '../scripts/generate-stories';
import type { AnatomySpec } from '../types';

describe('generated StepperItem stories', () => {
  it('uses the current avatar styling in pseudo-state fallback stories', () => {
    const { index, api, anatomy } = loadSpec('stepper-item');
    const anatomyWithPseudoState: AnatomySpec = {
      ...anatomy,
      states: [
        ...(anatomy.states ?? []),
        {
          id: 'synthetic-hover',
          trigger: 'the component is hovered',
          kind: 'pseudo',
          pseudo: ':hover',
        },
      ],
    };

    const { body } = buildStories(
      index.component,
      api,
      anatomyWithPseudoState,
      getRenderHint('stepper-item')
    );

    expect(body).toContain(
      'render: () => <StepperItem label="Step name" avatar={<Avatar color="blue" className="[box-shadow:none] text-[var(--ui-stepper-item-current-label-color)]"><AvatarFallback>1</AvatarFallback></Avatar>} />'
    );
  });
});
