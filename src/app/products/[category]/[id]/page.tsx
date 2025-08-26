'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star,  } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "@/components/firebase";
import SimilarProducts from '@/components/products/similar-products';
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';
import { Product } from './layout';

// Helper functions for product name slug conversion
const createProductSlug = (productName: string) => {
  return productName
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

// Helper function for category slug
const createCategorySlug = (category: string) => {
  return category
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};


export default function ProductDetail() {
  const params = useParams();
  const { id } = params;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sample reviews data (keeping as static as requested)
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent quality chair! Very comfortable and sturdy. Perfect for our restaurant."
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      date: "1 month ago",
      comment: "Great design and build quality. Easy to clean and maintain. Highly recommend."
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 5,
      date: "3 weeks ago",
      comment: "Beautiful chair that fits perfectly in our cafe. Customers love the comfort."
    }
  ];

  // Fetch product data from Firebase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching product with slug:", id);
        
        // First, try to find by exact name match (for backward compatibility)
        let productRef = collection(db, 'products');
        const idStr = Array.isArray(id) ? id[0] : id;
        let q = query(productRef, where('name', '==', idStr.trim()));
        let querySnapshot = await getDocs(q);
        
        // If not found by exact name, search all products and match by slug
        if (querySnapshot.empty) {
          console.log("Exact name not found, searching by slug...");
          const allProductsQuery = query(collection(db, 'products'));
          const allProductsSnapshot = await getDocs(allProductsQuery);
          
          // Find product where the slug matches
          let foundProduct = null;
          allProductsSnapshot.forEach(doc => {
            const data = doc.data();
            const productSlug = createProductSlug(data.name);
            const idStr = Array.isArray(id) ? id[0] : id;
            if (productSlug === idStr.trim()) {
              foundProduct = {
                id: doc.id,
                ...data
              };
            }
          });
          
          if (foundProduct) {
            setProduct(foundProduct);
            console.log("Product found by slug:", foundProduct);
            setError("");
          } else {
            console.log("Product not found by slug either");
            setError('Product not found');
          }
        } else {
          // Found by exact name
          const productDoc = querySnapshot.docs[0];
          const productData = {
            id: productDoc.id,
            ...productDoc.data()
          };
          setProduct(productData as Product);
          console.log("Product found by exact name:", productData); 
          setError("");
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const addToCart = () => {
    if (!product) {
      toast.error('Product details are not loaded.');
      return;
    }
    try {
      // Get existing cart from localStorage or initialize empty array
      const existingCart = JSON.parse(localStorage.getItem('cart') as any) || [];
      
      // Check if product already exists in cart (using product name, not slug)
      interface CartItem {
        id: string;
        quantity: number;
      }
      const existing: CartItem[] = JSON.parse(localStorage.getItem('cart') as string) || [];
      const existingItemIndex: number = existing.findIndex((item: CartItem) => item.id === product.name);

      if (existingItemIndex !== -1) {
        // Product exists, update quantity
        existing[existingItemIndex].quantity += quantity;
      } else {
        // Product doesn't exist, add new item (using product name as ID)
        existing.push({
          id: product.name, // Store actual product name, not slug
          quantity: quantity
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Optional: Show success message or update UI
      toast.success('Product added to cart successfully');
      
    } catch (error) {
      toast.error('Error adding product to cart:');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-[90%] flex flex-col mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C] mx-auto mb-4"></div>
            <p className="text-gray-600 poppins-light">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-[90%] flex flex-col mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 poppins-light mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#3C2415] text-white rounded-lg poppins-light hover:bg-[#2a1a0e] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No product found
  if (!product) {
    return (
      <div className="w-[90%] flex flex-col mx-auto py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 poppins-light">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[90%] flex flex-col mx-auto py-6">
      <ToastContainer autoClose={2000} />
      
      <h1 className='mb-5 text-[#9A9A9A] text-sm poppins-light'>
        <Link href='/products' className="hover:text-[#3C2415]">Products</Link> {">"} 
        <Link 
          href={`/products/${createCategorySlug(product.category)}`}
          className="hover:text-[#3C2415]"
        >
          {product.category || 'Category'}
        </Link> {">"} 
        <span className='text-[#3C2415] poppins-semi'> {product.name} </span>
      </h1>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
        
        {/* Left side - Product Images */}
        <div className="border w-full md:w-1/2 border-gray-300 rounded-3xl p-4 flex gap-4 justify-center">
          <div className="flex w-full gap-4">
            {/* Main product image */}
            <div className="flex-1 flex items-center justify-center">
              <Image 
                src={product.images && product.images[selectedImage] ? product.images[selectedImage] : '/chair.jpg'} 
                alt={product.name} 
                width={500}
                height={500}
                className="w-full h-auto max-w-sm object-contain"
                priority
              />
            </div>

            {/* Thumbnail images */}
            {product.images && product.images.length > 1 && (
              <div className="flex flex-col gap-3 mr-5">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 p-2 flex items-center justify-center bg-gray-50 hover:border-gray-300 transition-colors ${
                      selectedImage === index ? 'border-gray-400' : 'border-gray-200'
                    }`}
                  >
                    <Image 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Product Details */}
        <div className="flex-1 w-full md:max-w-lg">
          {/* Product Title */}
          <h1 className="text-xl md:text-2xl lg:text-4xl helvetica text-gray-900 mb-3">
            {product.name}
          </h1>

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="">
              <h3 className="helvetica-bold text-gray-900 mb-3 text-sm md:text-base">Key Features:</h3>
              
              <div className="grid grid-cols-1 gap-2 md:gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex gap-4 md:gap-6">
                    <span className="text-black poppins-semi text-sm md:text-base">{feature.title}:</span>
                    <span className="text-gray-600 poppins-light text-sm md:text-base">{feature.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {product.category === 'Gaming' ? (
            <p className="text-gray-600 poppins-light text-sm md:text-base mt-4">
              All Gaming Stools have handles. <br />
              Note: Custom finishes available for all products.
            </p>
          ) : (
            <p className="text-gray-600 poppins-light text-sm md:text-base mt-4">
              Note: Custom finishes available for all products.
            </p>
          )}
        </div>
      </div>

      <SimilarProducts id={typeof id === 'string' ? id : Array.isArray(id) ? id[0] ?? '' : ''} category={product.category} />
    </div>
  );
}