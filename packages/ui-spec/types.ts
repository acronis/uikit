/** TypeScript shapes for the four YAML files of a component spec. */

export type ComponentStatus = 'draft' | 'ready' | 'stable' | 'deprecated';

export interface IndexSpec {
  spec_version: string;
  component: string;
  name: string;
  /** ui-react component dir (under src/components/ui), when it differs from `name`. */
  sourceDir?: string;
  status: ComponentStatus;
  category: string;
  description: string;
  since?: string;
  dependencies?: { components?: string[] };
  figma?: { node?: string; codeConnect?: string };
}

export interface AnatomyPart {
  id: string;
  description: string;
  element?: string;
  optional?: boolean;
  visible_when?: string;
}

export type StateKind = 'prop' | 'pseudo' | 'internal';

export interface AnatomyState {
  id: string;
  trigger: string;
  /** How the state is reached. */
  kind: StateKind;
  /** CSS pseudo-class, for kind=pseudo (e.g. ':hover'). */
  pseudo?: string;
  /** For kind=prop: the api.yaml property that drives this state. */
  prop?: string;
  affects?: string[];
  exclusive_with?: string[];
}

/** Component-owned state that changes via interaction and affects visuals. */
export interface InternalState {
  id: string;
  type: string;
  initial?: unknown;
  /** Allowed values for enumerated state (omit for free/boolean). */
  values?: unknown[];
  /** api.yaml props that read/override this state. */
  controllable_via?: string[];
  /** api.yaml prop that seeds the value when uncontrolled. */
  controlled_default?: string;
  /** api.yaml event fired when the value changes. */
  emits?: string;
  changed_by?: string;
  description: string;
}

/** A state-machine edge: an interaction moving internal state between values. */
export interface Transition {
  id: string;
  /** internal_state id this transition mutates. */
  state: string;
  from?: unknown;
  on: string;
  to: unknown;
  guard?: string;
  effect?: string;
  when_controlled?: string;
  /** Reachable by a user gesture (drives play-story generation). */
  interactive?: boolean;
}

export interface AnatomySpec {
  spec_version: string;
  component: string;
  schematic?: string;
  root: { element: string; role?: string; description?: string };
  parts: AnatomyPart[];
  internal_state?: InternalState[];
  transitions?: Transition[];
  layout?: {
    type?: string;
    direction?: string;
    align?: string;
    order?: string[];
  };
  states?: AnatomyState[];
}

export interface ApiProperty {
  name: string;
  type: string;
  required?: boolean;
  default?: unknown;
  description: string;
}

export interface ApiAdapter {
  component?: string;
  element?: string;
  import?: string;
  example?: string;
  status?: 'implemented' | 'planned';
}

export interface ApiSpec {
  spec_version: string;
  component: string;
  contract: {
    properties: ApiProperty[];
    events?: { name: string; payload?: string; description: string }[];
    content?: { name: string; description: string }[];
    methods?: { name: string; signature?: string; description: string }[];
  };
  adapters: {
    react: ApiAdapter;
    vue?: ApiAdapter;
    'web-components'?: ApiAdapter;
  };
}

export interface TokensSpec {
  spec_version: string;
  component: string;
  source: string;
  tokens: { name: string; affects?: string; description?: string }[];
}

export interface ComponentSpec {
  index: IndexSpec;
  anatomy: AnatomySpec;
  api: ApiSpec;
  tokens: TokensSpec;
}
