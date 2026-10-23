import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function requireVendorAdmin() {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?setup=supabase");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: memberships, error } = await supabase
    .from("vendor_memberships")
    .select("vendor_id, role, vendors(name, handle, currency, logo_url, custom_domain)")
    .eq("user_id", user.id)
    .in("role", ["owner", "admin", "editor"]);
  if (error || !memberships?.length) redirect("/admin/login?error=access");
  const requestHeaders = await headers();
  const requestHost = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "").split(",")[0].trim().toLowerCase().split(":")[0];
  const currentVendor = memberships.find((membership) => membership.vendors?.[0]?.custom_domain === requestHost) || memberships[0];
  return { supabase, user, memberships, currentVendor };
}
