// Vendored from figma-plugin-helper-functions/figma-plugin-helpers (MIT).
// Source:
//   https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/master/src/helpers/extractLinearGradientStartEnd.ts
//   https://github.com/figma-plugin-helper-functions/figma-plugin-helpers/blob/master/src/helpers/applyMatrixToPoint.ts
//
// Differences from the upstream version:
//   - Converted from TypeScript to plain JS / ESM (Transform type dropped).
//   - matrix-inverse npm dep inlined as `invert3x3` below so this module is
//     dependency-free.
//   - Comments expanded slightly to clarify the math for future readers.

// Apply a 2x3 or 3x3 affine matrix to a 2D point.
// matrix rows: [[a, b, c], [d, e, f], (optional [0, 0, 1])]
export function applyMatrixToPoint(matrix, point) {
  return [
    point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
    point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2],
  ];
}

// 3x3 matrix inverse via cofactor expansion. Returns null if singular.
function invert3x3(m) {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A =  (e * i - f * h);
  const B = -(d * i - f * g);
  const C =  (d * h - e * g);
  const D = -(b * i - c * h);
  const E =  (a * i - c * g);
  const F = -(a * h - b * g);
  const G =  (b * f - c * e);
  const H = -(a * f - c * d);
  const I =  (a * e - b * d);
  const det = a * A + b * B + c * C;
  if (det === 0) return null;
  const k = 1 / det;
  return [
    [A * k, D * k, G * k],
    [B * k, E * k, H * k],
    [C * k, F * k, I * k],
  ];
}

/**
 * Extract the start and end positions of a linear gradient in layer space.
 * Figma's `gradientTransform` is the inverse of the gradient axis — it maps
 * layer coordinates to gradient unit-space — so to recover the axis we invert
 * the transform and apply it to the two endpoints of the unit-space midline.
 *
 * @param {number} shapeWidth   Width of the layer/shape the gradient is on.
 * @param {number} shapeHeight  Height of the layer/shape.
 * @param {number[][]} t        Figma gradientTransform (2x3 or 3x3).
 * @returns {{ start: [number, number], end: [number, number] }}
 */
export function extractLinearGradientParamsFromTransform(shapeWidth, shapeHeight, t) {
  const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t];
  const mxInv = invert3x3(transform);
  if (!mxInv) throw new Error('extractLinearGradientParamsFromTransform: singular matrix');
  const startEnd = [
    [0, 0.5],
    [1, 0.5],
  ].map((p) => applyMatrixToPoint(mxInv, p));
  return {
    start: [startEnd[0][0] * shapeWidth, startEnd[0][1] * shapeHeight],
    end:   [startEnd[1][0] * shapeWidth, startEnd[1][1] * shapeHeight],
  };
}
