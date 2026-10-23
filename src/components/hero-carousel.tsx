"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/demo-data";

export function HeroCarousel({ products }: { products: Product[] }) {
  const slides = useMemo(() => {
    const available = products.filter((product) => product.inventory > 0);
    return (available.length ? available : products).slice(0, 8);
  }, [products]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = slides[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setActiveIndex((current) => (current + 1) % slides.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  if (!active) return <div className="hero-image-wrap"><div className="hero-image-empty" aria-hidden="true" /></div>;
  const showSlide = (index: number) => setActiveIndex((index + slides.length) % slides.length);

  return <div className="hero-image-wrap" aria-roledescription="carousel" aria-label="Featured products">
    <Link className="hero-slide-link" href={`/products/${active.slug}`} aria-label={`View ${active.name}`}>
      <Image key={active.id} src={active.image} alt={active.imageAlt || active.name} fill priority={activeIndex === 0} sizes="(max-width: 800px) 100vw, 54vw" className="hero-product hero-slide-image" unoptimized />
    </Link>
    <div className="hero-note"><span className="hero-note-mark"><Sparkles size={14} /></span><span>{active.name}<br /><strong>{formatPrice(active.price, active.currency)}</strong></span><ArrowUpRight size={14} /></div>
    <span className="image-index" aria-live="off">{String(activeIndex + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}</span>
    {slides.length > 1 && <div className="hero-carousel-controls" aria-label="Featured product controls">
      <button type="button" onClick={() => showSlide(activeIndex - 1)} aria-label="Previous featured product"><ChevronLeft size={16} /></button>
      <button type="button" onClick={() => setPaused((value) => !value)} aria-label={reducedMotion ? "Automatic slide changes are disabled by your motion preference" : paused ? "Play featured products" : "Pause featured products"} aria-pressed={paused} disabled={reducedMotion}>{paused || reducedMotion ? <Play size={13} /> : <Pause size={13} />}</button>
      <button type="button" onClick={() => showSlide(activeIndex + 1)} aria-label="Next featured product"><ChevronRight size={16} /></button>
    </div>}
  </div>;
}
