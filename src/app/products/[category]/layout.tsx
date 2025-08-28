export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  // Await params before using its properties
  const resolvedParams = await params;
  
  // Helper function to parse category from slug
  const parseCategoryFromSlug = (slug: string) => {
    if (!slug) return null;

    const specialMappings = {
      "side-coffee-table": "Side/Coffee Table",
      "dining-coffee-table": "Dining/Coffee Table",
    };

    if (specialMappings[slug as keyof typeof specialMappings]) {
      return specialMappings[slug as keyof typeof specialMappings];
    }

    return decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const category = parseCategoryFromSlug(resolvedParams.category);

  return {
    title: category
      ? `${category} | Barbin Furnitures`
      : "Products | Barbin Furnitures",
    description: category
      ? `Browse our premium ${category.toLowerCase()} collection. High-quality, durable furniture for hospitality and commercial spaces across Australia.`
      : "Browse our premium furniture collection for hospitality and commercial spaces.",
    canonical: `https://www.barbinfurniture.com.au/products/${resolvedParams.category}`,
    openGraph: {
      title: category
        ? `${category} | Barbin Furnitures`
        : "Products | Barbin Furnitures",
      description: category
        ? `Premium ${category.toLowerCase()} collection for hospitality and commercial spaces.`
        : "Premium furniture collection for hospitality and commercial spaces.",
    },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}