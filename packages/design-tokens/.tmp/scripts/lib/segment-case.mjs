// .tmp/scripts/lib/segment-case.mjs
// Case-aware kebab transform for next-gen component path segments.
//
// The next-gen Figma component tier mixes casing within one tree: PascalCase
// component/variant names (`ButtonIcon`, `SidebarPrimary`, `MenuItemExtras`,
// `Link`, `Page`, `Section`) and camelCase leaf/role names (`borderRadius`,
// `paddingX`, `widthMin`, `textStyle`, `descriptionFalse`). This converts any
// of them to a single kebab-case form, uniformly — no per-token table.
//
// `_global` keeps its leading underscore (a grouping marker that sorts to the
// front and is later stripped by the Tailwind router); already-kebab segments
// (`gap-x`, `padding-x-primary`) and numeric segments (`16`, `24`) pass through.
//
// Examples:
//   kebabSegment("ButtonIcon")      → "button-icon"
//   kebabSegment("SidebarPrimary")  → "sidebar-primary"
//   kebabSegment("borderRadius")    → "border-radius"
//   kebabSegment("paddingX")        → "padding-x"
//   kebabSegment("descriptionTrue") → "description-true"
//   kebabSegment("_global")         → "_global"
//   kebabSegment("gap-x")           → "gap-x"
//   kebabSegment("16")              → "16"

export function kebabSegment(segment) {
  const lead = segment.startsWith('_') ? '_' : '';
  const body = segment.slice(lead.length);
  return (
    lead +
    body
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase()
  );
}
