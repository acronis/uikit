# Wizard

The full-page wizard page template — a sticky header band (breadcrumb, title row
with the flow's actions, an optional subtitle, an optional stepper) above a
content column capped at 1024px. Mapped to the ui-react Figma "RegionMain" frame
(node `10511-61418`).

Wizard is a **composition, not a primitive**. Every visual part it needs already
exists in the kit — `Breadcrumb`, `PageHeaderRow` / `PageHeaderTitle` /
`PageHeaderActions`, `Stepper` + `StepperItem`, `Section`, `Button` — and Wizard
reimplements none of them. Its job is the structural skeleton and the slots.

## When to use

- A full-page, multi-step creation or configuration flow (e.g. Create dashboard,
  Create protection plan) that takes over the page rather than a dialog.
- A single-page form that still wants the same header band treatment: the stepper
  is optional.

## When not to use

- A short flow that fits in a modal — use `Dialog` (and `DialogWelcome` for the
  carousel-style onboarding flow).
- A normal, non-stepped page — use `PageHeader` + `PageContent`.
- **Step state or navigation logic.** Wizard has no `step` / `onNext` props by
  design; see below.

## What Wizard deliberately does not do

Per the design brief, deciding which of Cancel / Back / Next / Submit appears on
a given step — and what each one does — is a per-flow product decision owned by
the consuming UI block, not the kit. So Wizard holds no step index, fires no
navigation events, and renders no buttons; `PageHeaderActions` is a slot the
consumer fills. This is the same boundary `PageHeader` draws around its own
actions slot.

Likewise there is no `WizardTitle` or `WizardActions`: the title row is
functionally identical to a page header's, so it is `PageHeaderRow` and friends,
reused. And there is no `WizardStepper` wrapper — the consumer places a plain
`Stepper` in the header, or omits it.

## Parts

| Export           | Element | Purpose                                                                                                                                    |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Wizard`         | `div`   | The template root — a full-height flex column.                                                                                             |
| `WizardHeader`   | `div`   | The sticky header band: breadcrumb, title row, optional subtitle, optional stepper. Owns the surface, divider, padding, and inter-row gap. |
| `WizardSubtitle` | `p`     | Optional muted supporting line under the title row (same treatment as `PageHeaderDescription`; there is no separate `Subtitle` component). |
| `WizardBody`     | `div`   | The step's content column, capped at 1024px. Always wraps a `Section`.                                                                     |

All parts accept their native element attributes plus `className`.

## Example

```tsx
<Wizard>
  <WizardHeader>
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboards</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Create dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <PageHeaderRow>
      <PageHeaderTitle>Create dashboard</PageHeaderTitle>
      <PageHeaderActions>
        <Button variant="secondary">Cancel</Button>
        <Button variant="secondary">Back</Button>
        <Button>Next</Button>
      </PageHeaderActions>
    </PageHeaderRow>

    <WizardSubtitle>
      Name the dashboard, pick its widgets, and choose who can see it.
    </WizardSubtitle>

    <Stepper
      currentStep={2}
      totalSteps={3}
      current="Choose widgets"
      next="Set permissions"
    >
      <StepperItem
        variant="completed"
        label="Name the dashboard"
        avatar={
          <Avatar color="green">
            <AvatarFallback>1</AvatarFallback>
          </Avatar>
        }
      />
      <StepperItem
        variant="current"
        label="Choose widgets"
        avatar={
          <Avatar color="blue">
            <AvatarFallback>2</AvatarFallback>
          </Avatar>
        }
      />
      <StepperItem
        variant="future"
        label="Set permissions"
        avatar={
          <Avatar color="gray">
            <AvatarFallback>3</AvatarFallback>
          </Avatar>
        }
      />
    </Stepper>
  </WizardHeader>

  <WizardBody>
    <Section>
      <SectionHeader>
        <SectionTitle>Choose widgets</SectionTitle>
      </SectionHeader>
      <SectionContent>{/* step fields */}</SectionContent>
    </Section>
  </WizardBody>
</Wizard>
```

### Short flow — no stepper

```tsx
<Wizard>
  <WizardHeader>
    <PageHeaderRow>
      <PageHeaderTitle>Create dashboard</PageHeaderTitle>
      <PageHeaderActions>
        <Button variant="secondary">Cancel</Button>
        <Button>Submit</Button>
      </PageHeaderActions>
    </PageHeaderRow>
  </WizardHeader>
  <WizardBody>
    <Section>{/* … */}</Section>
  </WizardBody>
</Wizard>
```

### Wider step

```tsx
<WizardBody className="max-w-[1280px]">
  <Section>{/* a data table step */}</Section>
</WizardBody>
```
