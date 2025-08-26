"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase";
import Link from "next/link";
import Image from "next/image";

const AllCategories = () => {
  const [categories, setCategories] = useState<
    { category: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // ✅ Create category slug
  const createCategorySlug = (category: string) => {
    return category
      .toLowerCase()
      .replace(/\//g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const catSnapshot = await getDocs(collection(db, "products"));
        const categoryImageMap: Record<string, string> = {};
        catSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category && !categoryImageMap[data.category]) {
            categoryImageMap[data.category] =
              (Array.isArray(data.images) && data.images[0]) ||
              data.image ||
              "/chair.jpg";
          }
        });

        const categoriesArr = Object.entries(categoryImageMap).map(
          ([category, image]) => ({
            category,
            image,
          })
        );

        setCategories(categoriesArr);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C]"></div>
      </div>
    );
  }

  return (
    <div className="w-full mb-16 mt-8">
      <div className="w-[90%] mx-auto px-4">
        <h2 className="text-4xl md:text-5xl helvetica-bold text-center text-gray-800 mb-12">
          All Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map(({ category, image }) => (
            <Link
              href={`/products/${createCategorySlug(category)}`}
              key={category}
              className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white"
            >
              <div className="h-48 md:h-48 w-full overflow-hidden flex justify-center items-center relative">
                {/* ✅ Next.js Image (optimized, responsive, covers area) */}
                <Image
                  src={image}
                  alt={category}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl md:text-2xl poppins-bold text-gray-900 mb-2 capitalize">
                  {category}
                </h3>
                <span className="text-gray-800 poppins-semi text-sm md:text-base hover:text-[#C49A6C] transition-colors duration-300 border-b border-gray-800 hover:border-[#C49A6C] pb-1 inline-block">
                  View Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
