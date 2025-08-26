"use client"; // ✅ Needed if you use state/hooks inside Next.js App Router

import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart, X } from "lucide-react";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { db } from "@/components/firebase"; // ✅ adjust path
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image"; // ✅ Next.js Image
import Link from "next/link"; // ✅ Next.js Link

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ✅ Fetch cart items
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);

        if (cart.length === 0) {
          setLoading(false);
          return;
        }

        const productPromises = cart.map(async (item: any) => {
          const productDoc = doc(db, "products", item.id);
          const productSnapshot = await getDoc(productDoc);

          if (productSnapshot.exists()) {
            return {
              id: productSnapshot.id,
              ...productSnapshot.data(),
            };
          }
          return null;
        });

        const productResults = await Promise.all(productPromises);
        const productsMap: Record<string, any> = {};

        productResults.forEach((product) => {
          if (product) {
            productsMap[product.id] = product;
          }
        });

        setProducts(productsMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const updateCart = (newCartItems: any[]) => {
    setCartItems(newCartItems);
    localStorage.setItem("cart", JSON.stringify(newCartItems));
  };

  const increaseQuantity = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (productId: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    updateCart(updatedCart);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    updateCart([]);
    toast.success("Cart cleared");
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.id];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      const cartItemsWithDetails = cartItems.map((item) => ({
        productId: item.id,
        productName: products[item.id]?.name || "Unknown Product",
        quantity: item.quantity,
        price: products[item.id]?.price || 0,
        total: (products[item.id]?.price || 0) * item.quantity,
      }));

      const quoteRequest = {
        customerInfo: { ...formData },
        cartItems: cartItemsWithDetails,
        totalAmount: calculateTotal(),
        createdAt: new Date(),
        status: "pending",
      };

      await addDoc(collection(db, "requestquote"), quoteRequest);

      updateCart([]);
      setFormData({ name: "", email: "", phone: "" });
      setShowModal(false);

      toast.success(
        "Quote request submitted successfully! We will contact you soon."
      );
    } catch (error) {
      console.error("Error submitting quote request:", error);
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Loading
  if (loading) {
    return (
      <div className="w-[90%] mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C49A6C] mx-auto mb-4"></div>
            <p className="text-gray-600 poppins-light">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="w-[90%] mx-auto py-8">
        <div className="flex items-center justify-center h-64">
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

  return (
    <div className="w-[90%] mx-auto py-8">
      <ToastContainer autoClose={2000} />

      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl helvetica-bold text-gray-800 mb-4">
          Shopping Cart
        </h1>
        <p className="text-gray-600 poppins-light">
          Review your selected items and request a quote
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl helvetica-bold text-gray-600 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 poppins-light mb-6">
            Add some products to get started
          </p>

          {/* ✅ Use Link instead of window.location.href */}
          <Link
            href="/products"
            className="px-6 py-3 bg-[#3C2415] text-white rounded-full poppins-semi hover:bg-[#2a1a0e] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between">
                <h2 className="text-xl helvetica-bold text-gray-900">
                  Cart Items ({cartItems.length})
                </h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-600 poppins-light text-sm hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const product = products[item.id];
                  if (!product) return null;

                  return (
                    <div key={item.id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* ✅ Next.js Image */}
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={
                              product.images?.[0] || product.image || "/chair.jpg"
                            }
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="helvetica-bold text-gray-900 mb-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 poppins-light text-sm mb-2">
                            {product.category}
                          </p>
                          <p className="text-lg helvetica-bold text-[#3C2415]">
                            ${product.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-full">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="p-2 hover:bg-gray-200 rounded-l-full transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 poppins-semi">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="p-2 hover:bg-gray-200 rounded-r-full transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <p className="text-lg helvetica-bold text-gray-900">
                          Subtotal: ${(product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ✅ Right summary stays same */}
          {/* ✅ Modal logic unchanged (just removed <img>) */}
        </div>
      )}
    </div>
  );
};

export default Cart;
