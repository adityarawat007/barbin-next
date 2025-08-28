import { db } from "@/components/firebase";
import { collection, getDocs, query} from "firebase/firestore";
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
  params: Promise<{ category: string; id: string }>;
}): Promise<Metadata> {
  try {
    // Await params before using its properties
    const resolvedParams = await params;
    
    const productRef = collection(db, "products");
    const allProductsQuery = query(productRef);
    const allProductsSnapshot = await getDocs(allProductsQuery);

    let product: Product | null = null;

    allProductsSnapshot.forEach((doc) => {
      // 👇 Cast Firestore data safely
      const data = doc.data() as Product;

      if (!data?.name) return; // safeguard

      const productSlug = createProductSlug(data.name);

      if (productSlug === resolvedParams.id?.trim()) {
        const { id: _id, ...restData } = data;
        product = { id: doc.id, ...restData } as Product;
      }
    });

    if (product !== null) {
      const safeProduct = product as Product;
      return {
        title: `${safeProduct.name} | Barbin Furnitures`,
        description: `High-quality ${safeProduct.category?.toLowerCase()} - ${safeProduct.name}. Premium furniture for hospitality and commercial spaces.`,
        alternates: {
          canonical: `https://www.barbinfurniture.com.au/products/${createProductSlug(
            safeProduct.category
          )}/${createProductSlug(safeProduct.name)}`,
        },
        openGraph: {
          title: `${safeProduct.name} | Barbin Furnitures`,
          description: `High-quality ${safeProduct.category?.toLowerCase()} - ${safeProduct.name}`,
          images: safeProduct.images?.[0] ? [{ url: safeProduct.images[0] }] : [],
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