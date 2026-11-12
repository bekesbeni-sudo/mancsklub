# Mancsklub: project brief for Claude Code

Last updated: 2026-11-06. Owner: Benjamin Bekes (Budapest).
Put this file at the repo root as `CLAUDE.md`, or reference it from there.

## 1. What Mancsklub is

Mancsklub is a Hungarian membership for pet owners (dogs and cats). The model follows PetHELP in Poland.

- The owner pays a **monthly fee per pet** for a package of routine vet services: check-up, vaccinations, grooming items, blood tests, imaging.
- The owner uses those services at **partner clinics** (rendelők).
- Mancsklub pays the clinic a **fixed, pre-agreed price per service used**, about 70% of the Budapest median list price. In return the clinic gets steady, prepaid patients.
- The owner also gets a **discount at partner clinics on unplanned care**. The working figure is 10-15%, and it depends on what each clinic agrees to.
- Later: an **optional pet insurance add-on** through a separate insurance partner. Mancsklub earns commission on it.

Status: pre-launch. The name is decided. Packages and owner prices are mostly decided. **No clinic has signed yet.** Clinic prices are proposals that still need to be checked with one or two clinics. Treat every price below as configuration, not a constant.

## 2. Evidence so far (owner survey, 482 valid responses, Oct-Nov 2026)

- 53% would subscribe (6-7 on a 7-point scale). 203 respondents (42%) are "hot leads": 6-7 points and willing to pay at least 5 000 Ft/month. These are the first people to contact at launch.
- Median price they called a good deal: 6 000 Ft/month. Cat owners: 5 000 Ft. Dog-only owners: 6 500 Ft.
- 52% have two or more pets. Build multi-pet support from day one.
- 70% go to one regular clinic, and 54% are strongly attached to their vet. Clinic recruitment will follow the clinics our members already use. The product must let a member say "my clinic is X, please onboard them".
- The real pain point is unexpected costs, not planned care. This is why the unplanned-care discount and the insurance add-on matter.
- 77% buy from webshops or pet stores, which is a possible acquisition channel.

## 3. Packages (current version, 2026-11-04)

Prices are in HUF per pet per month, gross. Entitlements reset each membership year.

| Package (code) | Monthly fee | Annual entitlements | Status |
|---|---|---|---|
| Alap (`ALAP`) | 3 990 | 1 general check-up, 1 rabies + combined vaccine in one shot, nail clipping, anal gland expression, ear cleaning | decided |
| Plusz (`PLUSZ`) | 7 490 | Alap + 1 sick visit, basic blood panel (with draw) | decided |
| Prémium (`PREMIUM`) | 9 990 | Alap + 1 sick visit, extended blood panel (replaces basic), urinalysis, abdominal ultrasound | decided |
| Prémium Max (`PREMIUM_MAX`) | 14 990 | Prémium + 2nd check-up, follow-up visit, stool test, blood pressure, X-ray (first image) | proposal |

Still open: a cheaper or different **cat package**, a **multi-pet discount**, whether the **check-up and vaccine are one visit** (three clinics already include the exam in the vaccine price), the minimum term (see section 7), and the dental discount.

## 4. Fixed prices paid to clinics (provisional)

| Service code | Hungarian name | Price to clinic (Ft) | Budapest median (Ft) |
|---|---|---|---|
| `EXAM` | Vizsgálat | 13 000 (fallback 14 000) | 18 250 |
| `SICK_VISIT` | Betegvizit | 13 000 | (same as exam) |
| `FOLLOWUP` | Kontroll | 8 500 | 12 000 |
| `VAX_RABIES` | Veszettség oltás | 8 500 | 12 000 |
| `VAX_COMBINED` | Kombinált oltás (kutya/macska) | 10 500 | 15 000 / 14 500 |
| `VAX_RABIES_COMBINED` | Veszettség + kombinált egy oltásban | 13 000 | 18 600 |
| `NAILS` | Karomvágás | 3 500 | 5 000 |
| `ANAL_GLAND` | Bűzmirigy | 4 000 | 5 500 |
| `EAR_CLEAN` | Fültisztítás | 5 000 | n/a |
| `BLOOD_BASIC` | Rutin vér vérvétellel | 21 500 | 30 500 |
| `BLOOD_EXTENDED` | Bővített vér | 25 000 | too little data |
| `URINE` | Vizelet | 4 000 | too little data |
| `STOOL` | Széklet | 7 000 | too little data |
| `BLOOD_PRESSURE` | Vérnyomás | 5 500 | 8 000 |
| `ULTRASOUND_ABD` | Hasi ultrahang | 17 000 | 22 900 |
| `XRAY` | Röntgen (első felvétel) | 14 000 | 20 000 |

Cost to clinics per pet per year at full use: Alap 38 500, Plusz 73 000, Prémium 97 500, Prémium Max 145 500 Ft.
Pricing is uniform today. The data model must still allow **per-clinic price overrides** and **price changes with effective dates**, because settlements must use the price that applied on the day of service.
The underlying research (20 clinics, sources) is in the claude.ai project "Pethelp", in `claude/rendeloi-arak-2026-11.md`.

## 5. Users and core flows

