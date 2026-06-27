# AuthLayout

A centered-card layout for authentication flows — sign-in / sign-up /
forgot-password / 2FA. A full-page centered surface card with a brand/logo slot,
the form content, and a footer of links. Mapped to the Main-menu-improvements
Figma (node `4906-362342`).

## When to use

- Unauthenticated screens (login, registration, password reset, verification).

## When not to use

- An authenticated app screen — use [App Shell](/layouts/app-shell).
- A modal confirmation — use `Dialog`.

## Parts

| Export             | Purpose                               |
| ------------------ | ------------------------------------- |
| `AuthLayout`       | Full-page centered container.         |
| `AuthLayoutCard`   | The centered surface card (max-w-sm). |
| `AuthLayoutLogo`   | Top brand / title slot.               |
| `AuthLayoutFooter` | Bottom muted links / helper text.     |

## Example

```tsx
<AuthLayout>
  <AuthLayoutCard>
    <AuthLayoutLogo>
      <span className="text-base font-semibold">Sign in</span>
    </AuthLayoutLogo>
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<InputBox type="email" />} />
    </Field>
    <Button className="w-full">Sign in</Button>
    <AuthLayoutFooter>
      <a href="#">Forgot password?</a>
    </AuthLayoutFooter>
  </AuthLayoutCard>
</AuthLayout>
```
