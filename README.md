# QR App

A simple example application built with **Nuxt 4**, **Ionic**, and **Convex**, targeting both web and iOS via Capacitor.

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/) (SPA mode)
- **UI:** [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- **Backend / Database:** [Convex](https://www.convex.dev/)
- **Authentication:** [Better Auth](https://www.better-auth.com/) with Convex adapter
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Native:** [Capacitor](https://capacitorjs.com/) (iOS)
- **Testing:** [Vitest](https://vitest.dev/) (Nuxt environment + Convex edge-runtime), [Playwright](https://playwright.dev/) (E2E)

## Prerequisites

- [Bun](https://bun.sh/) (runtime & package manager)
- [Convex CLI](https://docs.convex.dev/cli) (for local backend development)
- Xcode (for iOS builds)

## Setup

Install dependencies:

```bash
bun install
```

Create a `.env.local` file with:

```env
CONVEX_URL=<your convex deployment url>
CONVEX_SITE_URL=<your convex site url>
```

## Development

Start the Nuxt dev server:

```bash
bun dev
```

Start Nuxt + Convex together:

```bash
bun dev:local
```

Start Nuxt + Convex + iOS simulator:

```bash
bun dev:local:ios
```

Start only the Convex dev server:

```bash
bun dev:convex
```

Start iOS simulator with live reload:

```bash
bun dev:ios
```

Generate Better Auth schema for Convex:

```bash
bun dev:db:generate:auth
```

## Testing

The project uses two Vitest test projects configured in `vitest.config.ts`:

- **nuxt** — Vue component, composable, and page tests running in a Nuxt/happy-dom environment (`test/nuxt/`)
- **convex** — Backend API tests running in an edge-runtime environment via `convex-test` (`test/convex/`)

```bash
# Run all tests (nuxt + convex)
bun run test

# Watch mode
bun test:watch

# Only Nuxt environment tests
bun test:nuxt

# Only Convex API tests
bun test:convex

# Coverage report
bun test:coverage

# E2E tests
bun test:e2e

# E2E tests with UI
bun test:e2e:ui
```

## Building

Generate static site:

```bash
bun run generate
```

Preview the build:

```bash
bun run preview
```

Sync native project after build:

```bash
bun cap:sync
```

## Project Structure

```
app/ # Nuxt app
  components/    # Vue UI components
  composables/   # Shared composables
  middleware/    # Route middlewares
  pages/         # App pages
  plugins/       # Nuxt plugins
  stores/        # Pinia stores
convex/ # Convex backend
test/ # Tests
  convex/        # Convex API tests (edge-runtime)
  nuxt/          # Nuxt-environment component/composable/page tests

```
