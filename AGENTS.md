# AGENTS.md

## Cursor Cloud specific instructions

This is **Ant Design Pro** — a frontend-only React/UmiJS (Umi Max) enterprise admin dashboard. There is **no backend, database, or docker**; API data is served by an in-process mock server (`mock/**` + `src/pages/**/_mock.ts`) that runs automatically inside the dev server.

### Services
There is a single service: the Umi dev server (the React SPA). Standard commands live in `package.json` scripts; notable ones:
- `npm start` — dev server **with mocks enabled**, on `http://localhost:8000` (use this for local development/testing).
- `npm run dev` / `start:dev` — dev server with mocks **disabled** (`MOCK=none`); expects a real/proxied API, so most flows show no data. Prefer `npm start` locally.
- `npm run lint` — Biome lint + `tsc --noEmit`.
- `npm test` — Jest.
- `npm run build` — production build (not needed for dev).

### Non-obvious notes
- Node `>=20` is required. CI uses `bun`, but local dev/lint/test are driven by **npm** (`.npmrc` sets `legacy-peer-deps=true`, needed for the React 19 peer deps).
- `npm install` triggers `postinstall` (`max setup`) and `prepare` (husky git hooks) automatically.
- Mock login credentials: username `admin` (or `user`), password `ant.design`.
- Startup logs print many `... is duplicated in mock/...` warnings and `Jest did not exit one second after...` — both are harmless/expected, not errors.
- `npm run lint` currently emits 1 Biome warning + 1 info in `AvatarDropdown.tsx` but exits 0 (pre-existing, not a failure).
