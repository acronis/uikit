/** Props for the Breadcrumb component */
export interface BreadcrumbProps {
  /** Custom separator element between breadcrumb items */
  separator?: React.ReactNode
  className?: string
}

/** Props for the BreadcrumbLink component */
export interface BreadcrumbLinkProps {
  /** Render as a child component (e.g., Next.js Link) instead of an anchor */
  asChild?: boolean
  className?: string
}
