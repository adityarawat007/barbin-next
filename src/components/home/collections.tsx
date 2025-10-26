"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const OurCollections = () => {
  // Helper function for category slug
  const createCategorySlug = (category: string) => {
    return category
      .toLowerCase()
      .replace(/\//g, "-") // Convert slashes to hyphens
      .replace(/\s+/g, "-") // Convert spaces to hyphens
      .replace(/[^\w-]/g, ""); // Remove other special characters
  };

  // Fixed collections data matching your requirements
  const collections = [
    {
      id: 1,
      category: "Chair",
      categoryId: "Chair",
      title: "Table and Chair Sets",
      image: "chair.jpg", // Table and chairs
      path: "/products/chair",
    },
    {
      id: 2,
      category: "Table",
      categoryId: "Dining Table",
      title: "Dining Table and Stools",
      image: "table.jpg", // Bar stools
      path: "/products/dining-table",
    },
    {
      id: 3,
      category: "Stools",
      categoryId: "Stool",
      title: "Bar Table and Stools",
      image: "stool.jpg", // Industrial furniture
      path: "/products/stool",
    },
    {
      id: 4,
      category: "Bar Stools",
      categoryId: "Barstool",
      title: "Bar Stools Collection",
      image: "barstool.JPG", // Replace with actual image path
      path: "/products/barstool",
    },
    {
      id: 5,
      category: "In-Stock",
      categoryId: "In-Stock",
      title: "Quick Turnaround Collection",
      image: "stool.jpg", // Replace with actual image path
      path: "/products/in-stock",
    },
  ];

  return (
    <div className="w-full mb-4 mt-8">
      <div className="w-[90%] mx-auto px-4">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl helvetica-bold text-center text-gray-800 mb-12">
          Our Collections
        </h2>

        {/* Collections Grid */}
        <div>
          {/* Mobile layout */}
          <div className="md:hidden w-full overflow-x-auto pb-6">
            <div className="flex gap-4 min-w-max pb-2">
              {collections.map((collection) => (
                <Link
                  href={`/products/${createCategorySlug(
                    collection.categoryId
                  )}`}
                  key={collection.id}
                  className="flex-shrink-0 w-64  rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
                >
                  {/* Image Container */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={`/${collection.image}`}
                      alt={collection.title}
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-xs md:text-sm poppins-light text-gray-600 uppercase tracking-wide mb-2">
                      {collection.category}
                    </p>
                    <h3 className="text-xl md:text-2xl poppins-bold text-gray-900 mb-4 leading-tight">
                      {collection.title}
                    </h3>
                    <button className="text-gray-800 cursor-pointer poppins-semi text-sm md:text-base hover:text-[#C49A6C] transition-colors duration-300 border-b border-gray-800 hover:border-[#C49A6C] pb-1">
                      Discover
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {collections.map((collection) => (
              <Link
                href={`/products/${createCategorySlug(collection.categoryId)}`}
                key={collection.id}
                className="rounded-lg border border-gray-300 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full">
                  <Image
                    src={`/${collection?.image}`}
                    alt={collection.title}
                    fill
                    className="object-contain h-full hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                {/* Content */}
                <div className="p-6">
                  <p className="text-xs md:text-sm poppins-light text-gray-600 uppercase tracking-wide mb-2">
                    {collection.category}
                  </p>
                  <h3 className="text-xl md:text-2xl poppins-bold text-gray-900 mb-4 leading-tight">
                    {collection.title}
                  </h3>
                  <button className="text-gray-800 cursor-pointer poppins-semi text-sm md:text-base hover:text-[#C49A6C] transition-colors duration-300 border-b border-gray-800 hover:border-[#C49A6C] pb-1">
                    Discover
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* See All Button */}
        <div className="text-center pt-4">
          <Link
            href="/categories"
            className="text-[#C49A6C] hover:text-[#B8875A] rounded-lg poppins-semi text-base cursor-pointer "
          >
            See All Collections
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurCollections;
