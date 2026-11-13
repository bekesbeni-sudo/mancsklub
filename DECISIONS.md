# Decisions

## 2026-11-06

- **Domain:** mancsklub.hu is owned by Benjamin, registered 2026-11-05 at Domdom.
- **Stack:** Next.js on Vercel Pro and Supabase Pro, both in Frankfurt, in new accounts separate from Sleeve. About $45 a month, paid only from launch.
- **Launch gate:** build now, but go live only after the trademark lawyer's opinion.
- **Data controller:** wait for the company. The forms cannot open in production until `site.controller` is filled in.
- **Landing page packages:** show all four, including Prémium Max, all marked as planned.
- **Repeat waitlist emails:** ignored, with the same success message. Without email verification, anyone could otherwise change someone else's answers or consent, or find out who has signed up.
- **Database access:** the app connects from the server only, so the public Supabase API has no access to signups.
- **Payments (proposed, confirm before Phase 1):** Stripe Billing for the pilot, with a Barion quote once volume grows.
- **Focus change:** Benjamin already has a landing page and design, and wants to build the system next (clinics, credits, payouts). The landing page built here may be replaced. The final design is still to come from Benjamin.
- **Credits:** per pet, per year. Counted services (for example 1 exam) plus forint allowances where a package has one. The system supports both. No points system.
- **Packages:** landing v12 (2026-11-06) is the source for package fees and contents, including forint allowances (parasite, dental) and the different cat vaccines. This replaces section 3 of the brief.
- **Clinic prices:** partner offer v03 (2026-11-03), gross, chosen by Benjamin after comparing it with the brief's prices. This replaces section 4 of the brief. The offer has no X-ray price, and no package includes X-ray, so that seeded price stays unused.
- **Minimum term:** 12-month commitment.
- **Build order:** admin, owner account, clinic portal, monthly settlement, then payment and invoicing, which wait for the company.
- **Corrections:** a redemption is never edited. A reversing entry is added, and if the original is already settled, the reversal lands in the next settlement.
- **Assumed from the brief and the partner offer, confirm:** entitlements expire at the end of the membership year. Payable lines stay payable after a member cancels. Clinic overrides beat the general price.
- **Design:** the design language in `03 Brand/4 Brand guidelines` (2026-11-06) is the source for all screens. Tokens and components are copied to `src/styles`.
- **Staff logins:** own simple login for now, so the portals work without outside accounts. One admin (username `admin`, password from `ADMIN_PASSWORD`) and clinic users created by the admin. Owners get their login with the owner account work.
- **Owner login:** email link, no password (the brief allows either). A link lasts 15 minutes, works once, and needs a button press, because mail scanners open links on their own. One request a minute and five an hour per owner. A login lasts 30 days.
- **Owner accounts for now:** the admin creates members, and owners only log in and look. Self-signup, choosing a package, adding a pet and changing plan come with card payment, so they wait for the company.
- **What owners see:** their pets, remaining entitlements, visits, membership card, and active partner clinics. They do not see what a clinic is paid, or corrected entries.
- **QR code:** holds only the member code, so a scanner works like typing it in at the clinic lookup.
- **Landing page:** landing v12 is now the real home page, ported to `src/components/landing` and `src/styles/landing.css` (scoped to `.pw`). Fees and allowances come from the database, text from `hu.ts`. The clinic and privacy pages use the same header and footer.
- **Waitlist form:** follows landing v12: species, pet name, package, email. It no longer asks for location, current clinic, pet count, or marketing consent, and the privacy checkbox became a link to the policy. The brief wanted location and clinic for recruitment, so Benjamin should confirm this.
- **Clinic visibility:** a clinic sees a member's remaining entitlements, but only its own visits and statements.
- **Staff login link:** the landing footer's last link is now "Staff login" to `/belepes`, the only landing change Benjamin asked for. Owners reach their own login through the link on `/belepes`.
- **Backend connections:** a waitlist signup becomes a member from `/admin/varolista`, and the signup keeps a link to that membership. A clinic enquiry becomes a prospect clinic from `/admin/rendelok`, and keeps a link to that clinic. Owners and pets are edited at `/admin/gazdik`.
- **Pet species:** cannot be changed after a pet is created, because a membership's entitlements depend on it. A wrong species means adding the pet again.
- **Waitlist CSV:** a logged-in admin can download it directly. The export password still works too.

