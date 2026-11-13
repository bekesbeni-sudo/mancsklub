@AGENTS.md

# Mancsklub project notes

- Brief: `docs/BRIEF.md`. Decisions: `DECISIONS.md`, add to it with the date. Launch steps: `docs/LAUNCH.md`.
- Owner is not a developer: explain in plain language, give exact steps for anything they must do.
- Work in the brief's phases and stop for approval between them. Ask about the open business rules in brief section 7, don't invent them.
- Hungarian UI, English code and docs. All user-facing text lives in `src/messages/hu.ts`. No em dashes in user-facing text or docs.
- The brand name and logo live only in `src/config/site.ts`, because the trademark opinion is pending.
- Nothing price-related is hardcoded: packages and services live in the database. Database changes go in `supabase/migrations`.
- Private tables get RLS with no public grants. New tables need explicit grants and RLS in the same migration.
- Never print `.env.local` values.
- With no `DATABASE_URL`, development uses a local Postgres in `.local-data`, built from the same migrations. Delete that folder to reset it.
- Run `npm test` for the tests. While the dev server is running, check builds with `npm run build:check`, never `npm run build`.
- Design source: `/Users/bekesbeni/Desktop/Projects/PetHelp/03 Brand/4 Brand guidelines (deliverable)/2026-11-06_MancsKlub-design-language`. Portal styles are in `src/styles`.
- Portals: `/admin` and `/rendelo`, login at `/belepes`. Owner account: `/gazdi`, login link at `/gazdi/belepes`. Every private page and server action must call `requireAdmin`, `requireClinic` or `requireOwner`. A clinic's or owner's id always comes from the login, never from a form, and owner queries in `src/lib/owner.ts` must filter by owner.
- Landing: `LandingView.tsx` is generated from the design package's markup, `Landing.tsx` holds its logic, texts are in `t.landing`. Styles in `src/styles/landing.css` are scoped to `.pw` and sit in Tailwind's components layer.
- Admin queries for the waitlist, enquiries, owners and pets are in `src/lib/admin-queries.ts`. Private pages set `export const instant = false` and call `await connection()`.
- Without `RESEND_API_KEY`, the owner login link is printed in the dev server log.
- Local test login: username `admin`, password in `.env.local`.
- Admins have own accounts in `admin_users`, managed on `/admin/csapat` (`src/lib/admin-users.ts`). The shared `admin` login is the fallback. Password links are printed in the dev server log when there is no `RESEND_API_KEY`.
