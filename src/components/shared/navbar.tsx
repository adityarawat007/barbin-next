"use client";
import { ChevronDown, Phone, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";

// Helper function for URL slug conversion
const createCategorySlug = (category: string) => {
  return category
    .toLowerCase()
    .replace(/\//g, "-") // Convert slashes to hyphens
    .replace(/\s+/g, "-") // Convert spaces to hyphens
    .replace(/[^\w-]/g, ""); // Remove other special characters
};

const Navbar = () => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showProductsDropdown, setShowProductsDropdown] =
    useState<boolean>(false);
  const [showMobileProductsDropdown, setShowMobileProductsDropdown] =
    useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const Categories = [
    "Chair",
    "Stool",
    "Barstool",
    "Dining Table",
    "Bar Table",
    "Side/Coffee Table",
    "Lounge Chair",
    "Outdoor",
    "Gaming",
    "Sofa",
    "Booth Seating",
    "Function Furniture",
  ];

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const catSnapshot = await getDocs(query(collection(db, "products")));
        const catSet = new Set<string>();
        catSnapshot.forEach((doc) => {
          const data = doc.data();
          if (typeof data.category === "string") catSet.add(data.category);
        });
        setCategories(Array.from(catSet));
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Function to determine if a link is active
  const isActiveLink = (linkPath: string) => {
    return path === linkPath;
  };

  // Function to get link classes based on active state
  const getLinkClasses = (linkPath: string) => {
    return isActiveLink(linkPath)
      ? "text-[#b48458] poppins-semi"
      : "text-black poppins-semi hover:text-[#b48458]";
  };

  // Function to close mobile menu when link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Handle dropdown hover with delay
  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowProductsDropdown(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowProductsDropdown(false);
    }, 150); // 150ms delay before hiding
    setHoverTimeout(timeout);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  return (
    <nav className="bg-white h-24 w-full z-50 relative">
      <div className="max-w-screen-xl lg:max-w-[95%] h-full relative flex items-center justify-between mx-auto py-4">
        {/* Logo - centered in mobile/tablet, left in desktop */}
        <div className="flex absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 lg:justify-start">
          <Link href="/" className="flex items-center space-x-2 h-20 lg:h-24">
            <div className="relative h-full w-[145px] lg:w-[145px]">
              <Image
                src="/Logonav.png"
                alt="Logo"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 120px, 145px"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Hamburger menu - right in mobile/tablet */}
        <div className="lg:hidden flex items-center absolute right-4 z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Center nav links in desktop */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <ul className="flex space-x-8 font-medium text-lg">
            <li>
              <Link href="/" className={getLinkClasses("/")}>
                Home
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center cursor-pointer">
                <Link href="/products" className={getLinkClasses("/products")}>
                  Products
                </Link>
                <ChevronDown
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                    showProductsDropdown ? "rotate-180" : ""
                  } ${path === "/products" ? "text-[#b48458]" : "text-black"}`}
                />
              </div>

              {/* Products Dropdown */}
              {showProductsDropdown && (
                <div
                  className="absolute top-full left-0 pt-2 w-48 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="py-2">
                      <Link
                        href="/products"
                        className="block px-4 py-2 text-sm poppins-semi text-gray-700 hover:bg-gray-100 hover:text-[#b48458]"
                      >
                        All Products
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      {loadingCategories ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : (
                        Categories.map((category) => (
                          <Link
                            key={category}
                            href={`/products/${encodeURIComponent(
                              createCategorySlug(category)
                            )}`}
                            className="block px-4 py-2 text-sm poppins-light text-gray-700 hover:bg-gray-100 hover:text-[#b48458]"
                          >
                            {category}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link href="/custom" className={getLinkClasses("/custom")}>
                Custom
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className={getLinkClasses("/portfolio")}>
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/about" className={getLinkClasses("/about")}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={getLinkClasses("/contact")}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* CTA button on right (only on desktop) */}
        <div className="hidden lg:flex lg:order-2 items-center gap-3">
          {/* Contact Icons */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+61448720072"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Call us: +61 448 720 072"
            >
              <Phone size={18} className="text-gray-600 hover:text-[#b48458]" />
            </a>
            <a
              href="mailto:d.hohepa@barbinfurniture.com.au"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Email us: d.hohepa@barbinfurniture.com.au"
            >
              <Mail size={18} className="text-gray-600 hover:text-[#b48458]" />
            </a>
          </div>

          {/* Request Quote Button */}
          <Link href="/contact">
            <button
              onClick={handleLinkClick}
              className="px-5 py-2 border cursor-pointer poppins-semi border-black rounded-full text-sm hover:bg-black hover:text-white transition"
            >
              Request a Quote
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile & Tablet Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 absolute top-full left-0 right-0 z-40 shadow-lg">
          <ul className="flex flex-col items-center py-4 space-y-4 font-medium text-md">
            <li>
              <Link
                href="/"
                className={getLinkClasses("/")}
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex flex-col items-center space-y-2 w-full">
                <button
                  type="button"
                  className={`w-full flex items-center justify-center gap-2 ${getLinkClasses(
                    "/products"
                  )}`}
                  onClick={() => setShowMobileProductsDropdown((prev) => !prev)}
                >
                  Products
                  {/* <ChevronDown
        className={`w-4 h-4 transition-transform duration-200 ${showMobileProductsDropdown ? 'rotate-180' : ''}`}
      /> */}
                </button>
                {showMobileProductsDropdown && (
                  <div className="flex flex-col items-center space-y-2 w-full mt-2">
                    <Link
                      href="/products"
                      className="text-sm poppins-light text-gray-600 hover:text-[#b48458] w-full text-start"
                      onClick={() => {
                        handleLinkClick();
                        setShowMobileProductsDropdown(false);
                      }}
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/products/${encodeURIComponent(
                          createCategorySlug(category)
                        )}`}
                        className="text-sm poppins-light text-gray-600 hover:text-[#b48458] w-full text-start"
                        onClick={() => {
                          handleLinkClick();
                          setShowMobileProductsDropdown(false);
                        }}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
            <li>
              <Link
                href="/custom"
                className={getLinkClasses("/custom")}
                onClick={handleLinkClick}
              >
                Custom
              </Link>
            </li>
            <li>
              <Link
                href="/portfolio"
                className={getLinkClasses("/portfolio")}
                onClick={handleLinkClick}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={getLinkClasses("/about")}
                onClick={handleLinkClick}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={getLinkClasses("/contact")}
                onClick={handleLinkClick}
              >
                Contact
              </Link>
            </li>

            {/* Contact Icons for Mobile */}
            <li>
              <div className="flex items-center justify-center gap-4 mt-2">
                <a
                  href="tel:+61448720072"
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Call us: +61 448 720 072"
                  onClick={handleLinkClick}
                >
                  <Phone size={18} className="text-gray-600" />
                  <span className="text-xs poppins-light text-gray-600">
                    Call
                  </span>
                </a>
                <a
                  href="mailto:d.hohepa@barbinfurniture.com.au"
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Email us: d.hohepa@barbinfurniture.com.au"
                  onClick={handleLinkClick}
                >
                  <Mail size={18} className="text-gray-600" />
                  <span className="text-xs poppins-light text-gray-600">
                    Email
                  </span>
                </a>
              </div>
            </li>

            <li>
              <Link href="/contact">
                <button
                  onClick={handleLinkClick}
                  className="mt-2 px-5 py-2 poppins-semi border border-black rounded-full text-sm hover:bg-black hover:text-white transition"
                >
                  Request a Quote
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
