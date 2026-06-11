// Shapes exchanged between the Figma plugin (plugin/code.js) and the Node
// converter/receiver. The plugin emits the raw payload; the converter turns it
// into the DTCG snapshot the design-tokens emitters consume.

export interface FigmaRgba {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaVariableAlias {
  type: 'VARIABLE_ALIAS';
  id: string;
}

export type FigmaVariableValue = number | string | boolean | FigmaRgba | FigmaVariableAlias;

export type FigmaResolvedType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

export interface RawVariable {
  id: string;
  name: string;
  resolvedType: FigmaResolvedType;
  valuesByMode: Record<string, FigmaVariableValue>;
  variableCollectionId: string;
  scopes?: string[];
  description?: string;
  hiddenFromPublishing?: boolean;
}

export interface RawMode {
  modeId: string;
  name: string;
}

export interface RawCollection {
  id: string;
  name: string;
  modes: RawMode[];
  defaultModeId: string;
  variableIds: string[];
}

export interface RawTextStyle {
  id: string;
  name: string;
  fontName?: { family: string; style: string };
  fontSize?: number;
  lineHeight?: { value?: number; unit: string };
  letterSpacing?: { value: number; unit: string };
  textCase?: string;
  textDecoration?: string;
}

export interface RawStyle {
  id: string;
  name: string;
  paints?: unknown[];
  effects?: unknown[];
}

export interface ExportPayload {
  exporter: 'acronis-figma-token-exporter';
  pluginVersion: string;
  fileKey: string | null;
  fileName: string;
  exportedAt: number;
  variables: RawVariable[];
  collections: RawCollection[];
  orphanVariables: RawVariable[];
  textStyles: RawTextStyle[];
  paintStyles: RawStyle[];
  effectStyles: RawStyle[];
}

// Internal token model (mirrors figma-console-mcp's TokenDocument, trimmed).
export type TokenType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'fontWeight'
  | 'fontFamily'
  | 'duration'
  | 'string'
  | 'boolean';

export interface TokenValue {
  reference?: string;
  literal?: string | number | boolean;
}

export interface Token {
  path: string[];
  type: TokenType;
  description?: string;
  values: Record<string, TokenValue>;
  extensions?: Record<string, unknown>;
}

export interface TokenSet {
  name: string;
  modes: string[];
  tokens: Token[];
  meta?: { figmaCollectionId?: string };
}

export interface TokenDocument {
  sets: TokenSet[];
  meta?: { figmaFileKey?: string | null; exportedAt?: string };
}

// The meta sidecar the emitters read: { [variableId]: { name, scopes, hidden } }.
export interface VariableMetaEntry {
  name: string;
  scopes: string[];
  hidden: boolean;
}
