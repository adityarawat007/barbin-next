'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

interface PortfolioItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
}

const HotelGallerySlider = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [activeCard, setActiveCard] = useState<number>(0);
  const [mobileActiveCard, setMobileActiveCard] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);

      const portfolioQuery = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(portfolioQuery);

      const items: PortfolioItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<PortfolioItem, 'id'>),
      }));

      const grouped = [];
      for (let i = 0; i < items.length; i += 3) {
        grouped.push(items.slice(i, i + 3));
      }

      setPortfolioData(grouped);
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to load portfolio. Please try again later.');

      // fallback data
      const fallback: PortfolioItem[][] = [[
        {
          id: 1,
          title: 'The Royal Hotel, Richmond',
          description: 'Supplied our durable Rochester dining chairs and custom booth seating...',
          imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
        },
        {
          id: 2,
          title: 'Modern Dining Experience',
          description: 'Contemporary furniture solutions for upscale dining.',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        },
        {
          id: 3,
          title: 'Luxury Seating Solutions',
          description: 'Premium upholstered chairs and custom banquettes crafted for style.',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        },
      ]];

      setPortfolioData(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
    setActiveCard(0);
    setMobileActiveCard(0);
  }, [portfolioData]);

  const totalSlides = portfolioData.length;
  const currentSlideData = portfolioData[currentSlide] || [];
  const activeCardData = currentSlideData[activeCard];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    setActiveCard(0);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    setActiveCard(0);
  };

  const handleMobileNext = () => {
    const nextIndex = (mobileActiveCard + 1) % currentSlideData.length;
    setMobileActiveCard(nextIndex);
    scrollToCard(nextIndex);
  };

  const handleMobilePrev = () => {
    const prevIndex = (mobileActiveCard - 1 + currentSlideData.length) % currentSlideData.length;
    setMobileActiveCard(prevIndex);
    scrollToCard(prevIndex);
  };

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C2415] mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error && portfolioData.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#3C2415] text-white rounded-lg hover:bg-[#2a1a0e] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (portfolioData.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white flex items-center justify-center h-96">
        <p className="text-gray-600">No portfolio items available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      {/* === Desktop View === */}
      <div className="hidden md:block">
        <div className="flex gap-4 h-96 mb-8">
          {currentSlideData.map((card, index) => (
            <div
              key={card.id}
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
                activeCard === index ? 'flex-1' : 'w-48 ring-2 ring-[#3C2415] hover:opacity-80'
              }`}
              onClick={() => setActiveCard(index)}
            >
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 ${activeCard === index ? 'bg-black/40' : 'bg-black/20'}`} />
              {activeCard === index && (
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-2xl helvetica-bold mb-3">{card.title}</h2>
                  <p className="text-sm poppins-semi leading-relaxed mb-4 max-w-md">{card.description}</p>
                </div>
              )}
              <Link href="#" className={`absolute ${activeCard === index ? 'top-6 right-6' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'} transition-all`}>
                <div className={`${activeCard === index ? 'w-12 h-12' : 'w-8 h-8'} bg-white rounded-full flex items-center justify-center`}>
                  <ArrowUpRight className={`${activeCard === index ? 'w-6 h-6' : 'w-4 h-4'} text-gray-800`} />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={handlePrev} disabled={totalSlides <= 1} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-50">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex gap-2">
            {portfolioData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setActiveCard(0);
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'bg-[#3C2415] w-16' : 'bg-gray-300 w-3'
                }`}
              />
            ))}
          </div>
          <button onClick={handleNext} disabled={totalSlides <= 1} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full disabled:opacity-50">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* === Mobile View === */}
      <div className="block md:hidden">
        <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide gap-4 mb-8 snap-x snap-mandatory">
          {currentSlideData.map((card) => (
            <div key={card.id} className="flex-shrink-0 w-full h-80 relative overflow-hidden rounded-2xl snap-start">
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h2 className="text-2xl helvetica-bold mb-3">{card.title}</h2>
                <p className="text-sm poppins-light leading-relaxed mb-4">{card.description}</p>
              </div>
              <Link href="#" className="absolute top-6 right-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-gray-800" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={handleMobilePrev} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50" disabled={currentSlideData.length <= 1}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button onClick={handleMobileNext} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50" disabled={currentSlideData.length <= 1}>
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelGallerySlider;
