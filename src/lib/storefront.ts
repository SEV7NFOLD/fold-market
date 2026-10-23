import { demoProducts, demoVendor } from "@/lib/demo-data";
import type { Product, Vendor } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function getStorefront() {
  const supabase = await createClient();
  const handle = process.env.NEXT_PUBLIC_VENDOR_HANDLE || demoVendor.handle;
  if (!supabase) return { vendor: demoVendor, products: demoProducts, promotions: [{ id: "demo-chef", title: "Good things are better shared.", description: "Beyond the daily ritual, Prime Kare brings the same thoughtfulness to the table. Ask us about intimate chef experiences, made with care and served with a little joy.", image_url: "/products/chef-table.svg", cta_label: "Enquire about a chef experience", cta_url: "#contact" }] };
  const requestHeaders = await headers();
  const requestHost = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "").split(",")[0].trim().toLowerCase().split(":")[0];
  let { data: row } = requestHost
    ? await supabase.from("vendors").select("id,name,handle,logo_url,accent_color,currency,custom_domain").eq("custom_domain", requestHost).eq("is_active", true).maybeSingle()
    : { data: null };
  if (!row) {
    const fallback = await supabase.from("vendors").select("id,name,handle,logo_url,accent_color,currency,custom_domain").eq("handle", handle).eq("is_active", true).maybeSingle();
    row = fallback.data;
  }
  if (!row) {
    const vendor: Vendor = { ...demoVendor, id: "unconfigured", handle, name: handle.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ") };
    return { vendor, products: [] as Product[], promotions: [] };
  }
  const vendor: Vendor = { id: row.id, name: row.name, handle: row.handle, logo: row.logo_url || "/brand/prime-kare.svg", accent: row.accent_color || "#8f755e", currency: row.currency || "NGN", domain: row.custom_domain };
  const { data: rows, error } = await supabase.from("products").select("id,vendor_id,name,slug,category,price,compare_at,description,details,image_url,image_alt,accent_tone,featured,badge,inventory").eq("vendor_id", vendor.id).eq("status", "published").order("sort_order", { ascending: true });
  const { data: promos } = await supabase.from("service_promotions").select("id,title,description,image_url,cta_label,cta_url").eq("vendor_id", vendor.id).eq("is_active", true).order("sort_order", { ascending: true });
  if (error || !rows?.length) return { vendor, products: [] as Product[], promotions: promos || [] };
  const products: Product[] = rows.map((item) => ({ id: item.id, vendorId: item.vendor_id, name: item.name, slug: item.slug, category: item.category, price: Number(item.price), compareAt: item.compare_at ? Number(item.compare_at) : undefined, description: item.description, details: item.details || [], image: item.image_url, imageAlt: item.image_alt || item.name, tone: item.accent_tone || "clay", featured: item.featured, badge: item.badge || undefined, inventory: item.inventory, currency: vendor.currency }));
  return { vendor, products, promotions: promos || [] };
}

export const attribution = { label: process.env.NEXT_PUBLIC_PLATFORM_NAME || "SEV7N FOLD", url: process.env.NEXT_PUBLIC_PLATFORM_URL || "https://sev7nfold.example" };
