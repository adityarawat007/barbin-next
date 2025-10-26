"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/components/firebase";

// Helper function for product slug
const createProductSlug = (productName: string) => {
  return productName
    .toLowerCase()
    .replace(/\//g, "-") // Convert slashes to hyphens
    .replace(/\s+/g, "-") // Convert spaces to hyphens
    .replace(/[^\w-]/g, ""); // Remove other special characters
};

interface Product {
  id: string;
  name: string;
  price?: number;
  category?: string;
  image?: string;
  images?: string[];
}

interface SimilarProductsProps {
  id: string;
  category: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ id, category }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch similar products from Firebase
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!category || !id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const productsQuery = query(
          collection(db, "products"),
          where("category", "==", category),
          limit(20)
        );

        const querySnapshot = await getDocs(productsQuery);
        const similarProducts: Product[] = [];

        querySnapshot.forEach((doc) => {
          const productData = { id: doc.id, ...doc.data() } as Product;

          // Exclude the current product
          if (createProductSlug(productData.name) !== id) {
            similarProducts.push(productData);
          }
        });

        setProducts(similarProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching similar products:", err);
        setError("Failed to load similar products");

        // Fallback to sample products if Firebase fails
        setProducts([
          {
            id: "fallback1",
            name: "Beliza Chair",
            price: 100,
            image: "/chair.jpg",
          },
          {
            id: "fallback2",
            name: "Butterfly Chair",
            price: 100,
            image: "/chair.jpg",
          },
          {
            id: "fallback3",
            name: "Guam Chair",
            price: 100,
            image: "/chair.jpg",
          },
          {
            id: "fallback4",
            name: "Mesh Chair",
            price: 100,
            image: "/chair.jpg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [id, category]);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const getCurrentSlideProducts = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return products.slice(startIndex, startIndex + itemsPerSlide);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full mb-10">
        <div className="w-[90%] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl helvetica-bold text-center mb-8">
            <span className="text-[#c79f73]">Products</span> you may like
          </h2>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c79f73]" />
          </div>
        </div>
      </div>
    );
  }

  // Error state or no products
  if (error && products.length === 0) {
    return (
      <div className="w-full mb-10">
        <div className="w-[90%] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl helvetica-bold text-center mb-8">
            <span className="text-[#c79f73]">Products</span> you may like
          </h2>
          <p className="text-center text-gray-600 poppins-light">
            Unable to load similar products
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full mb-10">
        <div className="w-[90%] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl helvetica-bold text-center mb-8">
            <span className="text-[#c79f73]">Products</span> you may like
          </h2>
          <p className="text-center text-gray-600 poppins-light">
            No similar products found in this category
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-1 mt-20">
      <div className="w-[90%] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl helvetica-bold text-center mb-8">
          <span className="text-[#c79f73]">Products</span> you may like
        </h2>

        <div className="relative">
          {/* Mobile layout */}
          <div className="md:hidden w-full overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${createProductSlug(
                    product.category || ""
                  )}/${createProductSlug(product.name)}`}
                  className="flex flex-col items-center w-40"
                >
                  <div className="overflow-hidden w-40 rounded-lg border border-gray-200 mb-3 hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={
                        product.images?.[0] ||
                        product.image ||
                        "/placeholder.png"
                      }
                      alt={product.name}
                      className="w-fit h-40 hover:scale-105 object-contain transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm poppins-bold text-center">
                    {product.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden justify-center md:flex flex-row gap-6">
            {getCurrentSlideProducts().map((product) => (
              <Link
                key={product.id}
                href={`/products/${createProductSlug(
                  product.category || ""
                )}/${createProductSlug(product.name)}`}
                className="rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer w-48 h-64"
              >
                <div className="w-full flex justify-center h-44">
                  <img
                    src={
                      product.images?.[0] || product.image || "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-fit h-full object-contain rounded-xl"
                  />
                </div>
                <div className="px-2 py-2">
                  <h3 className="text-sm poppins-bold truncate text-center">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Navigation */}
          {totalSlides > 1 && (
            <div className="hidden md:flex gap-2 justify-center w-full md:justify-between items-center mt-8">
              <button
                onClick={prevSlide}
                className="bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300"
                type="button"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="hidden md:flex gap-1">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-[#3C2415] w-10"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="bg-white hover:bg-gray-50 rounded-full p-2 shadow-lg transition-all duration-300"
                type="button"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {error && products.length > 0 && (
          <p className="mt-4 text-sm text-gray-500 poppins-light text-center">
            Some products may not be current due to connection issues
          </p>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
