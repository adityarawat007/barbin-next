"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HospitalitySlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
  {
    title: "The",
    titleHighlight: "Benchmark",
    titleEnd: "in",
    subtitle: "Hospitality Furniture.",
    description: "Premium durable furniture for Australia's leading venues.",
    image: "/1.webp"
  },
  {
    title: "Luxury",
    titleHighlight: "Meets",
    titleEnd: "",
    subtitle: "Comfort & Style.",
    description: "Sophisticated designs crafted for modern hospitality spaces.",
    image: "2.webp"
  },
  {
    title: "Commercial",
    titleHighlight: "Grade",
    titleEnd: "",
    subtitle: "Quality & Durability.",
    description: "Built to withstand the demands of high-traffic environments.",
    image: "3.webp"
  },
  {
    title: "Custom",
    titleHighlight: "Solutions",
    titleEnd: "",
    subtitle: "For Every Space.",
    description: "Tailored furniture solutions that match your venue's unique vision.",
    image: "4.webp"
  }
];

  const handleSlideChange = (newSlideIndex:any) => {
    if (isTransitioning || newSlideIndex === currentSlide) return;
    
    setIsTransitioning(true);
    
    // Start fade out
    setTimeout(() => {
      setCurrentSlide(newSlideIndex);
      // Complete fade in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    handleSlideChange(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    handleSlideChange(prevIndex);
  };

  const goToSlide = (index:any) => {
    handleSlideChange(index);
  };

  return (
    <div className="relative w-full h-[550px] md:h-[600px]   overflow-hidden">
      {/* Background Image with Fade Transition */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
          isTransitioning ? 'opacity-70 scale-105' : 'opacity-100 scale-100'
        }`}
        style={{
          backgroundImage: `url(${slides[currentSlide].image})`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Navigation Arrows - Desktop Only */}
      <button
        onClick={prevSlide}
       
        className={`hidden cursor-pointer md:flex absolute left-20 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300 shadow-lg z-50 items-center justify-center ${
          isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        
        className={`hidden cursor-pointer md:flex absolute right-20 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-300 shadow-lg z-50 items-center justify-center ${
          isTransitioning ? 'opacity-50 ' : 'opacity-100'
        }`}
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Content with Fade Transition */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-center md:px-8 transition-all duration-500 ${
        isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
      }`}>
        <div className="w-full p-3 mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl helvetica-bold text-white leading-tight">
            {slides[currentSlide].title} <span className="text-[#C49A6C]">{slides[currentSlide].titleHighlight}</span> {slides[currentSlide].titleEnd}
          </h1>
          
          {/* Subtitle with highlighted first word */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl helvetica-bold text-[#C49A6C] mb-4 md:mb-8 leading-tight">
            <span className="text-white">
              {slides[currentSlide].subtitle.split(' ')[0]}
            </span>
            {slides[currentSlide].subtitle.substring(slides[currentSlide].subtitle.indexOf(' '))}
          </h2>
          
          {/* Description */}
          <p className="text-md md:text-lg poppins-light lg:text-sm text-white opacity-70 mb-8 md:mb-12 max-w-2xl mx-auto">
            {slides[currentSlide].description}
          </p>

          {/* Action Buttons */}
          <div className="flex w-full flex-row gap-2 md:gap-4 justify-around md:justify-center items-center">
            <Link href="/products">
            <button className="bg-[#3C2415] cursor-pointer shrink-0 whitespace-nowrap border border-white text-white px-4 md:px-8 py-3 md:py-4 rounded-full text-[12px] md:text-lg poppins-semi transition-all duration-300 transform hover:scale-105 shadow-lg w-fit flex justify-center items-center gap-2 md:gap-4">
              Browse Products <ChevronRight className='w-4 h-4 md:w-5 md:h-5'/>
            </button>
            </Link>
            <Link href="/portfolio">
              <button className="bg-white  shrink-0 whitespace-nowrap cursor-pointer poppins-semi bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-6 md:px-8 py-3 md:py-4 rounded-full text-[15px] md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-fit">
                View Portfolio
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-[#C49A6C] scale-125' 
                : 'border border-[#C49A6C] hover:bg-opacity-75'
            } ${isTransitioning ? 'opacity-50 ' : 'opacity-100'}`}
          />
        ))}
      </div>

      {/* Mobile Navigation Arrows */}
      <div className="md:hidden  absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
        <button
          onClick={prevSlide}
         
          className={`bg-white cursor-pointer bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 shadow-lg ${
            isTransitioning ? 'opacity-50 ' : 'opacity-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
         
          className={`bg-white cursor-pointer bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all duration-300 shadow-lg ${
            isTransitioning ? 'opacity-50 ' : 'opacity-100'
          }`}
        >
          <ChevronRight className="w-5 h-5 text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default HospitalitySlider;