import * as React from 'react'
import { cn } from '@acronis-platform/shadcn-uikit/react'

export function NavigationMenuSecondaryTab() {
  const [activeTab, setActiveTab] = React.useState('overview')

  return (
    <div className="rounded-lg border">
      <nav className="flex border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            'relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide transition-colors',
            activeTab === 'overview'
              ? 'text-[hsl(var(--nav-menu-text))]'
              : 'text-gray-500 hover:text-[hsl(var(--nav-menu-text))]'
          )}
        >
          Overview
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--nav-menu-active-indicator))]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={cn(
            'relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide transition-colors',
            activeTab === 'analytics'
              ? 'text-[hsl(var(--nav-menu-text))]'
              : 'text-gray-500 hover:text-[hsl(var(--nav-menu-text))]'
          )}
        >
          Analytics
          <span className="flex h-4 items-center rounded-full border border-[hsl(var(--nav-menu-counter-border))] bg-[hsl(var(--nav-menu-counter-bg))] px-2 text-[10px] font-bold leading-4 tracking-wider text-[hsl(var(--nav-menu-counter-text))]">
            5
          </span>
          {activeTab === 'analytics' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--nav-menu-active-indicator))]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={cn(
            'relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide transition-colors',
            activeTab === 'reports'
              ? 'text-[hsl(var(--nav-menu-text))]'
              : 'text-gray-500 hover:text-[hsl(var(--nav-menu-text))]'
          )}
        >
          Reports
          {activeTab === 'reports' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--nav-menu-active-indicator))]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={cn(
            'relative flex items-center gap-2 px-6 pb-4 pt-5 text-sm font-semibold uppercase tracking-wide transition-colors',
            activeTab === 'settings'
              ? 'text-[hsl(var(--nav-menu-text))]'
              : 'text-gray-500 hover:text-[hsl(var(--nav-menu-text))]'
          )}
        >
          Settings
          <span className="flex h-4 items-center rounded-full border border-[hsl(var(--nav-menu-counter-border))] bg-[hsl(var(--nav-menu-counter-bg))] px-2 text-[10px] font-bold leading-4 tracking-wider text-[hsl(var(--nav-menu-counter-text))]">
            3
          </span>
          {activeTab === 'settings' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--nav-menu-active-indicator))]" />
          )}
        </button>
      </nav>
      <div className="p-6">
        {activeTab === 'overview' && (
          <div>
            <h4 className="mb-2 font-semibold">Overview Content</h4>
            <p className="text-sm text-gray-600">
              This is the overview section with general information about your dashboard.
            </p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div>
            <h4 className="mb-2 font-semibold">Analytics Content</h4>
            <p className="text-sm text-gray-600">
              View detailed analytics and metrics. You have 5 new reports to review.
            </p>
          </div>
        )}
        {activeTab === 'reports' && (
          <div>
            <h4 className="mb-2 font-semibold">Reports Content</h4>
            <p className="text-sm text-gray-600">
              Access and generate various reports for your data.
            </p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h4 className="mb-2 font-semibold">Settings Content</h4>
            <p className="text-sm text-gray-600">
              Configure your preferences and account settings. 3 settings need attention.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
