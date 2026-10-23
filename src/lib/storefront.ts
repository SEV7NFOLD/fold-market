import { unstable_cache } from "next/cache";
import { createClient as createPublicClient } from "@supabase/supabase-js";
import { demoProducts, demoVendor } from "@/lib/demo-data";
import type { Product, Vendor } from "@/lib/types";
import { headers } from "next/headers";

const loadStorefront = unstable_cache(async (requestHost: string, handle: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  // Storefront reads are public. Using the anon client keeps public catalogue
  // data independent of visitor cookies so Next can safely cache it by host.
  const supabase = createPublicClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const vendorColumns = "id,name,handle,logo_url,accent_color,currency,custom_domain";
  let row = null;
  // Vercel's project hostname is not a vendor custom domain; skip that empty lookup.
  if (requestHost && !requestHost.endsWith(".vercel.app")) {
    const result = await supabase.from("vendors").select(vendorColumns).eq("custom_domain", requestHost).eq("is_active", true).maybeSingle();
    row = result.data;
  }
  if (!row) {
    const fallback = await supabase.from("vendors").select(vendorColumns).eq("handle", handle).eq("is_active", true).maybeSingle();
    row = fallback.data;
  }
  if (!row) return { vendorRow: null, products: [], promotions: [] };

  const [productResult, promotionResult] = await Promise.all([
    supabase.from("products").select("id,vendor_id,name,slug,category,price,compare_at,description,details,image_url,image_alt,accent_tone,featured,badge,inventory")
      .eq("vendor_id", row.id).eq("status", "published").order("sort_order", { ascending: true }),
    supabase.from("service_promotions").select("id,title,description,image_url,cta_label,cta_url")
      .eq("vendor_id", row.id).eq("is_active", true).order("sort_order", { ascending: true }),
  ]);
  return { vendorRow: row, productRows: productResult.data || [], promotions: promotionResult.data || [] };
}, ["public-storefront-v1"], { revalidate: 60, tags: ["public-storefront"] });

export async function getStorefront() {
  const handle = process.env.NEXT_PUBLIC_VENDOR_HANDLE || demoVendor.handle;
  const requestHeaders = await headers();
  const requestHost = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "")
    .split(",")[0].trim().toLowerCase().split(":")[0];
  const result = await loadStorefront(requestHost, handle);
  if (!result) return { vendor: demoVendor, products: demoProducts, promotions: [{ id: "demo-chef", title: "Good things are better shared.", description: "Beyond the daily ritual, Prime Kare brings the same thoughtfulness to the table. Ask us about intimate chef experiences, made with care and served with a little joy.", image_url: "/products/chef-table.svg", cta_label: "Enquire about a chef experience", cta_url: "#contact" }] };

  const row = result.vendorRow;
  if (!row) {
    const vendor: Vendor = { ...demoVendor, id: "unconfigured", handle, name: handle.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ") };
    return { vendor, products: [] as Product[], promotions: result.promotions };
  }
  const vendor: Vendor = { id: row.id, name: row.name, handle: row.handle, logo: row.logo_url || "/brand/prime-kare-transparent.svg", accent: row.accent_color || "#e90000", currency: row.currency || "NGN", domain: row.custom_domain };
  const products: Product[] = result.productRows.map((item) => ({ id: item.id, vendorId: item.vendor_id, name: item.name, slug: item.slug, category: item.category, price: Number(item.price), compareAt: item.compare_at ? Number(item.compare_at) : undefined, description: item.description, details: item.details || [], image: item.image_url, imageAlt: item.image_alt || item.name, tone: item.accent_tone || "clay", featured: item.featured, badge: item.badge || undefined, inventory: item.inventory, currency: vendor.currency }));
  return { vendor, products, promotions: result.promotions };
}

export const attribution = { label: process.env.NEXT_PUBLIC_PLATFORM_NAME || "SEV7N FOLD", url: process.env.NEXT_PUBLIC_PLATFORM_URL || "https://sev7nfold.example" };
