# SEV7N FOLD Storefront

A reusable, mobile-first vendor storefront for the supplied Prime Kare demo brand. It uses Next.js, TypeScript, Supabase Auth/Postgres/Storage, and Vercel.

## Run locally

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`. Leave the Supabase values empty to use the demo catalog, or configure a Supabase project as described in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
3. Run `npm install`, then `npm run dev`.
4. Open `http://localhost:3000`. The vendor studio is at `/admin`.

The storefront demo cart is not a checkout. It does not accept payment, create orders, or reserve inventory.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the database migration, owner account setup, environment variables, security model, and Vercel steps.
