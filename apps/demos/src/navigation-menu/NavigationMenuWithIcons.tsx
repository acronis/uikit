export function NavigationMenuWithIcons() {
  return (
    <div className="rounded-lg border">
      <nav className="flex border-b">
        <button className="relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide text-[hsl(var(--nav-menu-text))] transition-colors">
          Home
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--nav-menu-active-indicator))]" />
        </button>
        <button className="relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide text-gray-500 transition-colors hover:text-[hsl(var(--nav-menu-text))]">
          Products
        </button>
        <button className="relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide text-gray-500 transition-colors hover:text-[hsl(var(--nav-menu-text))]">
          Services
        </button>
        <button className="relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide text-gray-500 transition-colors hover:text-[hsl(var(--nav-menu-text))]">
          About
        </button>
      </nav>
    </div>
  )
}
