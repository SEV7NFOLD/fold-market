import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Leaf, PackageCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/add-to-bag";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/demo-data";
import { getStorefront } from "@/lib/storefront";
import { StoreFooter } from "@/components/store-footer";
import { FavoriteButton } from "@/components/favorite-button";

// Product catalogs are vendor-scoped and selected from the incoming hostname.
// Avoid querying the request-scoped Supabase client during the build; product
// pages render on demand for the vendor serving the request.
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { products } = await getStorefront();
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id).slice(0, 3);
  const inStock = product.inventory > 0;
  return <main className="product-page section-pad"><div className="breadcrumbs"><Link href="/"><ArrowLeft size={14} /> Back to the edit</Link><span> / </span><span>{product.name}</span></div><div className="product-detail"><div className={`product-detail-image ${product.tone}`}><Image src={product.image} alt={product.imageAlt} fill priority sizes="(max-width: 780px) 100vw, 55vw" unoptimized /><span className="image-index">THE EDIT</span></div><div className="product-detail-copy"><div className="eyebrow"><span className="eyebrow-line" />{product.category}</div><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price, product.currency)} {product.compareAt && <del>{formatPrice(product.compareAt, product.currency)}</del>}</p><p className="detail-description">{product.description}</p><div className={`detail-stock${inStock ? "" : " sold-out"}`}><span className="stock-dot" /> {inStock ? "In stock, ready for your ritual" : "Currently unavailable"}</div><AddToBag product={product} /><div className="detail-returns"><span><PackageCheck size={17} /> Thoughtfully wrapped</span><span><Leaf size={17} /> Considered ingredients</span></div><div className="detail-accordion"><details open><summary>How to use <span>+</span></summary><p>Apply a small amount to clean skin, then pause and enjoy the moment. Use as part of your morning or evening routine.</p></details><details><summary>What's inside <span>+</span></summary><ul>{product.details.map((line) => <li key={line}><Check size={13} />{line}</li>)}</ul></details><details><summary>Shipping & care <span>+</span></summary><p>Shipping details and care notes are confirmed by the vendor when your order is placed.</p></details></div><FavoriteButton /></div></div><section className="related-products"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" />A good match</div><h2>Make it a <em>ritual.</em></h2></div><Link className="underlined-link desktop-only" href="/#shop">Shop all <span>→</span></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section><StoreFooter /></main>;
}