**Pet owner (gazdi)**, web, mobile-first, Hungarian UI
1. See the packages and pick one per pet.
2. Register with email and password or a magic link, then add pets: name, species, sex, birth date, breed, microchip number (optional at signup).
3. Choose a home clinic from the partner list, or name a clinic that is not a partner yet. This is a lead for clinic recruitment.
4. Pay monthly with a card on file (recurring). Get an invoice every month.
5. Dashboard: entitlements used and remaining per pet for the current year, visit history, partner clinic list or map, and a digital membership card (QR code + member ID).
6. Manage the plan: upgrade, downgrade, cancel, update the card, add a pet.

**Partner clinic (rendelő)**, web portal used at the front desk
1. Look up a member by QR scan, member ID or microchip number. See whether the pet is active and which entitlements remain.
2. Record the services given at a visit. Each service decrements an entitlement and creates a payable line at the clinic's agreed price. Corrections and voids are allowed, with an audit trail.
3. Record a discounted unplanned-care visit with its amount. This is for reporting; the owner pays the clinic directly.
4. Monthly statement of services to be paid, downloadable.

**Mancsklub admin**
- Manage clinics (contract status, agreed prices, discount %, location, contacts), the package catalogue, service codes and prices with effective dates.
- Members and pets: search, edit, refunds, manual adjustments.
- Monthly clinic settlement: lock the period, export, mark as paid.
- Simple metrics: active members by package and species, MRR, churn, entitlement usage vs. cost per member, the "requested clinic" leaderboard.

## 6. Suggested phases (confirm with Benjamin before building)

- **Phase 0, pre-launch (now):** Hungarian landing page on mancsklub.hu explaining the packages, a member waitlist (pet count, species, district or town, current clinic, package of interest), and a separate "for clinics" page with an interest form. Import the survey hot leads only if they consented to contact.
- **Phase 1, pilot MVP (1-3 clinics):** owner signup + recurring payment + invoicing, entitlement tracking, clinic portal for lookup and redemption, admin and monthly settlement export. Manual processes are fine where volume is low.
- **Phase 2:** insurance add-on with the partner, multi-pet and family pricing, cat package, referral codes, marketing integrations, clinic map, possibly a mobile app wrapper.

## 7. Product and business rules to settle (ask, don't assume)

1. **Minimum term / anti-abuse.** Entitlements are annual but payment is monthly. Without a rule, an owner can join, use the whole year's services in month one, and cancel. Options: 12-month commitment, entitlements that unlock month by month, or an early-cancellation charge for the value used beyond fees paid. This is the most important rule to decide before Phase 1.
2. Waiting period for new members, or for pets over a certain age.
3. Age limits and whether senior pets get different packages (8+ year-old pet owners were more cautious in the survey).
4. Whether unused entitlements expire at the end of the membership year (assume yes).
5. Can a member use any partner clinic, or only their home clinic?
6. What happens when a pet dies or is rehomed (pro-rata refund, transfer).
7. Who issues the invoice and the legal entity (the company is not set up for this yet). VAT treatment is deliberately not analysed yet. Keep amounts gross and leave room for VAT later.

## 8. Technical constraints and decisions to make

- **Language and locale:** UI in Hungarian, with code, comments and docs in English. HUF with no decimals and a space as the thousands separator ("3 990 Ft"). Dates as YYYY.MM.DD. Europe/Budapest timezone. Add i18n support so English can come later.
- **Payments:** recurring card billing in HUF is required. Candidates: Stripe (Billing), Barion, OTP SimplePay. Compare fees, recurring and token support, and SCA handling, then propose one. Store no card data ourselves.
- **Invoicing:** Hungarian invoices must be reported to NAV (Online Számla). Use an invoicing provider with an API (for example Számlázz.hu or Billingo) instead of building our own.
- **Privacy:** GDPR. We hold owner personal data and pet health-related visit data. Data minimisation, a clear privacy policy, consent for marketing kept separate from the service, EU hosting.
- **Clinic portal:** must work on an ordinary front-desk PC browser and on a phone or tablet for QR scanning. Keep it fast and simple, since receptionists use it mid-shift.
- **Configurability:** packages, services, prices, discounts and clinic terms live in the database and are editable by admins. Nothing price-related is hardcoded.
- **Audit:** every redemption, correction, price change and settlement is logged with who did it and when.
- **Stack:** not chosen. Propose a simple, well-supported stack that one person can maintain, with managed hosting in the EU, and explain the trade-offs before scaffolding.

## 9. Brand and naming notes

- Name: **Mancsklub** ("paw club"). Domain mancsklub.hu was free on 2026-11-05 but **is not registered yet**. Registering it is an open task.
- A registered word mark **MANCS** exists in class 44 (veterinary services), along with other "mancs" marks. A trademark lawyer's opinion is pending. Until then, keep the name in config and in one place in the UI and copy, so a rename is cheap. Don't build logos or brand assets yet.
- Tone: friendly and plain-spoken Hungarian, aimed at committed pet owners. No insurance jargon.

## 10. How to work on this

- Before writing code, read this brief, then propose: (a) the stack, (b) the data model, and (c) the Phase 0 and Phase 1 scope. Wait for Benjamin's OK.
- Ask when a business rule in section 7 blocks a design choice. Don't invent one silently.
- Keep a `DECISIONS.md` log of decisions as they are made, with the date.
- Test the money logic heavily: entitlement accounting, settlement amounts, proration, price effective dates.
- Writing preference: no em dashes in user-facing text or docs.
