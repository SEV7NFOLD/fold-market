import Image from "next/image";
import Link from "next/link";
import { Menu, Search, UserRound } from "lucide-react";
import { CartButton } from "@/components/cart-button";
import { getStorefront } from "@/lib/storefront";

export async function SiteHeader() {
  const { vendor } = await getStorefront();
  return <>
    <div className="announcement"><span>Good things, thoughtfully made.</span><a href="/#shop">Explore the edit <span>↗</span></a></div>
    <header className="site-header">
      <Link className="icon-button menu-button" href="/#shop" aria-label="Browse products"><Menu size={20} strokeWidth={1.5} /></Link>
      <nav className="main-nav" aria-label="Main navigation"><a href="/#shop">Shop</a><a href="/#story">Our approach</a><a href="#ritual">Rituals</a></nav>
      <Link href="/" className="vendor-mark" aria-label={`${vendor.name} home`}><Image src={vendor.logo} width={118} height={42} alt={vendor.name} priority unoptimized /></Link>
      <nav className="header-actions" aria-label="Shop tools"><a className="icon-button search-button" href="/#shop" aria-label="Browse products"><Search size={19} strokeWidth={1.5} /></a><Link className="icon-button admin-link" href="/admin" aria-label="Vendor sign in"><UserRound size={19} strokeWidth={1.5} /></Link><CartButton /></nav>
    </header>
  </>;
}

