"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
export function FavoriteButton() {
  const [saved, setSaved] = useState(false);
  return <button className="wishlist-button" type="button" aria-pressed={saved} onClick={() => setSaved((value) => !value)}><Heart size={15} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved for this visit" : "Keep this one close"}</button>;
}
