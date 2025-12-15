# Copilot / AI Agent Instructions

Short, focused guidance for contributors and AI agents working on this repository.

## Big picture

- Single-page React + Vite app (TypeScript) that stores data in-browser (no backend). See router in [src/router/AppRouter.tsx](src/router/AppRouter.tsx) for the route surface and pages in [src/pages](src/pages).
- Data model and persistence: `User` interface and all persistence are in [src/data/userService.ts](src/data/userService.ts). Data is persisted to `localStorage` under the key `users_db` via async helpers like `getUsers()`, `addUser()`, `updateUser()`; the service also exposes `subscribe()` to listen for storage changes.

## Where to make changes

- UI pages live in [src/pages](../src/pages) (one page per route). Add new routes in [src/router/AppRouter.tsx](../src/router/AppRouter.tsx).
- Reusable form and input patterns live under [src/components](../src/components), e.g., `UserForm` in [src/components/forms/UserForm.tsx](../src/components/forms/UserForm.tsx) — follow its validation & submit pattern (local validation, then call the methods exposed by the `UsersContext` — prefer `useUsers()` over importing `userService` directly).
- Business logic / storage belongs under [src/data](../src/data) — prefer updating `userService.ts` rather than touching UI components when changing data behavior.

**Key files**

- **`src/data/userService.ts`**: Async localStorage service, exposes `getUsers()`, `getUser()`, `addUser()`, `updateUser()`, `deleteUser()`, and `subscribe()` for storage events. Uses timestamp-based ids. `availabilityDate` is stored in `dd-mm-yyyy` format for display and sorting. Prefer importing from `src/data/userService` when used across the app.
- **`src/context/UsersContext.tsx`**: New centralized state + actions (`useUsers()` hook, `UsersProvider`) — prefer using this in UI components. Exported via `src/context` barrel for simpler imports.
- **`src/components/forms/UserForm.tsx`**: Form pattern to follow (validation, accessibility, uses `useUsers()` for add/update). Uses `FormField` (src/components/forms/FormField.tsx) for consistent field layout. Note: `availabilityDate` is normalized to `yyyy-mm-dd` for the input when editing, but stored as `dd-mm-yyyy` for display and sorting.
- **`src/components/NavBar.tsx`**: Top navigation component used in the app header (Home, About, Users).
- **`src/components/UserTable.tsx`**: Reusable table component using `react-data-table-component` (preferred over manual `table`/`td` markup).
- Note: Barrel `index.ts` files were removed in favor of direct imports from concrete files. Deprecated barrel files remain as no-ops with guidance comments.- **`src/pages/UserList.tsx`**, **`src/pages/EditUser.tsx`**: Examples of using `useUsers()` and the `UserTable` component for a clean, responsive list UI.
- **`src/App.tsx`**: App is wrapped with `UsersProvider` to provide app-wide user state. Import `UsersProvider` from `src/context/UsersContext` rather than barrels.

## Conventions & patterns to follow

- Types: the project uses TypeScript with `strict: true` (see [tsconfig.app.json](tsconfig.app.json)). Prefer explicit types over `any` when practical; use `User` from `src/data` for user-shaped objects, and prefer narrower event and state types (e.g., `React.FormEvent<HTMLFormElement>` for form handlers).
- File and component style: default exports, PascalCase file names for components and pages, functional components with React hooks.
- Styling: Tailwind is used via [src/index.css](src/index.css). Use utility classes rather than custom CSS unless necessary.
- Routing: React Router v7 style with `<Routes>` / `<Route>` and `element` props (see [src/router/AppRouter.tsx](src/router/AppRouter.tsx)).

## Developer workflows & commands

- **Do not run `npm install` or `npm run build` automatically** — ask the user for permission before running install/build commands.
- Start development server: `npm run dev` (Vite). Run once and use HMR during development rather than rebuilding repeatedly.
- If you modify `package.json` (add/remove deps), ask the user before running `npm install`.
- Build for production: `npm run build` (runs `tsc -b` + `vite build`). Run only when preparing a release or when the user explicitly requests it.
- Lint: `npm run lint` (ESLint configuration is present).
- Preview build: `npm run preview`.
- New dependency: This project uses `react-data-table-component` for tabular views; run `npm install` after it's added to `package.json` (ask before installing).

## Quick examples an agent may need

- To fetch all users: prefer using the `useUsers()` hook from `src/hooks/useUsers.ts` (it wraps the `UsersContext`), which centralizes state and uses the async `userService` under the hood. If you do use the service directly, note its APIs are async and `subscribe()` will notify of external changes.
- To add a user from the UI: `UserForm` collects fields, validates locally, then calls the methods from `useUsers()` (`addUser` / `updateUser`) and navigates back to the list.
- To add a new page: create `src/pages/YourPage.tsx`, export default a component, and add a `Route` in [src/router/AppRouter.tsx](src/router/AppRouter.tsx).
- Filtering: the `UserFilter` panel in `src/components/filters/UserFilter.tsx` applies client-side filters; the education dropdown uses case-insensitive "contains" matching (e.g., selecting "Bachelor" matches "Bachelor's Degree").

## Integration / gotchas

- No backend API — do not assume network requests. Persisted state is `localStorage` and tests or changes that assume a server must be adapted.
- The service now uses a timestamp-based id (via `Date.now()`) for simplicity and multi-tab safety. Changing the ID scheme still requires updating `userService` and ensuring callers and stored data remain compatible.
- Multi-tab and event races: prefer calling `reload()` (or relying on `subscribe()` updates) after writing to `userService` rather than applying local optimistic appends to `users` state — this avoids duplicate entries caused by storage-change listeners and timing races.

- UI responsiveness & accessibility: pages render a table on wider screens and stacked cards on small screens (see [src/pages/UserList.tsx](../src/pages/UserList.tsx)). Buttons and forms are simple, accessible, and use Tailwind utilities; keep `label` + input association and provide clear validation messages.

- Some components use loose `any` types (e.g., `UserForm` props). Improvements are acceptable but keep changes small and well-typed to avoid regressions.

## PR and change guidance for AI agents

- Prefer small, focused PRs: update a page or service file and include a short description of why types/logic changed.
- Reference concrete files in the PR and update related examples (e.g., update `UserForm` tests/mocks if you change validation).

**Import style**

- This repository does not use barrel `index.ts` files — import directly from the concrete files for clarity. Examples:
  - `import { UsersProvider, useUsers } from 'src/context/UsersContext'`
  - `import UserForm from 'src/components/forms/UserForm'`

If any section is unclear or you'd like more examples (e.g., a suggested test harness or more file pointers), say which area and I will expand.
