"use client";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
export function ProductCollection({ products }: { products: Product[] }) {
  const categories = ["Everything", ...Array.from(new Set(products.map((product) => product.category)))];
  const [active, setActive] = useState("Everything");
  const visible = active === "Everything" ? products : products.filter((product) => product.category === active);
  return <><div className="category-pills" aria-label="Filter products by category">{categories.map((category) => <button key={category} type="button" className={active === category ? "active" : ""} onClick={() => setActive(category)} aria-pressed={active === category}>{category}</button>)}</div>{visible.length ? <div className="product-grid" id="all-products">{visible.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="store-empty"><span>✳</span><h3>Something lovely is on its way.</h3><p>This vendor is preparing their first products. Please check back soon.</p></div>}</>;
}
