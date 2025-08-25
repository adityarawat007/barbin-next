"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import classNames from 'classnames';

const testimonials = [
  {
    id: 1,
    title: 'Excellent Value for Money',
    content: 'Our restaurant staff find the seating very comfortable and the reservation system is easy to use.',
    source: 'Google Reviews',
    author: 'John Carter',
    position: 'Manager, Perth'
  },
  {
    id: 2,
    title: 'Review from an every day Buyer',
    content: 'The quality is outstanding, and their team was a dream to work with. Our guests always compliment the stylish, comfortable vibe!',
    source: 'Facebook',
    author: 'Sarah Thompson',
    position: 'Restaurant Owner, Melbourne'
  },
  {
    id: 3,
    title: 'Perfect for our cafe ambiance',
    content: 'Loved the booth seating options. It elevated our cafe look and feel, and customers are loving the comfort.',
    source: 'Instagram',
    author: 'Ella Martin',
    position: 'Cafe Owner, Sydney'
  },  
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

const getMaxIndex = () => {
    const width = window.innerWidth;
  if (width < 768) return testimonials.length - 1;
 
  if (window.innerWidth >= 768 && window.innerWidth < 1024) return testimonials.length - 1; // tablet
  return testimonials.length - 2; // desktop
};


const [maxIndex, setMaxIndex] = useState(getMaxIndex());
console.log("MaxIndex",maxIndex);

useEffect(() => {
  const update = () => {
    setIsMobile(window.innerWidth < 768);
    setMaxIndex(getMaxIndex());
  };
  update();
  window.addEventListener('resize', update);
  return () => window.removeEventListener('resize', update);
}, []);


  const nextSlide = () => {
    setCurrent((prev) => (prev < maxIndex ? prev + 1 : 0));
    
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  return (
    <div className="bg-[#EEEEEE] py-10 px-4 md:px-2 mt-20">
      <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-8">
        {/* Testimonial Slider */}
        <div className="flex overflow-hidden  md:w-[50%] lg:w-[60%]">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${current * (isMobile ? 60 : 30)}%)`
            }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={t.id}
                className={classNames(
                  'bg-white rounded-xl shadow-md p-6 m-2 w-[60%] md:w-[300px] lg:[300px] shrink-0 transition-all duration-300',
                  {
                    'opacity-40 md:scale-[0.95]': !isMobile && idx !== current && idx !== current + 1,
                    'opacity-100': isMobile ? idx === current : idx === current || idx === current + 1
                  }
                )}
              >
                <p className="text-7xl inter mb-2 italic">"</p>
                <h3 className="helvetica-bold text-2xl mb-5">{t.title}</h3>
                <p className="text-lg poppins-light text-gray-600 mb-8">{t.content}</p>
                <p className="text-sm  text-[#C49A6C] helvetica-bold mb-1">Source - {t.source}</p>
                <p className="poppins-semi text-sm">{t.author}</p>
                <p className="italic poppins-light text-xs text-gray-500">{t.position}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description + Arrows */}
        <div className="flex flex-col justify-between w-full md:w-1/2">
          <div className="mb-6">
            <h2 className="text-xl md:text-3xl w-full  md:w-[90%] lg:w-[70%] helvetica-bold mb-3">
              Trusted by <span className="text-[#C49A6C]">Australia’s</span> Finest Venues
            </h2>
            <p className="text-gray-700 text-sm md:text-xl poppins-light w-full md:w-[90%]">
              Barbin Furniture transformed our dining space with their Rochester chairs and custom booth seating. 
              The quality is outstanding, and their team was a dream to work with. 
              Our guests always compliment the stylish, comfortable vibe!
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-[#3A240F] text-white flex items-center justify-center">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
