export function NavigationMenuSimple() {
  return (
    <div className="rounded-lg border">
      <nav className="flex border-b">
        {['Dashboard', 'Projects', 'Team', 'Calendar'].map((tab) => (
          <button
            key={tab}
            className="relative px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide text-gray-500 transition-colors hover:text-[hsl(var(--nav-menu-text))]"
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  )
}
