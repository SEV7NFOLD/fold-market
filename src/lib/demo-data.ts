import type { Product, Vendor } from "@/lib/types";

export const demoVendor: Vendor = {
  id: "sev7n-fold-demo",
  name: "Prime Kare",
  handle: "prime-kare",
  logo: "/brand/prime-kare-transparent.svg",
  accent: "#e90000",
  currency: "NGN",
};

export const demoProducts: Product[] = [
  {
    id: "product-01", vendorId: demoVendor.id, name: "Dew Theory", slug: "dew-theory",
    category: "Face", price: 18500, compareAt: 22000, description: "A daily hydration veil that leaves skin soft, calm, and quietly luminous.",
    details: ["Hyaluronic acid and aloe", "Lightweight, non-sticky finish", "Made for morning and evening rituals"],
    image: "/products/dew-theory.svg", imageAlt: "Amber glass serum bottle on a warm cream backdrop", tone: "clay", featured: true, badge: "Bestseller", inventory: 18,
  },
  {
    id: "product-02", vendorId: demoVendor.id, name: "Soft Reset", slug: "soft-reset",
    category: "Face", price: 14200, description: "A cushiony cleansing balm for the gentle end of a long day.",
    details: ["Melts away daily build-up", "Rinses clean without tightness", "A gentle first step for all skin types"],
    image: "/products/soft-reset.svg", imageAlt: "Cream cleansing balm jar on a sand-toned surface", tone: "rose", inventory: 24,
  },
  {
    id: "product-03", vendorId: demoVendor.id, name: "Evening Form", slug: "evening-form",
    category: "Body", price: 16800, description: "A restorative body cream with a velvety finish and a soft, grounding scent.",
    details: ["Shea butter and oat extract", "Comforting texture, never heavy", "Made for a slow evening ritual"],
    image: "/products/evening-form.svg", imageAlt: "Minimal body cream bottle on a muted green backdrop", tone: "sage", featured: true, inventory: 12,
  },
  {
    id: "product-04", vendorId: demoVendor.id, name: "Daybreak Oil", slug: "daybreak-oil",
    category: "Face", price: 21000, description: "A few thoughtful drops of nourishing oil for a softer, dewier-looking finish.",
    details: ["Plant-derived squalane", "Sinks in without a heavy feel", "Use alone or layer over moisturizer"],
    image: "/products/daybreak-oil.svg", imageAlt: "Small amber facial oil bottle on a pale stone surface", tone: "ochre", badge: "New", inventory: 9,
  },
  {
    id: "product-05", vendorId: demoVendor.id, name: "The Daily Pair", slug: "the-daily-pair",
    category: "Ritual sets", price: 29500, description: "Two uncomplicated essentials for a routine you can return to every day.",
    details: ["Dew Theory serum and Soft Reset balm", "A considered gift for a fresh start", "Wrapped in recyclable packaging"],
    image: "/products/daily-pair.svg", imageAlt: "A skincare serum and balm set arranged together", tone: "blue", featured: true, inventory: 7,
  },
  {
    id: "product-06", vendorId: demoVendor.id, name: "Quiet Hours", slug: "quiet-hours",
    category: "Body", price: 13200, description: "A mineral-rich bath soak with notes of lavender and warm wood.",
    details: ["Epsom and sea salts", "Lavender-inspired scent", "Enough for several restorative baths"],
    image: "/products/quiet-hours.svg", imageAlt: "Bath soak pouch against a soft lavender background", tone: "lavender", inventory: 16,
  },
];

export const formatPrice = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
