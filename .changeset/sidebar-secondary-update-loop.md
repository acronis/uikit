---
'@acronis-platform/ui-react': patch
---

**SidebarSecondary**: fix "Maximum update depth exceeded" error when `SidebarSecondaryMenuItem` or `SidebarSecondaryHeader` children are React nodes.

Both components registered their label with the sidebar context via a `useEffect` that listed `children`/`resolvedLabel` as a dependency. When those children are JSX elements, a new object is created on every render, making the dependency unstable and re-firing the effect each render — which updated context, triggered consumer re-renders, and fired the effect again in an infinite loop.

Fix uses the "latest-value ref" pattern: the ref is updated on every render so the effect always reads the current label, but the effect itself only depends on the stable setter and runs only on mount/unmount or when `selected` changes.

Also adds a cleanup to both effects that clears the registered label when the component unmounts, preventing stale breadcrumb text when a selected item is removed from the tree (e.g. filtered out by a search field).