## 2026-11-13

- **Landing page:** replaced with the mancsklub-web package (2026-11-12). The markup is generated from its `index.html` into `src/components/landing/LandingView.tsx`, the page logic is in `Landing.tsx`, and all texts are in `hu.ts`. Side by side with the original it matches on desktop and phone.
- **Brand spelling and logo:** the design writes the name in lowercase, so `site.name` is now "mancsklub", and the design's logo image is used (`site.logo`). Contact address is info@mancsklub.hu. Both still live only in `src/config/site.ts`, so a rename after the trademark opinion stays cheap.
- **Six packages, no prices:** the landing shows Kölyök, Alap, Plusz, Prémium, Prémium Max and Senior with "Ár hamarosan!". Their contents are landing copy in `hu.ts`. The database catalogue still has the four landing v12 packages with their fees and entitlements, so it no longer matches the landing. Signups may now name any of the six.
- **Signup form:** four steps (email, species, pet name, package), saved to the waitlist. The clinic box at the bottom saves to `clinic_suggestions`, linked to the signup when the visitor has just signed up, and shows up under "Legtöbbször kért rendelők" in the admin.
- **Footer:** the design's footer plus "Staff login". The "Rendelőknek" link was dropped to keep the design's single row, so the clinic page is reachable only by its address for now.
- **Fix to the design:** with reduced motion turned on, the headline stayed invisible in the original. It now shows.
- **Still placeholders:** the Facebook and TikTok links, as in the design package.
- **Go live now:** Benjamin decided to launch the landing page without waiting for the trademark opinion, accepting the risk of a later rename. This replaces the launch gate from 2026-11-06.
- **Vercel:** the project goes into Benjamin's existing "Bekes" Pro team, next to Sleeve, to avoid a second Pro plan. Sleeve's project is not touched. This replaces "new accounts" for Vercel; Supabase stays in its own organisation.
- **Sleeve paused (2026-11-13):** at Benjamin's request the `sleeveclub` Vercel project is paused (site returns 503, nothing deleted, can be resumed in the Vercel dashboard). Its Supabase project was already inactive.
- **Vercel settings (2026-11-13):** framework preset Next.js; Vercel Authentication protects preview deployments only, so production is public. Live at mancsklub.vercel.app until the domain is connected. Forms stay closed in production until `site.controller` is filled.
- **Data controller:** Mancsklub Kft. Its address and registration number go in `site.controller` before the forms open.

## Still open

- **Package margins:** at partner offer prices, a dog using everything in a year costs 33 400 Ft in Alap (fees 41 880), 82 600 Ft in Plusz (83 880), 127 400 Ft in Prémium (119 880) and 200 800 Ft in Prémium Max (179 880), allowances counted in full. Prémium and Prémium Max lose money at full use, so check them against expected usage.
- Owner account, not built yet: naming a home clinic or a clinic to recruit (waits for the home clinic rule), a map of clinics, editing pet details, discount visits in the visit history.
- Landing placeholders to fill in: Facebook and TikTok links. The cost estimates (300 to 600 and 180 to 400 thousand Ft, with their sources) and the "egész Magyarországon" and "országszerte" claims need a check before launch, as no clinic has signed yet.
- Privacy policy: needs legal review, including the retention period. The new signup form no longer links to it next to the email field (only the footer does), so ask the lawyer whether that is enough.
- Brief section 7: home clinic only or any partner (the code currently allows any active partner), waiting period, age limits, pet death or rehoming, legal entity. Also what an early cancellation costs under the 12-month commitment.
- Invoicing provider: ask the accountant.
- Survey hot leads: import only those who consented to contact.
