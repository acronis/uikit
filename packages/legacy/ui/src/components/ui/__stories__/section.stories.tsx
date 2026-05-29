import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from '../section'
import { Button } from '../button'

const meta = {
  title: 'UI/Section',
  component: Section,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Section className="w-[500px]">
      <SectionHeader>
        <SectionTitle>Section Title</SectionTitle>
        <SectionDescription>A brief description of this section&apos;s content.</SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
          Section content goes here.
        </div>
      </SectionContent>
    </Section>
  ),
}

export const WithoutDescription: Story = {
  render: () => (
    <Section className="w-[500px]">
      <SectionHeader>
        <SectionTitle>Simple Section</SectionTitle>
      </SectionHeader>
      <SectionContent>
        <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">Content area.</div>
      </SectionContent>
    </Section>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="w-[500px] space-y-8">
      <Section>
        <SectionHeader>
          <SectionTitle>General Settings</SectionTitle>
          <SectionDescription>Manage your account preferences.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="flex items-center justify-between rounded-md border p-4">
            <span className="text-sm">Display name</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </SectionContent>
      </Section>
      <Section>
        <SectionHeader>
          <SectionTitle>Danger Zone</SectionTitle>
          <SectionDescription>Irreversible and destructive actions.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="flex items-center justify-between rounded-md border border-destructive/40 p-4">
            <span className="text-sm">Delete account</span>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </SectionContent>
      </Section>
    </div>
  ),
}
