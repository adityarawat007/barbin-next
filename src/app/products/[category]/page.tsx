"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
  startAfter,
  where,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/components/firebase";
import { ChevronsDown, ChevronsUp, Search } from "lucide-react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { Product } from "./[id]/layout";

const PRODUCTS_PER_PAGE = 12;

// Helper functions for URL slug conversion
const createCategorySlug = (category: string) => {
  return category
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

const createProductSlug = (productName: string) => {
  return productName
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

const parseCategoryFromSlug = (slug: string | undefined) => {
  if (!slug) return null;

  // Special mapping for categories with slashes
  const specialMappings: Record<string, string> = {
    "side-coffee-table": "Side/Coffee Table",
    "dining-coffee-table": "Dining/Coffee Table",
    // Add more mappings as needed
  };

  // Check if it's a special case first
  if (specialMappings[slug]) {
    return specialMappings[slug];
  }

  // Default conversion for regular categories
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function CategoryProducts() {
  const params = useParams<{ category?: string }>();
  const router = useRouter();
  const categoryFromURL = parseCategoryFromSlug(params.category);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryFromURL || "All"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [sentinelRef, inView] = useInView({ threshold: 0 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchSuggestions, setSuggestions] = useState<Product[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Handle URL parameter changes
  useEffect(() => {
    const categoryFromURL = parseCategoryFromSlug(params.category);
    if (categoryFromURL && categoryFromURL !== selectedCategory) {
      setSelectedCategory(categoryFromURL);
    } else if (!categoryFromURL && selectedCategory !== "All") {
      setSelectedCategory("All");
    }
  }, [params.category, selectedCategory]);

  // Fetch categories and first batch of products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let q;
        if (selectedCategory === "All") {
          q = query(collection(db, "products"), limit(PRODUCTS_PER_PAGE));
        } else {
          q = query(
            collection(db, "products"),
            where("category", "==", selectedCategory),
            limit(PRODUCTS_PER_PAGE)
          );
        }
        const snapshot = await getDocs(q);
        const newProducts = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
        );
        setProducts(newProducts);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === PRODUCTS_PER_PAGE);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catSnapshot = await getDocs(query(collection(db, "products")));
        const catSet = new Set<string>();
        catSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category) catSet.add(data.category as string);
        });
        setCategories(["All", ...Array.from(catSet)]);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading) {
      handleLoadMore();
    }
  }, [inView]);

  // Load more products (pagination)
  const handleLoadMore = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    setError("");
    try {
      let q;
      if (selectedCategory === "All") {
        q = query(
          collection(db, "products"),
          startAfter(lastDoc),
          limit(PRODUCTS_PER_PAGE)
        );
      } else {
        q = query(
          collection(db, "products"),
          where("category", "==", selectedCategory),
          startAfter(lastDoc),
          limit(PRODUCTS_PER_PAGE)
        );
      }
      const snapshot = await getDocs(q);
      const newProducts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Product)
      );
      setProducts((prev) => [...prev, ...newProducts]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === PRODUCTS_PER_PAGE);
    } catch (err) {
      setError("Failed to load more products. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    setProducts([]);
    setLastDoc(null);
    setHasMore(true);
    setError("");

    // Update URL using Next.js router
    if (newCategory === "All") {
      router.push("/products");
    } else {
      const categorySlug = createCategorySlug(newCategory);
      router.push(`/products/${encodeURIComponent(categorySlug)}`);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setDropdownVisible(value.length > 0);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.length > 0) {
      const timeout = setTimeout(async () => {
        try {
          const searchQuery = query(collection(db, "products"));
          const snapshot = await getDocs(searchQuery);
          const searchResults = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Product)
          );

          const filteredResults = searchResults.filter((product) =>
            product.name?.toLowerCase().includes(value.toLowerCase())
          );

          setSuggestions(filteredResults);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
          setSuggestions([]);
        }
      }, 300);

      setSearchTimeout(timeout);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchInput(product.name);
    setDropdownVisible(false);
    setSearchOpen(false);
    router.push(
      `/products/${createProductSlug(product.category)}/${createProductSlug(
        product.name
      )}`
    );
  };

  const executeSearch = () => {
    setSearchTerm(searchInput.trim());
    setDropdownVisible(false);
    if (searchInput.trim() === "") {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") return;
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "products"),
          orderBy("name"),
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff")
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Product)
        );
        setProducts(results);
        setHasMore(false);
      } catch (err) {
        setError("Failed to search products.");
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchSearchResults();
    } else {
      setSelectedCategory(selectedCategory);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        searchContainerRef.current &&
        !(searchContainerRef.current as HTMLDivElement).contains(
          event.target as Node
        )
      ) {
        setSearchOpen(false);
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSkipToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSkipToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white py-8">
        <div className="w-[90%] mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C] mx-auto mb-4"></div>
              <p className="text-gray-600 poppins-light">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white py-8">
      <div className="w-[90%] mx-auto px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="poppins-light">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm poppins-light hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          ref={topRef}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <h1 className="text-4xl md:text-5xl helvetica-bold text-gray-800 mb-4 md:mb-0">
            {selectedCategory !== "All"
              ? selectedCategory
              : "Our Standard Range"}
          </h1>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm poppins-light text-gray-500">
            <Link href="/">Home</Link> &gt;{" "}
            <Link href="/products">Products</Link>
            {selectedCategory !== "All" && (
              <span>
                {" "}
                &gt; <span className="text-[#C49A6C]">{selectedCategory}</span>
              </span>
            )}
          </p>
        </div>

        <div className="mb-6 w-full flex items-center justify-between gap-3">
          <div className="flex w-[90%] md:w-1/2 items-center gap-3 relative">
            <div className="w-full relative" ref={searchContainerRef}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      executeSearch();
                    }
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder="Search products by name..."
                  className="w-full px-4 py-2 rounded-lg text-sm poppins-light bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C49A6C] transition-colors duration-300"
                />
                <button onClick={executeSearch} className="px-3 py-2">
                  <Search
                    size={20}
                    className="cursor-pointer text-gray-500 hover:text-gray-800"
                  />
                </button>
              </div>

              {/* Search Dropdown */}
              {searchOpen &&
                dropdownVisible &&
                searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 h-[300px] overflow-y-auto rounded-lg shadow-lg z-50 mt-1">
                    {searchSuggestions.map((product, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSuggestionClick(product)}
                      >
                        <Search size={16} className="mr-3 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm poppins-semi text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs poppins-light text-gray-500">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Skip to bottom button */}
          <button
            onClick={handleSkipToBottom}
            title="move to bottom"
            className="px-4 py-2 rounded-full poppins-semi text-sm"
          >
            <ChevronsDown className="inline-block mr-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {products
            .filter((product) =>
              product.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((product, idx) => (
              <Link
                key={product.id}
                href={`/products/${createProductSlug(
                  product.category
                )}/${createProductSlug(product.name)}`}
                className=""
              >
                <div
                  className="aspect-square"
                  ref={idx === products.length - 1 ? bottomRef : null}
                >
                  <Image
                    src={product.images?.[0] || product.image || "/chair.jpg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-fit h-full rounded-xl hover:scale-105 transition-all duration-300"
                    loading="lazy"
                    onError={() => {}} // Next.js Image does not support onError for fallback, so leave empty
                  />
                </div>
                <div className="px-2 py-3">
                  <div className="flex w-full justify-between items-start">
                    <h3 className="text-sm md:text-base poppins-semi text-gray-800 line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-xs poppins-light text-gray-500 mt-1">
                    {product.category}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        <div className="flex mt-5 w-full justify-end mb-4">
          {products.length >= 8 && (
            <div className="flex mt-5 w-full justify-end mb-4">
              <button
                onClick={handleSkipToTop}
                title="move to top"
                className="px-4 py-2 rounded-full poppins-semi text-sm"
              >
                <ChevronsUp className="inline-block mr-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 cursor-pointer" />
              </button>
            </div>
          )}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={{ height: 1 }}></div>
        {loadingMore && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C49A6C]"></div>
          </div>
        )}

        {/* No Products Message */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg poppins-semi text-gray-600">
              No products found
              {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}.
            </p>
            {selectedCategory !== "All" && (
              <Link
                href="/products"
                className="mt-4 inline-block px-6 py-2 bg-[#3C2415] text-white rounded-full poppins-semi hover:bg-[#2a1a0e] transition-colors"
              >
                View All Products
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
