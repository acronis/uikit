# Alert — accessibility

- The root carries `role="alert"`, so screen readers announce its content when it
  appears. Use it for important, time-sensitive messages; for non-urgent status,
  prefer a plain region so it isn't announced assertively.
- Don't rely on color alone to signal severity — pair the variant with an icon
  and clear title text (the parts support exactly this).
- Keep the icon decorative (the title/description carry the meaning), or give it
  an accessible label if it conveys information not in the text.

## Contrast

Each variant pairs a pale status surface (`--ui-background-status-*`) with its
readable on-status text (`--ui-text-on-status-*`), which meet contrast in light
and dark. The accent border uses the strong status border token (the ai variant
uses its solid text token, since its `-strong` border is a gradient).
