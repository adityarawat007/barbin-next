"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  description: string;
  images: string[];
}

const HOTELS: Hotel[] = [
  {
    id: "royal",
    name: "The Royal Hotel",
    description:
      "Supplied our durable Rochester dining chairs and custom booth seating to create a timeless, inviting atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "palace",
    name: "The Palace Hotel Camberwell",
    description:
      "Contemporary furniture solutions that blend comfort with sophisticated design for upscale dining.",
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop",
    ],
  },
  {
    id: "brighton",
    name: "Brighton Beach Hotel",
    description:
      "Premium upholstered chairs and custom banquettes crafted for durability and style.",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=400&fit=crop",
    ],
  },
];

const GRID_SLOTS = 6;

const HotelGridSlider = () => {
  const [selectedId, setSelectedId] = useState<string>(HOTELS[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const currentHotel = HOTELS.find((h) => h.id === selectedId) ?? HOTELS[0];
  const displayImages = currentHotel.images.slice(0, GRID_SLOTS);
  const allImages = currentHotel.images;
  const extraCount = Math.max(0, currentHotel.images.length - GRID_SLOTS);
  const showOverlay = extraCount > 0;
  const totalImages = allImages.length;

  const openModal = useCallback((index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const goPrev = useCallback(() => {
    setModalImageIndex((i) => (i - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goNext = useCallback(() => {
    setModalImageIndex((i) => (i + 1) % totalImages);
  }, [totalImages]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal, goPrev, goNext]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-white">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left column – hotel list */}
        <div className="w-full lg:w-[320px] lg:min-w-[520px] flex flex-col gap-3">
          {HOTELS.map((hotel) => {
            const isSelected = hotel.id === selectedId;
            return (
              <button
                key={hotel.id}
                type="button"
                onClick={() => setSelectedId(hotel.id)}
                className={`text-left p-4 md:p-5 rounded-xl transition-colors cursor-pointer duration-200 ${
                  isSelected
                    ? "bg-[#3C2415] text-white"
                    : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-[#3440541A]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl mb-1">{hotel.name}</h3>
                    {isSelected && (
                      <p className="text-base font-normal text-[#E0CBB0] leading-relaxed">
                        {hotel.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-[#E0CBB0]" : "text-gray-800"}`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column – image grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 lg:gap-4 aspect-[4/3] min-h-[280px] max-h-[400px] md:max-h-[480px] lg:max-h-[520px] w-full">
            {displayImages.map((src, index) => {
              const isFirst = index === 0;
              const isLast = index === GRID_SLOTS - 1;
              const hasOverlay = isLast && showOverlay;

              return (
                <button
                  type="button"
                  key={`${currentHotel.id}-${index}`}
                  onClick={() => openModal(index)}
                  className={`relative overflow-hidden rounded-xl md:rounded-2xl cursor-pointer border-0 p-0 text-left block w-full h-full min-h-0 ${
                    isFirst ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${currentHotel.name} ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes={
                      isFirst
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 33vw, 25vw"
                    }
                  />
                  {hasOverlay && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-0.5 text-white pointer-events-none">
                      <span className="text-2xl ">+{extraCount}</span>
                      <span className="text-xs md:text-sm poppins-semi uppercase tracking-wide">
                        View all
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image lightbox modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-6 modal-backdrop-in"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div
            className="absolute inset-0"
            onClick={closeModal}
            onKeyDown={(e) => e.key === "Enter" && closeModal()}
            role="button"
            tabIndex={0}
            aria-label="Close"
          />
          <div className="relative z-10 flex flex-col items-center w-full max-w-5xl pt-14 md:pt-16 pb-6 md:pb-8">
            {/* Close button – above image area */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Row: prev arrow | image container | next arrow */}
            <div className="relative flex items-center justify-center w-full px-14 md:px-16 lg:px-20">
              {/* Prev – left of image */}
              {totalImages > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-20 flex-shrink-0"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}

              {/* Image container – fixed width/height so controls stay outside */}
              <div className="relative w-full max-w-4xl h-[65vh] min-h-[280px] max-h-[600px] rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                <div
                  key={modalImageIndex}
                  className="relative w-full h-full hotel-grid-cell-in"
                  style={{ animationDelay: "0ms" }}
                >
                  <Image
                    src={allImages[modalImageIndex]}
                    alt={`${currentHotel.name} image ${modalImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 90vw, 896px"
                  />
                </div>
              </div>

              {/* Next – right of image */}
              {totalImages > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-20 flex-shrink-0"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
            </div>

            {/* Pagination pill – below image */}
            <div className="mt-4 md:mt-5 px-4 py-2 rounded-full bg-white text-gray-900 poppins-semi text-sm md:text-base shadow-lg">
              {modalImageIndex + 1} / {totalImages}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelGridSlider;
