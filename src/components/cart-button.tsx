"use client";

import { useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/demo-data";

export function CartButton() {
  const { lines, count, remove } = useCart();
  const [open, setOpen] = useState(false);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const orderBody = lines.map(({ product, quantity }) => `${quantity} × ${product.name} — ${formatPrice(product.price * quantity, product.currency)}`).join("`n");
  return <>
    <button className="icon-button cart-trigger" type="button" aria-label={`Open shopping bag, ${count} items`} onClick={() => setOpen(true)}>
      <ShoppingBag size={19} strokeWidth={1.5} /><span className="cart-count">{count}</span>
    </button>
    {open && <div className="drawer-backdrop" role="presentation" onClick={() => setOpen(false)}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head"><h2 id="cart-title">Your bag <span>({count})</span></h2><button className="icon-button" onClick={() => setOpen(false)} aria-label="Close bag"><X size={20} /></button></div>
        {lines.length === 0 ? <div className="cart-empty"><span className="empty-mark"><ShoppingBag /></span><p>Your ritual is waiting.</p><span>Discover something good for your shelf.</span><button className="button button-dark" onClick={() => setOpen(false)}>Explore the edit</button></div> : <>
          <div className="cart-lines">{lines.map(({ product, quantity }) => <div className="cart-line" key={product.id}>
            <div className={`cart-thumb product-art ${product.tone}`}><Image src={product.image} alt="" fill sizes="92px" unoptimized /></div>
            <div className="cart-line-info"><strong>{product.name}</strong><span>Qty {quantity}</span><button className="text-button" onClick={() => remove(product.id)}>Remove</button></div>
            <span className="cart-line-price">{formatPrice(product.price * quantity, product.currency)}</span>
          </div>)}</div>
          <div className="cart-bottom"><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><span className="shipping-note">Shipping is calculated when a checkout provider is connected.</span>{process.env.NEXT_PUBLIC_VENDOR_CONTACT_EMAIL ? <a className="button button-dark checkout-button" href={`mailto:${process.env.NEXT_PUBLIC_VENDOR_CONTACT_EMAIL}?subject=${encodeURIComponent("Order enquiry")}&body=${encodeURIComponent(orderBody)}`} onClick={() => setOpen(false)}>Send order enquiry <span>↗</span></a> : <span className="button checkout-disabled">Checkout setup is pending</span>}<span className="demo-note">Demo bag only — no order or payment is taken.</span></div>
        </>}
      </aside>
    </div>}
  </>;
}

