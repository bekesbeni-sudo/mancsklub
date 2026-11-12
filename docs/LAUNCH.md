# Launch checklist

Benjamin decided on 2026-11-13 to launch without waiting for the trademark opinion. The data controller is Mancsklub Kft.

Claude can do the technical steps. The steps marked "you" need your accounts, passwords or payment.

## Before accounts

1. Get the privacy policy (`src/messages/hu.ts`, section `privacy`) reviewed by a lawyer, including how long data is kept. Then remove the "draft" line and update `privacyVersion` in `src/config/site.ts`.
2. Fill in `controller` in `src/config/site.ts` with the company's name, address and registration number.

## Accounts (you)

3. Create a GitHub account or use your existing one, and a new private repository called `mancsklub`.
4. Create a new Supabase organisation on the Pro plan and a project in the Frankfurt region (Central EU). Save the database password somewhere safe.
5. Create a new Vercel team on the Pro plan and import the GitHub repository. Set the function region to Frankfurt (`fra1`).
6. Create a Resend account, check its current price, and add `mancsklub.hu` as a sending domain in the EU region.

## Connect everything

7. Apply the database setup: `npx supabase link`, then `npx supabase db push`.
8. In Vercel, add the settings from `.env.example`: `DATABASE_URL` (Supabase's transaction pooler address), `ADMIN_EXPORT_PASSWORD` and `ADMIN_PASSWORD` (new long passwords, not the local test ones), `SESSION_SECRET` (at least 32 random characters), `RESEND_API_KEY`, and `FORMS_OPEN=true`.
9. In Vercel, add `mancsklub.hu` and `www.mancsklub.hu`. Vercel shows the DNS records to create.
10. (You) In your Domdom account, add those DNS records, plus Resend's records. Keep any mail records you use, and set up `info@mancsklub.hu` so that address actually receives mail.

## Test on the live site

11. Submit the waitlist form with a real email of yours, and check that the confirmation email arrives.
12. Submit the same email again, and check that nothing changes.
13. Submit the clinic form.
14. Download both exports from `/admin/export/waitlist` and `/admin/export/clinics`.
15. Create a test member in `/admin` with a real email of yours, request a login link at `/gazdi/belepes`, and check that the email arrives and the link opens the account. Owners cannot log in without `RESEND_API_KEY`.
16. Check the site on a phone, delete the test rows, and add a rate limit to the forms, `/belepes` and `/gazdi/belepes` in Vercel's firewall, because the staff login has no attempt limit of its own yet.

The connection to Supabase and the real sending of emails can only be tested here, because they were not available during the build.
