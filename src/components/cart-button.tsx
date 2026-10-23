"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/demo-data";

const vendorEmail = process.env.NEXT_PUBLIC_VENDOR_CONTACT_EMAIL || "peaceatume58@gmail.com";
const whatsappNumber = "2348111690858";

export function CartButton() {
  const { lines, count, remove } = useCart();
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const currency = lines[0]?.product.currency || "NGN";
  const orderLines = lines.map(({ product, quantity }) => `${quantity} × ${product.name} — ${formatPrice(product.price * quantity, product.currency)}`);
  const orderSummary = orderLines.join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Prime Kare\n\nI would like to ask about this order:\n${orderSummary}\n\nSubtotal: ${formatPrice(subtotal, currency)}`)}`;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setCheckout(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function sendEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("customerName") || "").trim();
    const email = String(form.get("customerEmail") || "").trim();
    const phone = String(form.get("customerPhone") || "").trim();
    const address = String(form.get("deliveryAddress") || "").trim();
    const note = String(form.get("orderNote") || "").trim();
    const details = [
      "Hello Prime Kare, I would like to place an order.",
      "",
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      `Phone: ${phone || "Not provided"}`,
      `Delivery address: ${address || "To be confirmed"}`,
      "",
      "Items:",
      orderSummary,
      "",
      `Subtotal (delivery to be confirmed): ${formatPrice(subtotal, currency)}`,
      note ? `\nNote: ${note}` : "",
    ].filter(Boolean).join("\n");
    window.location.href = `mailto:${vendorEmail}?subject=${encodeURIComponent("Prime Kare order enquiry")}&body=${encodeURIComponent(details)}`;
  }

  return <>
    <button className="icon-button cart-trigger" type="button" aria-label={`Open shopping bag, ${count} items`} onClick={() => setOpen(true)}>
      <ShoppingBag size={19} strokeWidth={1.5} /><span className="cart-count">{count}</span>
    </button>
    {open && createPortal(<div className="drawer-backdrop" role="presentation" onClick={() => { setOpen(false); setCheckout(false); }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head"><h2 id="cart-title">{checkout ? "Your details" : <>Your bag <span>({count})</span></>}</h2><button className="icon-button" onClick={() => { setOpen(false); setCheckout(false); }} aria-label="Close bag"><X size={20} /></button></div>
        {lines.length === 0 ? <div className="cart-empty"><span className="empty-mark"><ShoppingBag /></span><p>Your ritual is waiting.</p><span>Discover something good for your shelf.</span><button className="button button-dark" onClick={() => setOpen(false)}>Explore the edit</button></div> : checkout ? <>
          <p className="checkout-intro">Your items are ready. Add any details you like, then send your enquiry to Prime Kare. We’ll confirm availability, delivery and the final total with you.</p>
          <form className="checkout-form" onSubmit={sendEnquiry}>
            <label>Your name <span>optional</span><input name="customerName" autoComplete="name" placeholder="Name" /></label>
            <div className="checkout-two-col"><label>Email <span>optional</span><input name="customerEmail" type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Phone <span>optional</span><input name="customerPhone" type="tel" autoComplete="tel" placeholder="+234…" /></label></div>
            <label>Delivery address <span>optional</span><textarea name="deliveryAddress" autoComplete="street-address" rows={2} placeholder="Add later if you prefer" /></label>
            <label>Note <span>optional</span><textarea name="orderNote" rows={2} placeholder="Anything else we should know?" /></label>
            <div className="checkout-summary"><span>{count} item{count === 1 ? "" : "s"} · subtotal</span><strong>{formatPrice(subtotal, currency)}</strong><ul>{lines.map(({ product, quantity }) => <li key={product.id}>{quantity} × {product.name} <span>{formatPrice(product.price * quantity, product.currency)}</span></li>)}</ul><small>Delivery and final total are confirmed directly.</small></div>
            <button className="button button-dark checkout-button" type="submit">Send order enquiry <span>↗</span></button>
          </form>
          <a className="button whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Message us on WhatsApp</a>
          <p className="checkout-mail-note">Email opens in your device’s mail app with your order already filled in.</p>
          <button className="text-button checkout-back" type="button" onClick={() => setCheckout(false)}>← Back to your bag</button>
        </> : <>
          <div className="cart-lines">{lines.map(({ product, quantity }) => <div className="cart-line" key={product.id}>
            <div className={`cart-thumb product-art ${product.tone}`}><Image src={product.image} alt="" fill sizes="92px" unoptimized /></div>
            <div className="cart-line-info"><strong>{product.name}</strong><span>Qty {quantity}</span><button className="text-button" onClick={() => remove(product.id)}>Remove</button></div>
            <span className="cart-line-price">{formatPrice(product.price * quantity, product.currency)}</span>
          </div>)}</div>
          <div className="cart-bottom"><div className="subtotal"><span>Subtotal</span><strong>{formatPrice(subtotal, currency)}</strong></div><span className="shipping-note">Delivery is confirmed directly with Prime Kare.</span><button className="button button-dark checkout-button" type="button" onClick={() => setCheckout(true)}>Continue to checkout <span>↗</span></button><a className="button whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp your order</a><span className="demo-note">Your order is an enquiry; payment is arranged with Prime Kare.</span></div>
        </>}
      </aside>
    </div>, document.body)}
  </>;
}
