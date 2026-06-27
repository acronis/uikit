# AppShell — behavior

AppShell is a presentational layout. It defines the slots; the caller drops the
nav, search, and page content in.

```gherkin
Scenario: Page scaffold
  Given an AppShell with a sidebar, header, and main
  Then the sidebar fills the left column at its own width
  And the body (header + main) fills the remaining width
```

```gherkin
Scenario: Independent scroll
  Given long page content in AppShellMain
  Then main scrolls while the sidebar and the sticky header stay in place
```

```gherkin
Scenario: Secondary menu
  Given a SidebarSecondary placed next to SidebarPrimary in the sidebar slot
  Then both nav columns sit left of the body
```
