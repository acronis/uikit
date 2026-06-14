// .claude/skills/figma-to-design-tokens/helpers/pull-source-loader.mjs
// Loads and validates all raw files from .claude/skills/figma-to-design-tokens/snapshot/ into memory.
// Throws with clear messages on missing or unparseable files.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKENS_DIR = fileURLToPath(
  new URL('../snapshot/', import.meta.url),
);

export class FigmaSourceLoader {
  #dir;
  #variables = null;
  #meta = null;
  #styles = null;

  constructor(dir = TOKENS_DIR) {
    this.#dir = dir;
  }

  get variablesPath() { return path.join(this.#dir, 'variables.tokens.json'); }
  get metaPath()      { return path.join(this.#dir, 'variables-meta.json'); }
  get stylesPath()    { return path.join(this.#dir, 'styles.json'); }

  // Load all sources. Returns `this` for chaining.
  load() {
    this.#variables = this.#readJson(this.variablesPath, true);
    this.#meta = this.#readMeta();
    this.#styles = this.#readStyles();
    return this;
  }

  get variables() { return this.#requireLoaded(this.#variables, 'variables'); }
  get meta()      { return this.#requireLoaded(this.#meta, 'meta'); }
  get styles()    { return this.#requireLoaded(this.#styles, 'styles'); }

  #requireLoaded(value, name) {
    if (value === null) throw new Error(`FigmaSourceLoader: call load() before accessing ${name}`);
    return value;
  }

  #readJson(filePath, required = false) {
    if (!fs.existsSync(filePath)) {
      if (required) throw new Error(`Missing required file: ${filePath}\nRun the Figma pull (Phase 1) first.`);
      return null;
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      throw new Error(`Failed to parse ${filePath}: ${e.message}`);
    }
  }

  #readMeta() {
    const raw = this.#readJson(this.metaPath, true);
    // Auto-unwrap MCP envelope {_mcp, success, result} if present.
    if (raw._mcp !== undefined && raw.result !== undefined) {
      return raw.result;
    }
    return raw;
  }

  // Styles come from a single execute pull written verbatim to styles.json:
  // an MCP envelope { _mcp, success, result: { text, color, effect, grid } }.
  // Auto-unwrap the envelope (like #readMeta) and default each section to [].
  #readStyles() {
    const raw = this.#readJson(this.stylesPath, false);
    if (!raw) return { text: [], color: [], effect: [], grid: [] };
    const data = raw._mcp !== undefined && raw.result !== undefined ? raw.result : raw;
    return {
      text:   data.text   ?? [],
      color:  data.color  ?? [],
      effect: data.effect ?? [],
      grid:   data.grid   ?? [],
    };
  }
}
