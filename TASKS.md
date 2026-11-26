# TASKS: crumbandco
Source: `docs/redesign-plan.md`. Sizes: XS 1 file, S 1-2, M 3-5 (bigger = split). Verify: `npm run build` + 375px/1440px screenshots.
Definition of done (extras): reduced-motion fallback for every effect; no pinning under 768-900px; order flow still works; no schema/RLS changes without Yousef's go.

## [ACTIVE]
- [ ] 4.10 Yousef: Supabase Auth URL Configuration: Site URL `https://crumbsnco.vercel.app`, Redirect URLs `http://localhost:3000/**`, `https://crumbsnco.vercel.app/**` (fixes login landing on the old crumbandco.vercel.app). (A)

## [QUEUED]
- [ ] 4.2 Supabase dashboard (Yousef): add `<site>/reset-password` to Auth → URL Configuration → Redirect URLs (localhost:3000 and the live domain). AC: reset email link opens the new-password form. (A)

## [PAUSED]
## [COMPLETED]
- [x] 4.9 DB trigger prices every order from `cookies` (+50 delivery), rejects bad items; cart shows the fee. Checks: rolled-back anon inserts, cart 2x55+50=160. Server-side email codes were built, then reverted on Yousef's request (keep it as before, no setup). 2026-11-26
- [x] 4.8 /code-review (8 findings) + simplify: 5 fixed (login redirects, dead /checkout, sweep, phone Admin link, badge timers); 743 lines of dead code removed. Build passes; /order and home checked on prod build. e660acb. 2026-11-26
- [x] 4.6 crumbsandco: `fix/checkout-order-id` merged into `CrumbsandCo-v2` (d39ff85, pushed; preview build passes). Production still on bdc924f until the next promote. 2026-11-26
- [x] 4.4 Live checkout fixed and deployed to production (crumbsnco.vercel.app, from crumbsandco `fix/checkout-order-id`); temporary orders read policy dropped; anon insert works, anon sees 0 orders. 2026-11-26
- [x] 4.7 Footer: Admin link + "Developed by Yousef Alkady" badge linking to yousef.unilinkcampus.com; menu strip pin fixed (crack-open no longer overlaps it). 2026-11-26
- [x] 4.1 Data layer adapted to the live schema: menu + admin use `cookies` (in_stock/is_hidden), orders insert/read live columns (order_number, customer_address, total_amount, items with quantity), statuses pending/completed/canceled, admin check = `rpc('is_admin')`. Prod build: add to cart, cart summary, /admin redirect for logged-out all checked; no real order placed (would write live data). 2026-11-26
- [x] 4.5 DB lockdown applied (Yousef's go): RLS so only admins read/edit orders, cookies, images; profiles own-row; signup function hardened. Anonymous checks pass. `docs/db-security.md`. 2026-11-26
- [x] 0.0 Research: current UI, portfolio v3 motion, Instagram brand; IG posts + Yousef's photos in `public/photos`, `public/instagram`. 2026-11-26
- [x] 1.x Foundation: Tailwind v4 `@theme` tokens (old class names mapped), next/font (Bricolage variable, Shrikhand, Fredoka), one Nav/Footer in `_app`, Lenis + GSAP motion (parallax, line reveals, pink page curtain, cursor + magnetic). 2026-11-26
- [x] 2.x Home: preloader, hero (mask rise, weight sweep, cursor-repel tagline, parallax photos/doodles), scroll-velocity marquee, AI-SDK-style feature grid, pinned menu strip, crack-open scrub (phones too), card-stack how-it-works, dealer band, Instagram wall. 2026-11-26
- [x] 3.x Pages: menu grid + fly-to-cart, cart summary column ("Your box"), Pick up removed (always Ship), login restyle + "Forgot password?" → `/reset-password`, about, contact, admin redesign (stat tabs, search, order cards, product in-stock/on-menu toggles). Photos edge-trimmed. Publishable key updated to the project's current key. 2026-11-26
  Checks: `npm run build` passes; prod build 0 console errors on /order at 1440 and 375, no sideways overflow at 375; 960x600 (150% zoom) checked for menu strip + crack-open. Branch `redesign`, not merged, not deployed.
### Checkpoint 1-3: done on branch `redesign`; Yousef reviews on phone + desktop.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| REMAINING: leaked-password protection off in Supabase Auth | weak passwords allowed | Yousef enables in dashboard |
| REMAINING: orders can still be inserted straight through the API without an email code | unverified orders possible (prices are safe) | route both sites' checkout through a server endpoint, then close anon insert |
| REMAINING: Gmail app password is written in src/pages/api/send-otp.js and send-receipt.js (kept on Yousef's request) | anyone with the code can send mail as that account | move to env vars and rotate when convenient |
| Admin product toggles write to the DB | live menu changes on click | only an admin can, RLS must enforce it (check in 4.1) |
| IG scrape images are 640px | soft on big screens | Yousef's 1206px photos used where possible |
| Dev server on :3000 started before these changes shows HMR errors | stale behaviour in dev | restart `npm run dev` |

## Open questions
- Decided (Yousef, 2026-11-26): price orders in the DB (done, 4.9); keep the email code step as it was.
- Decided (Yousef, 2026-11-26): adapt this repo to the live schema (Q5); fix the database security.
- (A) Q6. Enforce "minimum box of 2" at checkout (now only a notice)? -> Yousef
- (C) Q3. Full-res logo/mascot, cutout cookies, plain photo of Midnight & Milk -> Lana via Yousef
- Decided (Yousef, 2026-11-26): go with the plan, portfolio as motion reference, vercel.com/ai-sdk as layout helper; remove Pick up; add password reset without forcing existing accounts to reset.
