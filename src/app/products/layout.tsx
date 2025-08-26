export const metadata = {
  title: 'Products | Barbin Furnitures',
  description: 'Browse our premium furniture collection. High-quality, durable furniture for hospitality and commercial spaces across Australia.',
  canonical: 'https://www.barbinfurniture.com.au/products',
  openGraph: {
    title: 'Products | Barbin Furnitures',
    description: 'Browse our premium furniture collection for hospitality and commercial spaces.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}