import { db } from "@/components/firebase";
import { collection, getDocs, query, DocumentData } from "firebase/firestore";
import type { Metadata } from "next";

// ---------------- Types ---------------- //
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  features: ProductFeature[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  [key: string]: any; // allow Firestore extras
}

// ---------------- Helpers ---------------- //
const createProductSlug = (productName: string) => {
  return productName
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

// ---------------- Metadata ---------------- //
export async function generateMetadata({
  params,
}: {
  params: { category: string; id: string };
}): Promise<Metadata> {
  try {
    const productRef = collection(db, "products");
    const allProductsQuery = query(productRef);
    const allProductsSnapshot = await getDocs(allProductsQuery);

    let product: Product | null = null;

    allProductsSnapshot.forEach((doc) => {
      // 👇 Cast Firestore data safely
      const data = doc.data() as Product;

      if (!data?.name) return; // safeguard

      const productSlug = createProductSlug(data.name);

      if (productSlug === params.id?.trim()) {
        const { id: _id, ...restData } = data;
        product = { id: doc.id, ...restData } as Product;
      }
    });

    if (product) {
      return {
        title: `${(product as Product).name} | Barbin Furnitures`,
        description: `High-quality ${(product as Product).category?.toLowerCase()} - ${(product as Product).name}. Premium furniture for hospitality and commercial spaces.`,
        alternates: {
          canonical: `https://www.barbinfurniture.com.au/products/${createProductSlug(
            (product as Product).category
          )}/${createProductSlug((product as Product).name)}`,
        },
        openGraph: {
          title: `${(product as Product).name} | Barbin Furnitures`,
          description: `High-quality ${(product as Product).category?.toLowerCase()} - ${(product as Product).name}`,
          images: (product as Product).images?.[0] ? [{ url: (product as Product).images[0] }] : [],
        },
      };
    }

    return {
      title: "Product | Barbin Furnitures",
      description: "Premium furniture for hospitality and commercial spaces.",
    };
  } catch (error) {
    return {
      title: "Product | Barbin Furnitures",
      description: "Premium furniture for hospitality and commercial spaces.",
    };
  }
}

// ---------------- Layout ---------------- //
export default function ItemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
