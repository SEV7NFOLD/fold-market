"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  vendorId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  category: z.string().trim().min(2).max(60),
  price: z.coerce.number().int().nonnegative().max(100000000),
  description: z.string().trim().min(5).max(1200),
  imageUrl: z.string().trim().url().max(500).refine((value) => new URL(value).protocol === "https:").optional().or(z.literal("")),
  inventory: z.coerce.number().int().nonnegative().max(1000000),
  status: z.enum(["draft", "published"]),
});

async function requireEditor(vendorId: string) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?setup=supabase");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: membership } = await supabase.from("vendor_memberships")
    .select("role").eq("vendor_id", vendorId).eq("user_id", user.id)
    .in("role", ["owner", "admin", "editor"]).maybeSingle();
  if (!membership) redirect("/admin/login?error=access");
  return supabase;
}

function formDataToInput(formData: FormData) {
  return {
    id: formData.get("id") || undefined, vendorId: formData.get("vendorId"),
    name: formData.get("name"), slug: formData.get("slug"), category: formData.get("category"),
    price: formData.get("price"), description: formData.get("description"),
    imageUrl: formData.get("imageUrl"), inventory: formData.get("inventory"), status: formData.get("status"),
  };
}

export async function saveProduct(formData: FormData) {
  const parsed = productSchema.safeParse(formDataToInput(formData));
  if (!parsed.success) redirect("/admin?error=validation");
  const { id, vendorId, ...input } = parsed.data;
  const supabase = await requireEditor(vendorId);
  const imageFile = formData.get("imageFile");
  let imageUrl = input.imageUrl || "";
  if (imageFile instanceof File && imageFile.size > 0) {
    const extensionByType: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
    const extension = extensionByType[imageFile.type];
    const signature = new Uint8Array(await imageFile.slice(0, 12).arrayBuffer());
    const startsWith = (...bytes: number[]) => bytes.every((byte, index) => signature[index] === byte);
    const validImage = imageFile.type === "image/jpeg" ? startsWith(0xff, 0xd8, 0xff)
      : imageFile.type === "image/png" ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
      : imageFile.type === "image/webp" ? startsWith(0x52, 0x49, 0x46, 0x46) && String.fromCharCode(...signature.slice(8, 12)) === "WEBP"
      : imageFile.type === "image/avif" ? String.fromCharCode(...signature.slice(4, 8)) === "ftyp" && ["avif", "avis"].includes(String.fromCharCode(...signature.slice(8, 12)))
      : false;
    if (!extension || !validImage || imageFile.size > 5 * 1024 * 1024) redirect("/admin?error=image");
    const objectPath = `${vendorId}/${input.slug}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("product-media").upload(objectPath, imageFile, {
      contentType: imageFile.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (uploadError) redirect("/admin?error=upload");
    imageUrl = supabase.storage.from("product-media").getPublicUrl(objectPath).data.publicUrl;
  } else if (!imageUrl && id) {
    const { data: existingProduct } = await supabase.from("products").select("image_url").eq("id", id).eq("vendor_id", vendorId).maybeSingle();
    imageUrl = existingProduct?.image_url || "";
  }
  if (!imageUrl) redirect("/admin?error=validation");
  const record = { name: input.name, slug: input.slug, category: input.category, price: input.price,
    description: input.description, image_url: imageUrl, inventory: input.inventory, status: input.status };
  const { error } = id
    ? await supabase.from("products").update(record).eq("id", id).eq("vendor_id", vendorId)
    : await supabase.from("products").insert({ ...record, vendor_id: vendorId });
  if (error) redirect("/admin?error=database");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/products/[slug]", "page");
  redirect("/admin?saved=1");
}

export async function deleteProduct(formData: FormData) {
  const vendorId = String(formData.get("vendorId") || "");
  const id = String(formData.get("id") || "");
  if (!z.string().uuid().safeParse(vendorId).success || !z.string().uuid().safeParse(id).success) redirect("/admin?error=validation");
  const supabase = await requireEditor(vendorId);
  const { error } = await supabase.from("products").delete().eq("id", id).eq("vendor_id", vendorId);
  if (error) redirect("/admin?error=database");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/products/[slug]", "page");
  redirect("/admin?saved=1");
}

export async function signIn(formData: FormData) {
  const email = z.string().email().safeParse(formData.get("email"));
  const password = z.string().min(1).safeParse(formData.get("password"));
  if (!email.success || !password.success) redirect("/admin/login?error=credentials");
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login?setup=supabase");
  const { error } = await supabase.auth.signInWithPassword({ email: email.data, password: password.data });
  if (error) redirect("/admin/login?error=signin");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
