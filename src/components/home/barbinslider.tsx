"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    title: "The Barbin Standard",
    subtitle: "Established & Reliable.",
    description:
      "Over 30 years of trusted service to the Australian hospitality industry.",
    image: "/owner.png",
  },
  {
    title: "The Barbin Way",
    subtitle: "Trusted & Professional.",
    description:
      "Delivering excellence in every project with industry-leading standards.",
    image: "/owner.png",
  },
  {
    title: "The Barbin Promise",
    subtitle: "Quality & Commitment.",
    description:
      "We're committed to providing high-quality service you can rely on.",
    image: "/owner.png",
  },
];

const BarbinSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);

  const prevSlide = () =>
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );

  const slide = slides[currentIndex];

  return (
    <div className="flex flex-col bg-amber-300 mb-40 lg:mb-40 min-h-fit">
      <div className="bg-gray-300 h-[450px] md:h-[530px] px-0 py-14 lg:py-0 md:px-6 lg:px-20 -mt-5">
        <div className=" w-full lg:max-w-7xl mt-20  mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Left Section - Title and Button */}
          <div className="hidden md:block -mt-[15%] w-xs text-center md:text-left">
            {/* Dots indicator */}
            <div className="flex gap-2 justify-center md:justify-start mb-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentIndex
                      ? "bg-[#3C2415]"
                      : "border border-[#3C2415] rounded-full"
                  }`}
                />
              ))}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl helvetica-bold mb-8 leading-tight">
              {slide.title.split(" ").map((word, i) =>
                word === "Barbin" ? (
                  <span key={i} className="text-[#C49A6C]">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </h2>
            <Link href="/contact">
              <button className="bg-[#3C2415] text-white px-6 py-3 rounded-full text-sm poppins-semi hover:bg-amber-800 transition-colors duration-300">
                Request a Quote
              </button>
            </Link>
          </div>

          {/* Desktop/Tablet Center and Right Section */}
          <div className="hidden  md:flex flex-row justify-start lg:justify-center items-end gap-5">
            <div className="flex flex-col bg-[#D8B48F] w-[70%] lg:w-md h-[400px] lg:h-[550px] justify-center p-6 rounded-2xl">
              <h2 className="text-4xl lg:text-5xl helvetica-bold mb-4 leading-tight text-[#563827]">
                {slide.subtitle.split(" & ").map((text, i) => (
                  <React.Fragment key={i}>
                    {text}
                    {i === 0 && slide.subtitle.includes(" & ") && " "}
                    {i === 0 && slide.subtitle.includes(" & ") && (
                      <span className="text-black"> & </span>
                    )}
                  </React.Fragment>
                ))}
              </h2>
              <p className="text-xl lg:text-2xl poppins-light leading-relaxed">
                {slide.description}
              </p>
            </div>

            {/* Right Section - Image and Navigation */}
            <div className="w-[80%] lg:w-md flex items-center relative justify-between lg:justify-start gap-4">
              <div className="bg-[#563827] w-[275px] lg:w-[360px] h-[280px]  rounded-xl">
                <div className="rounded-xl h-[435px] md:w-[90%] md:h-[420px] lg:h-[500px]  lg:w-full  -top-[50%] lg:-top-[79%]  absolute  md:-left-[12%] lg:-left-[14%]">
                  <Image
                    src={slide.image}
                    alt="Professional worker"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full cursor-pointer bg-white text-gray-800 shadow-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full cursor-pointer bg-[#3C2415] text-white shadow-lg hover:bg-amber-950 transition-colors duration-300 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col -mt-20  px-2 items-start w-full space-y-6">
            {/* Dots indicator */}
            <div className="flex gap-2 justify-center mb-4">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentIndex
                      ? "bg-[#3C2415]"
                      : "border border-[#3C2415] rounded-full"
                  }`}
                />
              ))}
            </div>

            {/* Mobile Title */}
            <h2 className="text-3xl font-bold  leading-tight  w-[50%]">
              {slide.title.split(" ").map((word, i) =>
                word === "Barbin" ? (
                  <span key={i} className="text-[#C49A6C]">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </h2>

            {/* Mobile Button */}
            <Link href="/contact">
              <button className="bg-[#3C2415] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-amber-800 transition-colors duration-300">
                Request a Quote
              </button>
            </Link>

            {/* Mobile Content - Side by Side */}

            <div className="flex flex-row  w-full gap-4 justify-between items-end">
              {/* Info Card */}
              <div className="flex flex-col  bg-[#D8B48F] w-[60%] h-[250px] justify-center p-4 rounded-xl">
                <h2 className="text-xl helvetica-bold mb-2 leading-tight text-[#563827]">
                  {slide.subtitle.split(" & ").map((text, i) => (
                    <React.Fragment key={i}>
                      {text}
                      {i === 0 && slide.subtitle.includes(" & ") && <br />}
                      {i === 0 && slide.subtitle.includes(" & ") && (
                        <span className="text-black">& </span>
                      )}
                    </React.Fragment>
                  ))}
                </h2>
                <p className="text-xs poppins-light leading-relaxed text-[#563827]">
                  {slide.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex  justify-center    w-[50%]  ">
                <div className="bg-[#563827] w-[100%] h-[140px] relative rounded-xl ">
                  <div className="rounded-md w-[100%] object-cover   h-[150%]  absolute right-1 bottom-0  z-50">
                    <Image
                      src="/owner.png"
                      loading="lazy"
                      alt="Professional worker"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="md:hidden  flex w-full gap-2 justify-center">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white text-gray-800 shadow-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-[#3C2415] text-white shadow-lg hover:bg-amber-950 transition-colors duration-300 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarbinSlider;
