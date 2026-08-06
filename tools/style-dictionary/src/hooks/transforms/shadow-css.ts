// Value transform `shadow/css`: a resolved DTCG shadow composite → the CSS
// `box-shadow` shorthand. Figma has no shadow variable type, so the design source
// authors a shadow as five scalar primitives; the semantic tier assembles them
// into a `$type: shadow` composite whose sub-fields are aliases, and this
// transform renders that composite.
//
// MUST be transitive (the same exception `typography/css-class` documents): a
// composite's sub-fields are references, so Style Dictionary only applies a value
// transform to it on the transitive, post-resolution pass — a non-transitive one
// never fires on it at all. By then the sub-field aliases are resolved, to strings
// like `16px` or to `{ value, unit }` objects, so both forms are handled.
//
// CONTRACT: the color is always the LAST component. `collectDecls` relies on that
// to splice a `light-dark()` into the color slot — `light-dark()` is a color
// function and is invalid wrapping a whole shadow.

import type { Transform } from 'style-dictionary/types';
import { transformTypes } from 'style-dictionary/enums';

import { type DtcgColor, hslColorToRgb } from './color-hsl-rgb';
import { type DtcgDimension, formatDimension } from './dimension-px';

export const SHADOW_CSS = 'shadow/css';

/** A resolved DTCG shadow composite. Sub-fields arrive resolved from the alias pass. */
export interface DtcgShadow {
  offsetX: DtcgDimension | string;
  offsetY: DtcgDimension | string;
  blur: DtcgDimension | string;
  spread: DtcgDimension | string;
  color: DtcgColor | string;
}

/** A resolved dimension sub-field, in either the object or already-stringified form. */
const length = (v: DtcgDimension | string): string =>
  typeof v === 'string' ? v : formatDimension(v);

/** A resolved color sub-field, in either the object or already-stringified form. */
const color = (v: DtcgColor | string): string => (typeof v === 'string' ? v : hslColorToRgb(v));

/** A resolved shadow composite → the CSS shorthand, color last. */
export const formatShadow = (s: DtcgShadow): string =>
  `${length(s.offsetX)} ${length(s.offsetY)} ${length(s.blur)} ${length(s.spread)} ${color(s.color)}`;

export const shadowCss: Transform = {
  name: SHADOW_CSS,
  type: transformTypes.value,
  transitive: true,
  filter: (token) => token.$type === 'shadow',
  transform: (token) => formatShadow(token.$value as DtcgShadow),
};
