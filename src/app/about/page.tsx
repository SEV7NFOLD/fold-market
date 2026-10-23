import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return <main className="about-page"><section className="about-hero"><div className="eyebrow"><span className="eyebrow-line" />A note from Prime Kare</div><h1>Care with a little<br /><em>more feeling.</em></h1><p>Small, thoughtful rituals can make room for the person you are, right here and now.</p><Link href="/#shop" className="button button-dark">Find your ritual <ArrowRight size={15} /></Link></section><div className="about-image"><Image src="/products/daily-pair.svg" alt="The Prime Kare daily skincare set" fill sizes="100vw" /></div><section className="about-story"><span className="about-num">01 — OUR APPROACH</span><h2>Good care is<br /><em>personal.</em></h2><p>Prime Kare is a space for everyday care, made with intention and offered without pressure. We believe the best routine is the one that feels right for you—simple, considered, and easy to come back to.</p><p>We’re building a collection that makes space for different skin, different seasons, and different ways of feeling at home in yourself.</p><Link href="/#shop" className="underlined-link">Explore the edit <ArrowRight size={14} /></Link></section><div className="about-back"><Link href="/"><ArrowLeft size={14} /> Back to the storefront</Link></div></main>;
}
