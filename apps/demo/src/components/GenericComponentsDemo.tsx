import * as React from 'react'
import {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  PageContent,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
} from '@acronis-platform/shadcn-uikit/react'
import { Button } from '@acronis-platform/shadcn-uikit/react'

function PageHeaderExample() {
  return (
    <PageHeader>
      <PageHeaderBreadcrumb>Home / Settings / Users</PageHeaderBreadcrumb>
      <PageHeaderTitle>User Management</PageHeaderTitle>
      <PageHeaderDescription>Manage team members and their permissions.</PageHeaderDescription>
      <PageHeaderActions>
        <Button variant="outline" size="sm">Export</Button>
        <Button size="sm">Add User</Button>
      </PageHeaderActions>
    </PageHeader>
  )
}

function PageContentExample() {
  return (
    <div className="border rounded-lg overflow-hidden">
      <PageContent>
        <p className="text-muted-foreground">This is the main page content area with consistent padding.</p>
      </PageContent>
    </div>
  )
}

function SectionExample() {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Personal Information</SectionTitle>
        <SectionDescription>Update your personal details here.</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <p className="text-muted-foreground">Section body content goes here.</p>
      </SectionContent>
    </Section>
  )
}

export function GenericComponentsDemo() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold">Generic Components</h2>
        <p className="text-muted-foreground">
          Layout building blocks: PageHeader, PageContent, and Section.
        </p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">PageHeader</h3>
        <p className="text-sm text-muted-foreground">Page-level header with breadcrumb, title, description and actions.</p>
        <div className="border rounded-lg p-4">
          <PageHeaderExample />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">PageContent</h3>
        <p className="text-sm text-muted-foreground">Wrapper with consistent padding for page body.</p>
        <PageContentExample />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Section</h3>
        <p className="text-sm text-muted-foreground">Titled content section with optional description.</p>
        <div className="border rounded-lg p-4">
          <SectionExample />
        </div>
      </div>
    </div>
  )
}