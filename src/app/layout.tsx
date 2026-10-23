import type { Metadata } from "next";
import "./globals.css";
import "./interactions.css";
import "./brand-motion.css";
import "./checkout.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getStorefront } from "@/lib/storefront";
import { WhatsAppContact } from "@/components/whatsapp-contact";

export async function generateMetadata(): Promise<Metadata> {
  const { vendor } = await getStorefront();
  const title = `${vendor.name} — a considered everyday edit`;
  const description = `Discover thoughtful products and small rituals from ${vendor.name}.`;
  const canonicalDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN || vendor.domain;
  const base = canonicalDomain ? new URL(`https://${canonicalDomain}`) : new URL("https://sev7nfold.example");
  return { title, description, metadataBase: base, openGraph: { title, description, type: "website" } };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { vendor } = await getStorefront();
  return <html lang="en"><body style={{ "--brand-accent": vendor.accent } as React.CSSProperties}><CartProvider><SiteHeader />{children}<WhatsAppContact /></CartProvider><ScrollReveal /></body></html>;
}

