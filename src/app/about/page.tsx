import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Barbin Furnitures",
  description:
    "Discover Barbin Furnitures, a leader in premium hospitality furniture with over 30 years of experience. Explore our commitment to quality and service.",
  keywords: [
    "about us",
    "Barbin Furnitures",
    "hospitality furniture",
    "premium furniture",
    "Australian furniture",
    "commercial furniture",
  ],
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/about",
  },
};

const About = () => {
  return (
    <div className="flex flex-col">
      {/* Desktop Hero Section */}
      <section className="w-full px-4 py-8 hidden md:flex justify-center items-center">
        <div className="relative w-full max-w-5xl">
          {/* Background Image with clip-path */}
          <div className="relative overflow-hidden">
            <div
              className="w-full h-[500px]"
              style={{
                clipPath:
                  "polygon(0% 0%, 100% 0%, 99% 85%, 50% 85%, 50% 100%, 45% 100%, 0 100%)",
                WebkitClipPath:
                  "polygon(0% 0%, 100% 0%, 99% 85%, 50% 85%, 50% 100%, 45% 100%, 0 100%)",
              }}
            >
              <Image
                src="/about.jpg"
                alt="Hospitality"
                fill
                priority
                className="object-cover relative rounded-4xl"
              />
              <div className="bg-black/60 rounded-4xl absolute inset-0 w-full h-full"></div>
            </div>

            {/* Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-start px-6 md:px-12">
              <h1 className="text-white text-3xl md:text-5xl helvetica-bold leading-tight text-center md:text-left">
                <span className="text-[#C49A6C]">30 Years</span> at the Heart{" "}
                <br className="hidden md:block" /> of{" "}
                <span className="text-[#C49A6C]">Hospitality</span>.
              </h1>
            </div>
          </div>

          {/* Stats box */}
          <div className="mt-4 md:mt-0 w-1/2 md:w-auto max-w-sm md:max-w-sm">
            <div className="bg-[#4B2E1D] absolute md:-bottom-4 md:right-0 -translate-x-1/2 md:translate-x-0 text-white rounded-[20px] flex flex-col md:flex-row justify-between items-center px-4 py-4 lg:px-12 gap-4 md:gap-4 lg:gap-10 shadow-lg text-center">
              <div>
                <p className="text-xl poppins-semi">30+</p>
                <p className="text-xs opacity-60 poppins-light">
                  Years Experience
                </p>
              </div>
              <div>
                <p className="text-xl poppins-semi">2500+</p>
                <p className="text-xs opacity-60 poppins-light">
                  Successful Shipments
                </p>
              </div>
              <div>
                <p className="text-xl poppins-semi">1000+</p>
                <p className="text-xs opacity-60 poppins-light">
                  Happy Clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Hero Section */}
      <section className="w-full p-5 flex md:hidden flex-col items-center">
        <div className="w-full h-[400px] max-w-sm overflow-hidden rounded-2xl relative">
          <Image
            src="/about.jpg"
            alt="Hospitality"
            fill
            className="object-cover rounded-4xl"
          />
          <div className="bg-black/60 rounded-4xl absolute inset-0 w-full h-full"></div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-start px-4">
            <h2 className="text-white helvetica-bold text-3xl leading-snug">
              <span className="text-[#C49A6C]">30 Years</span> at the Heart{" "}
              <br />
              of <span className="text-[#C49A6C]">Hospitality</span>.
            </h2>
          </div>
        </div>

        {/* Stats box */}
        <div className="w-full">
          <div className="mt-6 w-full md:max-w-sm bg-[#4B2E1D] text-white rounded-xl px-3 py-4 flex justify-between text-center shadow-md">
            <div className="flex flex-col items-center gap-3">
              <p className="text-lg poppins-semi">30+</p>
              <p className="text-[10px] opacity-60 poppins-light">
                Years Experience
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-lg poppins-semi">2500+</p>
              <p className="text-[10px] opacity-60 poppins-light">
                Successful Shipments
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="text-lg poppins-semi">1000+</p>
              <p className="text-[10px] opacity-60 poppins-light">
                Happy Clients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who are we section */}
      <div className="flex flex-col md:flex-row min-h-fit mt-10 mb-20 md:mt-20 gap-8 md:gap-10 lg:gap-20 px-4 md:px-0">
        {/* Text Content */}
        <div className="w-full pr-0 md:pr-4 lg:pr-0 md:w-1/2 flex flex-col gap-5 order-1 md:order-2">
          <h2 className="helvetica-bold text-2xl md:text-3xl lg:text-4xl text-start md:text-left">
            Who are we ?
          </h2>
          <p className="w-full text-base poppins-light md:text-lg text-start md:text-left md:w-full lg:w-[80%]">
            For over three decades, Barbin Furniture has supplied Australia's
            hospitality industry with exceptionally well-made furniture. We're
            not just suppliers; we are partners who understand the need for
            style to meet strength.
          </p>
          <p className="w-full poppins-light text-base md:text-lg text-start md:text-left md:w-full lg:w-[80%]">
            Our legacy is built on a simple promise: to provide premium, durable
            furniture at a competitive price. We use our deep industry knowledge
            to help you create spaces that are built to last and designed to
            impress.
          </p>

          {/* Example link using Next.js */}
          <Link
            href="/contact"
            className="text-[#C49A6C] underline underline-offset-4 font-semibold"
          >
            Get in touch →
          </Link>
        </div>

        {/* Images */}
        <div className="w-full md:w-1/2 flex justify-center items-center h-auto md:h-1/2 relative order-2 md:order-1 mt-8 md:mt-0">
          <div className="relative flex justify-center w-full max-w-md md:max-w-none">
            <Image
              src="/about-1.png"
              alt="Barbin Furniture showcase"
              width={500}
              height={300}
              className="w-3/5 md:w-[80%] lg:w-1/2 object-cover h-48 md:h-72 rounded-2xl mx-auto md:mx-0"
            />
            <Image
              src="/about-2.png"
              alt="Barbin Furniture detail"
              width={400}
              height={250}
              className="w-2/5 md:w-[60%] lg:w-1/3 object-cover h-40 md:h-64 rounded-2xl absolute right-0 md:right-0 -bottom-8 md:-bottom-34 lg:-bottom-14"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
