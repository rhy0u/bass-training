---
name: boilerplate-conventions
description: Coding conventions for the Boilerplate monorepo. Use Typography from @boilerplate/ui instead of raw HTML tags (p, h1, h2, etc.). Extract reusable form components (FieldError, PasswordHint) into apps/web/src/components/. Use next-intl for all user-facing strings. Follow mobile-first responsive patterns with the xs/sm/md/lg/xl breakpoints from the Tailwind preset.
---

# Boilerplate Project Conventions

## Typography

Always use the `Typography` component from `@boilerplate/ui/typography` instead of raw HTML elements (`<p>`, `<h1>`, `<span>`, etc.).

```tsx
import { Typography } from "@boilerplate/ui/typography";

// ✅ Correct
<Typography variant="body-sm" className="text-red-500">Error message</Typography>
<Typography variant="caption" className="text-foreground-muted">Hint text</Typography>

// ❌ Avoid
<p className="text-sm text-red-500">Error message</p>
```

Available variants: `h1`, `h2`, `h3`, `body`, `body-sm`, `caption`.

## Form Components

Reusable form components live in `apps/web/src/components/`:

- **`FieldError`** — Displays per-field validation error messages using `Typography variant="caption"`.
- **`PasswordHint`** — Shows individual password requirements with live pass/fail indicators.

## Internationalization

All user-facing strings must use `next-intl`. Translation files: `apps/web/messages/{en,fr}.json`.

```tsx
const t = useTranslations("signUp");
// Use t("key") — never hardcode strings.
```

## UI Components

All shared UI primitives are in `packages/ui/src/` (buttons, cards, inputs, dialogs, etc.) and exported as `@boilerplate/ui/<component>`.

## Validation

- Client-side validation runs before form submission (in `handleSubmit`).
- Server-side validation in `apps/web/src/app/actions/auth.ts` mirrors client checks.
- Use regex constants at module scope for email and password patterns.
