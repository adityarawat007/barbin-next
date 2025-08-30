export const metadata = {
  title: 'Products | Barbin Furnitures',
  description: 'Browse our premium furniture collection. High-quality, durable furniture for hospitality and commercial spaces across Australia.',
  keywords: [
    "products",
    "Barbin Furnitures",
    "hospitality furniture",
    "premium furniture",
    "Australian furniture",
    "commercial furniture",
  ],
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/products",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 