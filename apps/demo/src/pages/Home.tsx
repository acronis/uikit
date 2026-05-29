import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome to Acronis UIKit</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A modern React UI component library based on Acronis design system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">Components</h3>
          <p className="text-sm text-muted-foreground">
            Explore our collection of reusable UI components built with React
            and TypeScript.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">Design System</h3>
          <p className="text-sm text-muted-foreground">
            All components follow the Acronis design system with consistent
            styling and behavior.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">Accessible</h3>
          <p className="text-sm text-muted-foreground">
            Built with accessibility in mind, following WCAG 2.1 guidelines.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/playground">Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            A place to experiment with different color palettes.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/demo">Demo</Link>,{' '}
            <Link to="/demo/cyberchat">Chat</Link>,{' '}
            <Link to="/demo/cyberchat-themed">Chat (<i>Host Theming</i>)</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Full-featured demo application. &ldquo;Host Theming&rdquo; shows <code>applyTheme</code> with <code>extraRoots</code> targeting an inner container &mdash; simulating shadow DOM embedding.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/chart">Charts</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Interactive charts built with Recharts
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/widgets">Dashboard Widgets</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Chart widgets, alerts, progress, data tables, text metrics, and placeholders
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/generic-components">Generic Components</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            PageHeader, PageContent, Section, Stack, Grid — layout building blocks
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/layouts">Layout Components</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            AppShell, AuthLayout, DashboardLayout, SplitLayout — page-level structural shells
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/patterns">Pattern Demos</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Dashboard, Settings, Data Management, Login/Signup, Error Pages — semi-functional page compositions
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/chart-playground">� LineChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Interactive playground to explore LineChart settings
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/barchart-playground">📊 BarChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore BarChart: stacked, horizontal, radius, gaps
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/areachart-playground">📈 AreaChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore AreaChart: fill opacity, stacked, curves
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/piechart-playground">🥧 PieChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore PieChart: donut, angles, padding, labels
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/radialchart-playground">🎯 RadialChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore RadialChart: gauges, progress bars, angles
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/scatterchart-playground">🔵 ScatterChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore ScatterChart: correlation, point shapes, reference lines
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/composedchart-playground">🔀 ComposedChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Mix Line, Bar, Area in one chart
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/radarchart-playground">🕸️ RadarChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Spider/web charts for multi-dimensional comparison
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/treemapchart-playground">🗂️ TreemapChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Hierarchical data as nested rectangles
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/funnelchart-playground">🔻 FunnelChart Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Sales pipelines and conversion funnels
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/table-playground">📋 Table Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Interactive data table with sorting, pagination, selection
          </p>
        </div>

        <div className="rounded-lg border p-6 border-primary">
          <h3 className="mb-2 text-lg font-semibold">
            <Link to="/card-playground">🃏 Card Playground</Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            Stats, profiles, pricing, media, notifications
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-semibold">Getting Started</h2>
        <p className="mb-4 text-muted-foreground">
          Select a component from the sidebar to view its demo and explore
          different variations.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Each component includes multiple examples and use cases</li>
          <li>Interactive demos show real-world usage patterns</li>
          <li>All components are fully typed with TypeScript</li>
          <li>Styling is based on Figma design specifications</li>
        </ul>
      </div>
    </div>
  );
}
