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

describe('partDisabled render hint', () => {
  it('keeps disabled stories for components with a root disabled prop', () => {
    const { api, anatomy } = loadSpec('button');
    const { body } = buildStories('Button', api, anatomy, getRenderHint('button'));

    expect(body).toContain('export const Disabled: Story =');
    expect(body).toContain('variant={v} disabled');
  });

  it('omits the root disabled prop from variant and size stories', () => {
    const { api, anatomy } = loadSpec('button');
    const apiWithSize = {
      ...api,
      contract: {
        ...api.contract,
        properties: [
          ...api.contract.properties,
          {
            name: 'size',
            type: "'small' | 'large'",
            required: false,
            description: 'Synthetic size axis for generator coverage.',
          },
        ],
      },
    };

    const { body } = buildStories('Button', apiWithSize, anatomy, {
      ...getRenderHint('button'),
      partDisabled: true,
    });

    expect(body).not.toMatch(/\sdisabled(?:\s|\/?>)/);
  });

  it('omits the root disabled prop from variant-only stories', () => {
    const { api, anatomy } = loadSpec('button');
    const { body } = buildStories('Button', api, anatomy, {
      ...getRenderHint('button'),
      partDisabled: true,
    });

    expect(body).not.toMatch(/\sdisabled(?:\s|\/?>)/);
  });

  it('omits root disabled instances from checked-state stories', () => {
    const { api, anatomy } = loadSpec('switch');
    const { body } = buildStories('Switch', api, anatomy, {
      ...getRenderHint('switch'),
      partDisabled: true,
    });

    expect(body).not.toMatch(/\sdisabled(?:\s|\/?>)/);
  });

  it('omits the root disabled prop from single-instance states', () => {
    const { api, anatomy } = loadSpec('tabs');
    const { body } = buildStories('Tabs', api, anatomy, {
      ...getRenderHint('tabs'),
      partDisabled: true,
    });

    expect(body).not.toMatch(/\sdisabled(?:\s|\/?>)/);
  });
});
