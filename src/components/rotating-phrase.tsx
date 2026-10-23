"use client";

import { useEffect, useState } from "react";

const phrases = ["like coming home.", "like a softer start.", "like your own rhythm.", "like a quiet reset."];

export function RotatingPhrase() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") setIndex((current) => (current + 1) % phrases.length);
    }, 4300);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return <span className="rotating-phrase" aria-label={phrases[index]}><span key={index}>{phrases[index]}</span></span>;
}
