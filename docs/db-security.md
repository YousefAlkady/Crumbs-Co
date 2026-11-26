# Database security fix (live Supabase project CrumbandCo)

Applied 2026-11-26 with Yousef's go. SQL: `supabase/migrations/20261126_lock_down_rls.sql` (migrations `lock_down_rls` + `harden_handle_new_user`).

## What was wrong
- Anyone with the public key could read every order (names, phones, addresses, emails). Checked: 25 rows came back to an anonymous request.
- Any signed-up user could insert/update/delete cookies, update orders, and upload/delete menu images.
- `profiles` (including `is_admin`) was readable by everyone.
- The signup trigger function `handle_new_user` could be called through the API.

## What it is now (checked after applying)
| Table | Anyone | Signed-in customer | Admin (`profiles.is_admin`) |
|---|---|---|---|
| cookies | read | read | read, insert, update, delete |
| orders | insert | insert | read, update, delete |
| profiles | none | own row | all rows |
| cookie-images bucket | view | view | upload, change, delete |

Anonymous check: orders `[]`, profiles `[]`, cookie update changes 0 rows, menu still returns 9 cookies.
Admins: crumbncobylana@gmail.com and yoyoalk@gmail.com (Lana's account was set to admin; it was `false`).

## Live checkout fix (done 2026-11-26)
The temporary 30-second read policy is gone. crumbsandco branch `fix/checkout-order-id` (commits c81530e, bdc924f):
the checkout creates the order id with `crypto.randomUUID()` and no longer reads the order back; plus the
one-line tailwind `darkMode` fix so a fresh install builds. Deployed to production (crumbsnco.vercel.app,
deployment dpl_4YyjNK75QaqPF7nTFfbbHf2ce95u). Checked: live checkout bundle contains the new code; a rolled-back
anonymous insert succeeds and sees 0 orders. Not merged into `CrumbsandCo-v2` yet (that branch also has c67b6ad).

## Orders are priced by the database (2026-11-26, migration `price_orders`)
Trigger `orders_price` (before insert) replaces each item's price/name with the `cookies` row, sets
`total_amount = items + 50 delivery` and `status = 'pending'`, and rejects unknown, hidden or out-of-stock cookies,
quantities outside 1-50 and empty orders. Live orders already had exactly this shape (checked: items + 50).
Checked as anon in rolled-back transactions: price 1 / total 1 / status completed -> stored 350 / 750 / pending;
the four bad cases are rejected; nothing left behind.

## Email codes
Kept as before (code made in the browser, emailed by /api/send-otp), on Yousef's request (2026-11-26): no setup, and prices are protected by the trigger above.

## Still open (advisor)
- `is_admin()` is callable through the API: it only tells the caller whether *they* are an admin. Accepted.
- Leaked password protection is off: Supabase dashboard → Auth → Passwords → enable (Yousef).
