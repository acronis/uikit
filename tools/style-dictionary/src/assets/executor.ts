// The executor — applies a resolved variant's derivation plan to its source SVG.
// `packages/design-assets/context/spec.md` deliberately leaves execution open
// ("a separate component … the executor"); this is that component.
//
// Pipeline per variant: parse → apply rules left-to-right (scale sets width/height
// losslessly and reports the rendered size; stroke sizes strokes in rendered px) →
// currentColor (mono only) → SVGO optimize. Leaf variants run with an empty rule
// list so every emitted SVG is normalized identically.

import { optimize } from 'svgo';

import { toCurrentColor } from './color';
import { applyScale } from './rules/scale';
import { applyStroke } from './rules/stroke';
import { longerDim, parseSvg, readViewBox, serializeSvg, type INode, type ViewBox } from './svg-ast';
import { svgoConfig, type ColorMode } from './svgo-config';
import type { Rule } from './types';

function intrinsicLonger(root: INode, vb: ViewBox): number {
  const w = Number.parseFloat(root.attributes.width ?? '');
  const h = Number.parseFloat(root.attributes.height ?? '');
  if (!Number.isNaN(w) && !Number.isNaN(h)) return Math.max(w, h);
  return longerDim(vb);
}

/** Apply a variant's ordered rules + color mode to its source SVG; returns optimized SVG. */
export function executeSvg(sourceSvg: string, rules: Rule[], color: ColorMode): string {
  const root = parseSvg(sourceSvg);
  const vb = readViewBox(root);
  let renderedLonger = intrinsicLonger(root, vb);

  for (const rule of rules) {
    if (rule.target.unit !== 'px') {
      throw new Error(`unsupported rule unit "${rule.target.unit}" in rule "${rule.name}"`);
    }
    if (rule.kind === 'scale') {
      renderedLonger = applyScale(root, rule.target.value, vb);
    } else if (rule.kind === 'stroke') {
      applyStroke(root, rule.target.value, vb, renderedLonger);
    } else {
      throw new Error(`unsupported rule kind "${rule.kind}" in rule "${rule.name}"`);
    }
  }

  if (color === 'mono') toCurrentColor(root);

  return optimize(serializeSvg(root), svgoConfig(color)).data;
}
