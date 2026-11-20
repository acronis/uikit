# NetworkGraph — behavior

- Render a deterministic top-down forest rooted at `roots`; disconnected nodes
  remain visible. Cycles and cross-connections are retained, missing endpoints
  are skipped, and duplicate node IDs throw an error. Tree branches use the
  Figma rounded outer corners while retaining separate edge hit targets.
- Fit the full graph into the viewport when its layout or viewport dimensions change.
  Equivalent data with new object references and selection-only changes preserve
  the current view, moved positions, and uncontrolled selection.
- An enabled node or edge can be activated by pointer or keyboard. Its callback
  receives the complete input object. Disabled nodes are not activated.
- When selection is uncontrolled, activating a node or edge highlights it.
  `selectedNodeIds` and `selectedEdgeIndices` control their respective
  highlights; `selectedNodePairs` adds shortest-path highlights.
- Zoom buttons and the mouse wheel change scale. Canvas drag is disabled unless
  `graphDraggable` is true; node drag is separately enabled by `nodeDraggable`.
- Consumer controls can use the viewport handle to fit, zoom in or out, or set a
  scale; `onZoomChange` reports the scale. A DOM ref permits a consumer to use
  the browser fullscreen API. The graph does not supply the product toolbar.
- Markers and status rows below a card contribute to layout height. Custom text
  replaces node text. Consumers provide empty-state content and canvas background.
- Circular cards use a square footprint and clip their content to the circle.
  Cards with title, subtitle, and caption grow as needed to display all three.
  Disabled and error state colors take precedence over selection highlighting.
- Nodes marked `expandable` with tree children have a branch toggle. Toggling
  hides or restores their descendants and incident edges; controlled and
  uncontrolled collapsed IDs are supported. The consumer can provide a localized
  toggle label. Marker types include active, inactive, muted, and error; the
  consumer can supply an accessible summary for meaningful marker states.
- A node's `collapsedGroupId` can identify an immediate child used as its
  collapsed summary. The summary and its input edge are visible only when the
  branch is collapsed; expanding replaces them with the real descendant nodes.
  A summary is hidden along with its parent when an ancestor is collapsed.
  Expanding refits the graph, including dragged node positions, if it would be
  clipped; collapsing and selection changes preserve the current viewport.
  Indicators are 12 px by default; an indicator may request the 14 px Figma
  treatment. Wrapped marker rows contribute their actual height to layout.
