# NetworkGraph — accessibility

The root is a labelled region. Each enabled node and connection is a keyboard
button; Tab focuses it and Enter or Space activates it. Nodes are named from
their title, subtitle, caption, and alert labels, falling back to the ID. Edges
are named from their endpoints and can be localized with `getEdgeLabel`. Pressed state reflects selection; disabled nodes
are marked disabled and removed from the tab order. Focus is visible.

Branch toggles expose their expanded state and support Enter and Space. Their
labels can be localized through `getBranchToggleLabel`.

Zoom controls have configurable accessible labels. Consumers should provide a
descriptive `ariaLabel` and localize these labels when needed. Device markers
are decorative; provide their meaningful counts through `deviceIndicatorsLabel`
or adjacent accessible content when necessary.
