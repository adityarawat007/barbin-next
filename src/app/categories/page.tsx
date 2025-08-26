
import type { Metadata } from "next";
import AllCategories from "./page-client";

// ✅ Metadata replaces Helmet
export const metadata: Metadata = {
  title: "Categories - Barbin Furnitures",
  description:
    "Explore all categories of Barbin Furnitures. Find the perfect furniture for your space.",
  keywords:
    "furniture, categories, Barbin Furnitures, hospitality furniture, commercial furniture",
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/categories",
  },
};

export default function CategoriesPage() {
  return (
    <AllCategories />   
  );
}

