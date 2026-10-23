import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/demo-data";

export function ProductCard({ product }: { product: Product }) {
  return <article className="product-card">
    <Link className={`product-visual ${product.tone}`} href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <Image src={product.image} alt={product.imageAlt} fill sizes="(max-width: 700px) 47vw, (max-width: 1100px) 30vw, 23vw" unoptimized />
      <span className="quick-view">Discover <span>↗</span></span>
    </Link>
    <div className="product-copy"><div><span className="product-category">{product.category}</span><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3></div><span className="product-price">{formatPrice(product.price, product.currency)}</span></div>
    <p className="product-description">{product.description}</p>
  </article>;
}
