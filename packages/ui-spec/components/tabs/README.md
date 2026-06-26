# Tabs

Switches between related panels of content within the same context. A bordered
segmented-control tab group built on the Base UI Tabs primitive.

> **Status: draft (design-pending v1).** Ported from the legacy
> `@acronis-platform/shadcn-uikit` `Tabs`. No `--ui-tabs-*` token tier yet, so
> the segments use the shared brand tokens — the **`secondary`** bridge (the same
> action blue Button uses), not `primary` (which is the dark navy brand). The
> active segment is rendered **filled** (`bg-secondary` + a pure-white
> `text-primary-foreground` label, like the default Button); the legacy
> `bg-primary/10` tint was dropped to avoid an opacity hack — the final treatment
> (filled vs tinted vs underline) is to be confirmed. Reconcile with
> `/figma-component Tabs <url> --update` once a mockup lands.

## When to use

- Letting the user switch between a few peer views of the same area (Account /
  Password; Overview / Analytics / Reports) without navigating away.

## When not to use

- For navigation between pages/routes — use links or a nav, not tabs.
- For more tabs than fit comfortably in a segmented strip — consider a
  different navigation pattern.
- For sequential steps — use a wizard/stepper.

## Parts

| Part          | Element              | Purpose                                    |
| ------------- | -------------------- | ------------------------------------------ |
| `Tabs`        | `div` (Root)         | Owns the selected value and orientation.   |
| `TabsList`    | `div[role=tablist]`  | The segmented strip of triggers.           |
| `TabsTrigger` | `button[role=tab]`   | A tab; identified by `value`.              |
| `TabsContent` | `div[role=tabpanel]` | A panel; shown when its `value` is active. |

## Example

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@acronis-platform/ui-react';

<Tabs defaultValue="account" className="w-[400px]">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>;
```

Controlled:

```tsx
const [tab, setTab] = useState('account');

<Tabs value={tab} onValueChange={setTab}>
  {/* … */}
</Tabs>;
```
