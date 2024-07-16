# Turborepo Shadncn UI Starter with Directus and NextAuth

## Using this template

`Fork` this template repository.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `api`: a [Directus](https://directus.io/) app with a [seeder extension](https://github.com/ChappIO/directus-extension-seed)
- `web`: another [Next.js](https://nextjs.org/) app with [Tailwind CSS](https://tailwindcss.com/) and [Shadcn UI](https://ui.shadcn.com/) and the [directus sdk](https://docs.directus.io/guides/sdk/getting-started.html) linked with [next-auth](https://next-auth.js.org/)
- `ui`: a stub React component library with [Tailwind CSS](https://tailwindcss.com/) and [Shadcn UI](https://ui.shadcn.com/) shared by both `web` and `docs` applications
- `tailwind-config`: `tailwind.config.ts` used throughout the monorepo
- `eslint-config`: `eslint` configurations (includes `@tanstack/eslint-plugin-query/recommended` and `next/core-web-vitals`)
- `tsconfig`: `tsconfig.json` used throughout the monorepo
- `tsup-config`: `tsup.config.ts` used throughout the monorepo
- `cronTimeV2`: `cronTime` with additional features
- `bin`: `bin` with `cli` for `scheduleCli` and other tools like `runUntil` and `envCli`

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Building packages/ui

This example is setup to build `packages/ui` and output the transpiled source and compiled styles to `dist/`. This was chosen to make sharing one `tailwind.config.ts` as easy as possible, and to ensure only the CSS that is used by the current application and its dependencies is generated.

### Utilities

This Turborepo has some additional tools already setup for you:

- [Tailwind CSS](https://tailwindcss.com/) for styles
- [Shadcn UI](https://ui.shadcn.com/) for ui components
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [next-auth](https://next-auth.js.org/) for authentication {linked with directus}
- [directus](https://directus.io/) for headless CMS
- [tsup](https://github.com/egoist/tsup) for bundling
- [declarative-routing](https://github.com/ProNextJS/declarative-routing/blob/main/docs/nextjs.md) for routing