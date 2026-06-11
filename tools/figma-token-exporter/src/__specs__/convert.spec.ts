import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, it, expect } from 'vitest';
import { buildDtcgTree, convertPayloadToDocument } from '../convert.js';
import { writeSnapshot } from '../write-snapshot.js';
import type { ExportPayload } from '../types.js';

// A minimal payload exercising every shape the design-tokens emitters read:
// a multi-mode palette literal (theme), a semantic alias (brand), a component
// alias + component literal, and an alias to a non-local "orphan" target.
const payload: ExportPayload = {
  exporter: 'acronis-figma-token-exporter',
  pluginVersion: '0.1.0',
  fileKey: 'FILEKEY',
  fileName: 'Test File',
  exportedAt: 0,
  collections: [
    {
      id: 'col-theme',
      name: 'Theme',
      defaultModeId: 'm-light',
      modes: [
        { modeId: 'm-light', name: 'Light' },
        { modeId: 'm-dark', name: 'Dark' },
      ],
      variableIds: ['v-base', 'v-blue3'],
    },
    {
      id: 'col-brand',
      name: 'Brand',
      defaultModeId: 'm-acr',
      modes: [
        { modeId: 'm-acr', name: 'Acronis' },
        { modeId: 'm-bb', name: 'Brand B' },
      ],
      variableIds: ['v-sem', 'v-chev', 'v-bga', 'v-orphref'],
    },
  ],
  variables: [
    {
      id: 'v-base',
      name: 'Base',
      resolvedType: 'COLOR',
      variableCollectionId: 'col-theme',
      scopes: ['ALL_SCOPES'],
      hiddenFromPublishing: false,
      valuesByMode: { 'm-light': { r: 1, g: 1, b: 1, a: 1 }, 'm-dark': { r: 0, g: 0, b: 0, a: 1 } },
    },
    {
      id: 'v-blue3',
      name: 'Blue/Blue-3',
      resolvedType: 'COLOR',
      variableCollectionId: 'col-theme',
      scopes: ['ALL_SCOPES'],
      hiddenFromPublishing: false,
      valuesByMode: { 'm-light': { r: 1, g: 1, b: 1, a: 1 }, 'm-dark': { r: 0, g: 0, b: 0, a: 1 } },
    },
    {
      id: 'v-sem',
      name: 'semantic/colors/background/surface/primary',
      resolvedType: 'COLOR',
      variableCollectionId: 'col-brand',
      scopes: ['ALL_SCOPES'],
      valuesByMode: {
        'm-acr': { type: 'VARIABLE_ALIAS', id: 'v-base' },
        'm-bb': { type: 'VARIABLE_ALIAS', id: 'v-base' },
      },
    },
    {
      id: 'v-chev',
      name: 'component/breadcrumb/chevron',
      resolvedType: 'COLOR',
      variableCollectionId: 'col-brand',
      valuesByMode: { 'm-acr': { type: 'VARIABLE_ALIAS', id: 'v-sem' } },
    },
    {
      id: 'v-bga',
      name: 'component/button/background-active',
      resolvedType: 'COLOR',
      variableCollectionId: 'col-brand',
      valuesByMode: { 'm-acr': { r: 0.14, g: 0.27, b: 0.4, a: 1 } },
    },
    {
      id: 'v-orphref',
      name: 'component/x/y',
      resolvedType: 'COLOR',
      variableCollectionId: 'col-brand',
      valuesByMode: { 'm-acr': { type: 'VARIABLE_ALIAS', id: 'VariableID:139:23' } },
    },
  ],
  orphanVariables: [
    {
      id: 'VariableID:139:23',
      name: 'Transparent/Inverted-6',
      resolvedType: 'COLOR',
      variableCollectionId: 'lib',
      scopes: ['ALL_SCOPES'],
      hiddenFromPublishing: true,
      valuesByMode: {},
    },
  ],
  textStyles: [],
  paintStyles: [],
  effectStyles: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tree = buildDtcgTree(convertPayloadToDocument(payload)) as any;
const fc = (leaf: typeof tree) => leaf.$extensions['figma-console-mcp'];

describe('convertPayloadToDocument + buildDtcgTree', () => {
  it('lowercases the collection name into the top-level key', () => {
    expect(tree.theme).toBeDefined();
    expect(tree.brand).toBeDefined();
  });

  it('splits variable names into nested paths, case-preserved', () => {
    expect(tree.theme.Blue['Blue-3']).toBeDefined();
    expect(tree.brand.semantic.colors.background.surface.primary).toBeDefined();
    expect(tree.brand.component.breadcrumb.chevron).toBeDefined();
  });

  it('primitives: primary mode in $value, other modes under $extensions.modes', () => {
    const blue3 = tree.theme.Blue['Blue-3'];
    expect(blue3.$type).toBe('color');
    expect(blue3.$value).toBe('#FFFFFF');
    expect(blue3.$extensions.modes.Dark).toBe('#000000');
    expect(fc(blue3).variableId).toBe('v-blue3');
  });

  it('semantic colors: aliases recorded as lastSyncedValue references per mode name', () => {
    const prim = tree.brand.semantic.colors.background.surface.primary;
    expect(fc(prim).lastSyncedValue.Acronis.reference).toBe('{Base}');
    expect(fc(prim).lastSyncedValue['Brand B'].reference).toBe('{Base}');
    expect(fc(prim).variableId).toBe('v-sem');
  });

  it('component alias reference uses the target variable dotted name', () => {
    const chev = tree.brand.component.breadcrumb.chevron;
    expect(fc(chev).lastSyncedValue.Acronis.reference).toBe(
      '{semantic.colors.background.surface.primary}',
    );
  });

  it('component literal color is an uppercase hex string', () => {
    const bga = tree.brand.component.button['background-active'];
    expect(fc(bga).lastSyncedValue.Acronis.literal).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('orphan (non-local) alias target encodes as a {__library:VariableID} reference', () => {
    const orphRef = tree.brand.component.x.y;
    expect(fc(orphRef).lastSyncedValue.Acronis.reference).toBe('{__library:VariableID:139:23}');
  });
});

describe('writeSnapshot', () => {
  const outDir = mkdtempSync(join(tmpdir(), 'fte-'));
  afterAll(() => rmSync(outDir, { recursive: true, force: true }));

  it('covers every referenced VariableID in the meta sidecar (incl. resolved orphans)', () => {
    const { files } = writeSnapshot(payload, outDir);
    expect(files.some((f) => f.endsWith('variables.tokens.json'))).toBe(true);

    const exportSrc = readFileSync(join(outDir, 'variables.tokens.json'), 'utf8');
    const meta = JSON.parse(readFileSync(join(outDir, 'variables-meta.json'), 'utf8'));
    const referenced = new Set(exportSrc.match(/VariableID:\d+:\d+/g) ?? []);

    // The orphan-coverage gate's invariant: every VariableID in the export is a meta key.
    for (const id of referenced) expect(meta[id], `meta missing ${id}`).toBeDefined();

    expect(meta['VariableID:139:23']).toEqual({
      name: 'Transparent/Inverted-6',
      scopes: ['ALL_SCOPES'],
      hidden: true,
    });
  });
});
