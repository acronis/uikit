// The value transforms and the transform group the CSS builder applies. The
// group resolves DTCG values to CSS strings (color → rgb, gradient →
// linear-gradient, dimension → px, remaining scalars → string, shadow → the
// box-shadow shorthand, typography → a utility-class declaration block) and
// names tokens with the Acronis `ui` convention (`name/ui`: drop the `colors`
// tier root, prefix `ui`). Order matters: value transforms run before the name
// transform.

import { COLOR_HSL_RGB, colorHslToRgb } from './color-hsl-rgb';
import { DIMENSION_PX, dimensionPx } from './dimension-px';
import { GRADIENT_CSS, gradientCss } from './gradient-css';
import { NAME_UI, nameUi } from './name-ui';
import { SCALAR_CSS, scalarCss } from './scalar-css';
import { SHADOW_CSS, shadowCss } from './shadow-css';
import { TYPOGRAPHY_CSS_CLASS, typographyCssClass } from './typography-css-class';

export { COLOR_HSL_RGB, DIMENSION_PX, GRADIENT_CSS, NAME_UI, SCALAR_CSS, SHADOW_CSS, TYPOGRAPHY_CSS_CLASS };

export const TRANSFORMS = [
  colorHslToRgb,
  gradientCss,
  dimensionPx,
  scalarCss,
  shadowCss,
  typographyCssClass,
  nameUi,
];

export const ACRONIS_CSS_GROUP = 'acronis/css';

export const ACRONIS_CSS_TRANSFORMS = [
  COLOR_HSL_RGB,
  GRADIENT_CSS,
  DIMENSION_PX,
  SCALAR_CSS,
  SHADOW_CSS,
  TYPOGRAPHY_CSS_CLASS,
  NAME_UI,
];
