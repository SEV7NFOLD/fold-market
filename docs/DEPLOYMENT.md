# Deploying SEV7N FOLD Storefront

## What works before setup

The app includes a Prime Kare demo storefront, product details, a client-side cart, and product illustrations. The cart is a visual demo only: it does not create an order, reserve stock, collect payment, or send customer data.

## Create Supabase services

1. Create a Supabase project and run the numbered SQL files in `supabase/migrations/` in order from its SQL editor.
2. Create an Auth user for the vendor owner. Email/password sign-in is implemented; turn off public sign-ups in Supabase Auth after creating authorized team accounts.
3. Create each vendor row in the SQL editor. Assign each production domain to this Vercel project and save its hostname in `custom_domain`. Example:

   ```sql
   insert into public.vendors (name, handle, custom_domain, logo_url, accent_color, currency)
   values ('Prime Kare', 'prime-kare', 'shop.example.com', '/brand/prime-kare-transparent.svg', '#e90000', 'NGN')
   returning id;
   ```

4. Link that vendor to the signed-up owner by replacing both values below:

   ```sql
   insert into public.vendor_memberships (vendor_id, user_id, role)
   values ('VENDOR_UUID', 'AUTH_USER_UUID', 'owner');
   ```

5. Add products in `/admin` after signing in. Admins can upload JPEG, PNG, WebP or AVIF images up to 5 MB, or use a public HTTPS image URL. Uploads go into vendor UUID folders in the public `product-media` bucket; Storage policies scope writes to that vendor's members.

## Environment variables

Copy `.env.example` to `.env.local` for local development, or add the same values to Vercel Project Settings → Environment Variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key (or legacy anon key); RLS protects database access |
| `NEXT_PUBLIC_VENDOR_HANDLE` | Default storefront handle for local development and Vercel preview URLs (default `prime-kare`); configured production domains select their vendor from `vendors.custom_domain` |
| `NEXT_PUBLIC_PLATFORM_NAME` | Storefront attribution label (default `SEV7N FOLD`) |
| `NEXT_PUBLIC_PLATFORM_URL` | Official SEV7N FOLD website. Current `.example` value is a placeholder and must be replaced. |
| `NEXT_PUBLIC_VENDOR_CONTACT_EMAIL` | Optional vendor enquiry address. It enables the enquiry buttons in the demo; it is not a payment checkout. |
| `NEXT_PUBLIC_STORE_DOMAIN` | Optional canonical storefront domain override for metadata; otherwise the selected vendor domain is used |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional trusted server-job key. Not used by the storefront and must never be exposed to a browser. |

Use the publishable/anon key, never the service-role key, for the browser-facing app. The Supabase project is configured; add the two `NEXT_PUBLIC_SUPABASE_*` values to the linked Vercel project's Preview and Production environments and redeploy if they are not already present.

## Deploy on Vercel

1. Import this repository into Vercel and choose Next.js.
2. Set the environment variables above for Preview and Production.
3. Deploy. The project uses `npm run build`; Vercel detects Next.js automatically.
4. In Supabase Auth URL Configuration, set the deployed Vercel URL as the site URL and add it to redirect URLs.
5. Replace demo vendor branding, contact information, product copy, image assets, and the SEV7N FOLD website placeholder before production.

## Current integration limits

- Checkout, payment capture, order management, tax, shipping rates, and inventory reservation are not implemented.
- Product and chef-service illustrations included with the demo are placeholders. Replace them with the vendor's approved photography before launch.
- Customer accounts, order tables, email marketing, vendor self-service onboarding, and a full branding editor are not implemented.
- Production vendor storefronts resolve from each active vendor's `custom_domain`. Add every domain to this Vercel project; unmapped hosts use the configured default handle.
- The admin accepts JPEG, PNG, WebP and AVIF images up to 5 MB and stores them in the vendor-scoped public `product-media` bucket; an HTTPS image URL is also supported.
- Demo copy and product claims are illustrative and need brand confirmation before launch.
- Without Supabase credentials the storefront uses the local Prime Kare demo content. Once credentials are configured, it reads the selected active vendor and its published catalog; an unconfigured vendor handle shows an empty state until that vendor is created and populated.

