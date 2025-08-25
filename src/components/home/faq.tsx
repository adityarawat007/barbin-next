"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";

const fallbackFAQs = [
  {
    question: "What Makes Barbin Furniture Different From Other Hospitality Furniture Suppliers?",
    answer: "Barbin Furniture combines over 30 years of industry experience with a commitment to uncompromising quality...",
  },
  {
    question: "Can I Customize Furniture For My Venue?",
    answer: "Absolutely! We offer comprehensive customization services...",
  },
  {
    question: "What Types Of Furniture Does Barbin Offer?",
    answer: "We specialize in commercial-grade hospitality furniture...",
  },
  {
    question: "How Can I See Examples Of Your Work?",
    answer: "You can view our portfolio on our website featuring projects...",
  },
  {
    question: "How Do I Get Started With Barbin Furniture?",
    answer: "Getting started is easy! Simply contact our team for a consultation...",
  },
];

type FAQItem = {
  id?: string;
  question: string;
  answer: string;
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const faqsQuery = query(collection(db, "faqs"));
        const querySnapshot = await getDocs(faqsQuery);

        const faqs = querySnapshot.docs.map(doc => {
          const data = doc.data() as FAQItem;
          return {
            id: doc.id,
            question: data.question,
            answer: data.answer,
          };
        });

        setFaqData(faqs);
        setError(null);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load FAQs. Please try again later." as any);
        setFaqData(fallbackFAQs);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
};

  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl helvetica-bold mb-4">
            <span className="text-[#C49A6C]">Frequently</span> Asked Questions
          </h2>
          <p className="text-gray-600 poppins-light text-sm">
            Need something cleared up? Here are our most frequently asked Questions!
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border-2 p-3 md:p-10 border-gray-200">
            <div className="px-6 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C49A6C] mx-auto mb-4" />
              <p className="text-gray-600 poppins-light">Loading FAQs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border-2 p-3 md:p-10 border-gray-200 text-center">
            <p className="text-red-600 poppins-light mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#3C2415] text-white rounded-lg poppins-light hover:bg-[#2a1a0e] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* FAQ Content */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl border-2 p-3 md:p-10 border-gray-200">
            <div className="px-6 mb-6">
              <h3 className="text-2xl helvetica-bold text-[#3C2415]">FAQs</h3>
            </div>

            <div className="divide-y divide-gray-200">
              {faqData.map((item, index) => (
                <div key={item?.id || index} className="transition-all duration-200">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between"
                  >
                    <h4 className="text-xs md:text-lg helvetica-bold text-black pr-4">
                      {item?.question}
                    </h4>
                    <div className="flex-shrink-0">
                      {openIndex === index ? (
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                          <Minus className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                          <Plus className="w-3 h-3 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </button>

                  {openIndex === index && (
                    <div className="px-6 pb-5 animate-fadeIn">
                      <p className="text-xs md:text-lg poppins-light text-gray-600 leading-relaxed">
                        {item?.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FAQ;
