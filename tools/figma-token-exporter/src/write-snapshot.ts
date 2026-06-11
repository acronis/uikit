// Turn an ExportPayload into the `.tmp/figma-tokens/` snapshot files the
// design-tokens sync emitters consume, and write them to disk.
//
// Files written (matching context/figma-sync.md):
//   variables.tokens.json — DTCG export (consumed by all three emitters)
//   variables-meta.json    — { [variableId]: { name, scopes, hidden } }
//   styles-text.json       — { styles: [...] } (consumed by figma-to-semantic)
//   styles-color.json      — { styles: [...] } (parity; not consumed today)
//   styles-effect.json     — { styles: [...] } (parity; not consumed today)

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDtcgTree, convertPayloadToDocument } from './convert.js';
import type { ExportPayload, RawVariable, VariableMetaEntry } from './types.js';

// tools/figma-token-exporter/src/ → repo root is three levels up.
export const DEFAULT_OUT_DIR = fileURLToPath(
  new URL('../../../packages/design-tokens/.tmp/figma-tokens/', import.meta.url),
);

function buildMeta(payload: ExportPayload): Record<string, VariableMetaEntry> {
  const meta: Record<string, VariableMetaEntry> = {};
  const add = (v: RawVariable) => {
    meta[v.id] = {
      name: v.name,
      scopes: v.scopes ?? [],
      hidden: !!v.hiddenFromPublishing,
    };
  };
  for (const v of payload.variables) add(v);
  for (const v of payload.orphanVariables) if (!meta[v.id]) add(v);
  return meta;
}

function json(value: unknown): string {
  return JSON.stringify(value, null, 2) + '\n';
}

export interface WriteResult {
  outDir: string;
  files: string[];
}

export function writeSnapshot(payload: ExportPayload, outDir: string = DEFAULT_OUT_DIR): WriteResult {
  mkdirSync(outDir, { recursive: true });

  const variablesTokens = buildDtcgTree(convertPayloadToDocument(payload));
  const meta = buildMeta(payload);

  const outputs: Record<string, unknown> = {
    'variables.tokens.json': variablesTokens,
    'variables-meta.json': meta,
    'styles-text.json': { styles: payload.textStyles },
    'styles-color.json': { styles: payload.paintStyles },
    'styles-effect.json': { styles: payload.effectStyles },
  };

  const files: string[] = [];
  for (const [name, value] of Object.entries(outputs)) {
    const target = join(outDir, name);
    writeFileSync(target, json(value), 'utf8');
    files.push(target);
  }

  return { outDir, files };
}
