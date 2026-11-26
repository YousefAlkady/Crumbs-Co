# Crumb & Co. — UI/frontend redesign plan

Date: 2026-11-26. Status: draft, waiting for Yousef's go. Nothing built yet.
Scope: frontend look + motion only. No changes to Supabase schema, RLS, order logic, OTP or receipt APIs.

## 1. What exists today (findings)
- Next.js 16, **Pages Router** (`src/pages/*`; the PRD says App Router, it is not), Tailwind v4, framer-motion, Supabase.
- **Bug: Tailwind v4 never loads `tailwind.config.js`** (no `@config`/`@theme` in `globals.css`). So `bg-cream`, `border-chocolate`, `shadow-sticker`, `font-chewy`, `text-pastel-hotpink` produce nothing; `index.js` works around it with hard-coded `#FFF8E7`/`amber-900`. Every page except home is partly unstyled.
- Home has its own inline header; other pages use `Navbar.jsx` → two different navs.
- Fonts loaded 3 ways (CSS `@import`, per-page `<link>`, none via `next/font`).
- Home "Best sellers" are hard-coded emoji cards, not real products.
- Look today: generic cream + amber "sticker" cards. It does not match the real brand.

## 2. Brand, taken from Instagram @crumbnco.__ and the menu images in `iamges/`
- Name on IG: "Crumb & Co. by Lana". Bio: "Sharing Joy, Crumb by Crumb", "inside bakes N' More", delivery.
- Colours seen in posts: hot pink (logo/script), deep maroon-brown (MENU, prices), cream/vanilla background, baby pink, **cobalt blue** (coming-soon + ganache posters), black (Midnight & Milk poster).
- Graphic language: retro rubber-hose cookie mascot, hand-drawn stars and loop arrows, curly-bracket descriptions `{…}`, bold chunky caps (MENU, PRETZEL PARTY), "Support your local cookie dealer", "You deserve a cheat day".
- Real menu items seen (names/prices come from Supabase, not from this doc): Crumb Chunk Classic, Midnight & Milk, Molten Chocolate Ganache, Pretzel Party.

Photos sent by Yousef (1206 px wide), in `public/photos/` (compress to WebP ≤ 200 KB in phase 2):
| File | Use on site |
|---|---|
| `photo-nutella-stack.jpg`, `photo-molten-choc-stack.jpg` | hero + "break it open" section (pink backdrop matches the palette) |
| `photo-bueno-cookies.jpg`, `box-assorted.jpg` | menu strip / order page backgrounds, parallax |
| `market-tray-1..3.jpg`, `market-story.jpg` | "Where we pop up" / about strip (pink branded bags visible) |
| `menu-midnight-milk.jpg`, `menu-molten-ganache.jpg`, `menu-pretzel-party.jpg` | flavour posters in the Instagram wall |
| `poster-cookie-dealer.jpg`, `coming-soon.jpg` | dark band + Instagram wall |
| `photo-classic-sea-salt.jpg` (crop off the emoji top-right) | Crumb Chunk Classic card + "break it open" (one cookie is already split) |
| `story-dough-and-box.jpg`, `story-oreo-board.jpg` (have story text/emoji baked in) | "How it works" steps (dough → box) and Midnight & Milk; Instagram wall as-is |
Low-res leftovers from the IG scrape (640 px), in `public/instagram/`: `logo-badge.jpg` (150 px, favicon/nav only until a full-res logo arrives), `photo-stack-logo.jpg`, `poster-cheat-day.jpg`, `tray-assorted.jpg`.
**Not used:** the 3 posts with a video-game character (`meme-pink-box.jpg` and the 2 sent in chat): copyright risk on a shop site. The kraft-box one also shows another brand's sticker.

## 3. Design direction: "Retro cookie poster"
- Palette tokens: `cream #FFF6EC`, `pink #FF5FA2` (logo), `blush #FFD3E2`, `cocoa #4A1E1B` (text), `cobalt #2F3BF5` (accent, one per screen), `ink #141010` (dark sections).
- Type: display = a **variable** chunky grotesk (Bricolage Grotesque, weight 200–800) so the portfolio's weight-sweep effect works; logo stays the real pink script logo (SVG/PNG from Lana); body = Fredoka (kept). Loaded with `next/font`.
- Decoration: SVG doodles (stars, loop arrows, crumbs) drawn once as a small sprite and reused; they drift with parallax.
- Cards: drop the thick 4px sticker borders; use photo-first cards with soft radius, cutout cookies on blush/cream, prices in cocoa caps.
- Light sections (cream/pink) with one dark "Midnight" section (ink) for contrast, like the Midnight & Milk poster.

## 4. Motion, reused from `portfolio website/site-v3` (no 3D, no Blender renders)
| Portfolio piece (file) | Crumb & Co. use |
|---|---|
| `LenisProvider.tsx` (Lenis + GSAP ticker) | smooth scroll site-wide |
| `Motion.tsx` parallax `data-parallax` | doodles + cookie photos drift at different speeds |
| `Motion.tsx` curtain page transition | pink curtain with page name ("Menu", "Cart") between pages |
| `Act1.tsx` masked line reveal + letter rise | hero "CRUMB & CO." and section titles rise out of masks |
| `Act1.tsx` cursor-repel words | hero tagline "Sharing joy, crumb by crumb" |
| `ExperienceStrip.tsx` pinned horizontal strip + weight-sweep marquee | "The Menu" strip on desktop; swipe row on phones |
| `CardStackFx.tsx` sticky stacked cards | "How it works" 3 steps (Pick → We bake → You eat) |
| `Cursor.tsx` dot + label pill + magnetic | cookie-dot cursor, "grab one" pill on cards, magnetic Order button (fine pointers only) |
| `Preloader.tsx` count 0–100, once per session | mascot + "baking… 0–100", ≤ 2 s |
New, small: scroll-scrubbed "break it open" (two cookie-half cutouts split apart, needs cutout PNGs), add-to-cart cookie flying into the cart pill, marquee speed follows scroll velocity.
Rules kept from the portfolio: everything off under `prefers-reduced-motion`; no pinning on phones (<900 px) — plain scroll/swipe; `ScrollTrigger.config({ ignoreMobileResize: true })`.
Libraries: add `gsap`, `@gsap/react`, `lenis` (same as portfolio). Keep framer-motion only for small UI bits already using it; no new 3D libs.

## 5. Page by page
**Home** (rebuilt): preloader → hero (rising title, parallax cookie photos + doodles, magnetic "Order now") → scroll-speed marquee of flavours → pinned Menu strip (real `products` from Supabase, sold-out stamp kept) → "break it open" scrub (optional, needs cutouts) → How it works card stack → dark "Support your local cookie dealer" band → Instagram wall (staggered reveal, links to the IG posts) → footer (IG link, delivery note, contact).
**Order/Menu**: same cards as the strip, staggered grid reveal, "Minimum order is a box of 2" doodle note, floating cart pill that bounces + flying cookie on add.
**Cart / Checkout / Login**: restyle only with the new tokens and components; no logic changes.
**About / Contact**: About uses brand story + posters; Contact = IG + phone/WhatsApp links Lana provides.
**Admin**: tokens only so it is not broken; no redesign.
Shared: one `Layout` (Nav + footer + curtain + cursor + Lenis) in `_app.js`; phone menu sheet.

## 6. Done means
`npm run build` passes; 0 console errors; screenshots at 375 px and 1440 px of every page; reduced-motion checked; Lighthouse mobile home ≥ 80 perf; order flow (add → cart → OTP → confirm) still works against the dev DB with a test account.
