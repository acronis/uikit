/**
 * ESLint rule: flag a hand-rolled fixed side panel (the shape `fixed` + an
 * edge-pinned `*-0` + a `z-` stacking class on a plain host element) and steer
 * the author to the `Sheet` component / `sheet-detail-panel` pattern.
 *
 * This is the PROTOTYPE of pattern enforcement: the message is drawn from the
 * sheet-detail-panel pattern's #1 anti-pattern ("Hand-rolling a fixed side panel
 * instead of composing Sheet"). The same shape — one focused rule per pattern
 * anti-pattern — generalizes to a `@acronis-platform/eslint-plugin-patterns`.
 *
 * Heuristic, intentionally conservative (host element + literal className with
 * all three markers) to avoid false positives; it does not try to parse `cn()`.
 */

const EDGE = /\b(left|right|top|bottom)-0\b/;
const Z = /\bz-(\[|\d)/;

/** @type {import('eslint').Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow hand-rolled fixed side panels; use the Sheet component (sheet-detail-panel pattern).',
    },
    schema: [],
    messages: {
      adhocSheet:
        'Hand-rolled fixed side panel detected ("{{classes}}"). Use the `Sheet` component (see the sheet-detail-panel pattern) — you get focus trap, scroll lock, ARIA, and slide animations for free.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        // Only plain host elements (div/aside/section …); skip components.
        if (
          node.name.type !== 'JSXIdentifier' ||
          !/^[a-z]/.test(node.name.name)
        ) {
          return;
        }
        const classAttr = node.attributes.find(
          (a) =>
            a.type === 'JSXAttribute' &&
            a.name.type === 'JSXIdentifier' &&
            a.name.name === 'className' &&
            a.value &&
            a.value.type === 'Literal' &&
            typeof a.value.value === 'string'
        );
        if (!classAttr) return;
        const classes = String(classAttr.value.value);
        if (/\bfixed\b/.test(classes) && EDGE.test(classes) && Z.test(classes)) {
          context.report({
            node,
            messageId: 'adhocSheet',
            data: { classes: classes.slice(0, 60) },
          });
        }
      },
    };
  },
};

export default rule;
