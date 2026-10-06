# ReverseX AI Dashboard

A responsive Next.js website based on the provided ReverseX AI reference. It has separate Home, Projects, Resources, Organisations, and About routes, with shared navigation, footer, theme control, and a local profile switcher. Product artwork is drawn locally as SVG, so the interface does not depend on remote image URLs or font services.

## Open in VS Code

From the repository root, open the `frontend` folder in VS Code, or keep the repository root open and run commands from `frontend`:

```text
frontend
```

Then install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Use Node.js 20.9 or newer. The site will be available at the local address printed by Next.js.

## Configuration

Copy `.env.example` to `.env.local` in this folder and adjust the public frontend settings if needed:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WORKSPACE_NAME=Kailash
```

`NEXT_PUBLIC_API_BASE_URL` is a public service address, not a secret. Never put Gemini keys, database credentials, or other secrets in a `NEXT_PUBLIC_` variable or frontend file. Those belong in the backend environment.

Photo selection currently validates image type, count and file size in the browser, then shows a setup message. It does not send files or claim an AI analysis has run. No analyses API or database is connected in this workspace, so the Projects page shows an honest empty state. The profile switcher stores display names in this browser; it does not sign users in or connect account data. Workspace and upload settings live in `src/config/site.ts`; the API base URL and workspace name come from environment variables; theme values are CSS variables in `src/app/globals.css`.

## Pages

- `/` — dashboard and feature overview
- `/projects` — saved analysis projects (empty until the API and database are connected)
- `/resources` — image preparation guide, workflow, and API integration status
- `/organisations` — team workspace status
- `/about` — project overview and planned workflow

## Available commands

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve the production build
- `npm run typecheck` — run the TypeScript checker
