# usecure Users & Courses App

This repository contains a small full‑stack app with a React client and a GraphQL server. It lets you manage users and
their course results with a clean, mobile‑friendly UI and full end‑to‑end tests.

## How the application works (current state)

- Manage users via New User (create modal) and Edit User (edit modal with Delete + confirm).
- Show Details modal displays full name, email, and the Courses section.
- Courses: view results, add a result, inline edit (Save/Cancel), delete with confirmation.
- Accessible modals; responsive, mobile‑friendly CSS modules with clear colored buttons.
- Data updates refresh the list; changes persist in lowdb (db.json).

## Getting started (development)

Prerequisites:

- Node.js 18+ recommended
- npm 9+ recommended

Install dependencies:

```shell
pnpm --prefix client install
```

```shell
pnpm --prefix server install
```

Run the development servers (two terminals):

```shell
pnpm --prefix server run start
```

```shell
pnpm --prefix client run dev
```

Run tests:

```shell
pnpm --prefix server run test
```

Data persistence:

- The server uses lowdb and stores data in `db.json` at the repo root. You can back it up, reset it, or edit it between
  runs if needed.
