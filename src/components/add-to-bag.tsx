"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart-provider";

export function AddToBag({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const [added, setAdded] = useState(false);
  const quantityInBag = lines.find((line) => line.product.id === product.id)?.quantity || 0;
  const soldOut = product.inventory <= 0;
  const atLimit = quantityInBag >= product.inventory;
  return <button className="button button-dark add-button" type="button" disabled={soldOut || atLimit} onClick={() => { add(product); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>
    {soldOut ? <>Sold out</> : added ? <><Check size={16} /> Added to bag</> : atLimit ? <>Stock limit reached</> : <>Add to bag <Plus size={15} />
    </>}
  </button>;
}
