import Image from "next/image";
import Link from "next/link";
import { attribution, getStorefront } from "@/lib/storefront";

export async function StoreFooter() {
  const { vendor } = await getStorefront();
  return <footer className="site-footer"><div className="footer-top"><Link href="/" className="footer-brand"><Image src={vendor.logo} alt={vendor.name} width={110} height={42} unoptimized /><span>Good care, every day.</span></Link><div className="footer-links"><div><span>EXPLORE</span><Link href="/#shop">Shop the edit</Link><Link href="/about">Our approach</Link></div><div><span>HERE TO HELP</span><a href="/#contact">Get in touch</a><Link href="/admin">Vendor sign in</Link></div></div><a className="back-top" href="#">Back to top ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {vendor.name}. Made with care.</span><span><a href={attribution.url} target="_blank" rel="noreferrer">Powered by <Image className="attribution-logo" src="/brand/sev7n-fold-black.svg" alt="" width={17} height={23} /> <strong>{attribution.label}</strong></a></span></div></footer>;
}

