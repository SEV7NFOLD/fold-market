export type Product = {
  id: string;
  vendorId: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  compareAt?: number;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
  tone: string;
  featured?: boolean;
  badge?: string;
  inventory: number;
  currency?: string;
};

export type Vendor = {
  id: string;
  name: string;
  handle: string;
  logo: string;
  accent: string;
  currency: string;
  domain?: string | null;
};
