"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";

export function AddToBag({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return <button className="button button-dark add-button" onClick={() => { add(product); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>
    {added ? <><Check size={16} /> Added to bag</> : <>Add to bag <Plus size={15} /></>}
  </button>;
}
