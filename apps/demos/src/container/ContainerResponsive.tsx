import React, { useState, useEffect } from 'react'

export function ContainerResponsive() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getBreakpoint = () => {
    if (screenWidth >= 1536) return '2xl (≥1536px)'
    if (screenWidth >= 1280) return 'xl (≥1280px)'
    if (screenWidth >= 1024) return 'lg (≥1024px)'
    if (screenWidth >= 768) return 'md (≥768px)'
    if (screenWidth >= 640) return 'sm (≥640px)'
    return 'mobile (<640px)'
  }

  const getContainerMaxWidth = () => {
    if (screenWidth >= 1536) return '1400px'
    if (screenWidth >= 1280) return '1280px'
    if (screenWidth >= 1024) return '1024px'
    if (screenWidth >= 768) return '768px'
    if (screenWidth >= 640) return '640px'
    return '100%'
  }

  const getPadding = () => {
    if (screenWidth >= 1536) return '3rem (48px)'
    if (screenWidth >= 1280) return '2.5rem (40px)'
    if (screenWidth >= 1024) return '2rem (32px)'
    if (screenWidth >= 640) return '1.5rem (24px)'
    return '1rem (16px)'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="container">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
            Tailwind Container Demo
          </h1>

          <div className="grid gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Current Screen Info
              </h2>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <p>
                  <strong>Screen Width:</strong> {screenWidth}px
                </p>
                <p>
                  <strong>Breakpoint:</strong> {getBreakpoint()}
                </p>
                <p>
                  <strong>Container Max Width:</strong> {getContainerMaxWidth()}
                </p>
                <p>
                  <strong>Container Padding:</strong> {getPadding()}
                </p>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2>How It Works</h2>
            <p>
              This entire content area is wrapped in a <code>container</code> class. Resize your
              browser window to see how the container adapts to different screen sizes.
            </p>

            <h3>Configuration Breakdown</h3>
            <ul>
              <li>
                <strong>center: true</strong> - Container is horizontally centered
              </li>
              <li>
                <strong>padding</strong> - Responsive padding that increases with screen size
              </li>
              <li>
                <strong>screens</strong> - Max-width constraints at each breakpoint
              </li>
            </ul>

            <h3>Responsive Behavior</h3>
            <div className="grid gap-3 not-prose">
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <strong className="text-slate-900 dark:text-slate-100">Mobile (&lt;640px):</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {' '}
                  100% width, 1rem padding
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <strong className="text-slate-900 dark:text-slate-100">Small (≥640px):</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {' '}
                  640px max-width, 1.5rem padding
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <strong className="text-slate-900 dark:text-slate-100">Medium (≥768px):</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {' '}
                  768px max-width, 1.5rem padding
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <strong className="text-slate-900 dark:text-slate-100">Large (≥1024px):</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {' '}
                  1024px max-width, 2rem padding
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <strong className="text-slate-900 dark:text-slate-100">XL (≥1280px):</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {' '}
                  1280px max-width, 2.5rem padding
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded p-3">
                <strong className="text-slate-900 dark:text-slate-100">2XL (≥1536px):</strong>
                <span className="text-slate-700 dark:text-slate-300">
                  {' '}
                  1400px max-width, 3rem padding
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Visual Container Boundary</h2>
          <p className="mb-4">
            This colored box helps visualize the container boundaries. Notice how it maintains
            consistent spacing and never exceeds the configured max-width for your screen size.
          </p>
          <div className="bg-white/20 backdrop-blur rounded p-4">
            <p className="text-sm">
              The container ensures your content remains readable and well-proportioned across all
              device sizes, from mobile phones to ultra-wide monitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
