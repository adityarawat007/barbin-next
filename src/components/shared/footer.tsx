'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin, MoveUpRight } from 'lucide-react';

const Footer = () => {
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';

  return (
    <footer className="w-full">
      {/* Hero Banner */}
      <div className="flex w-full justify-center items-center py-8">
        <div className="flex flex-col w-full items-center justify-center gap-4 p-3">
          <div className="relative flex w-full h-[300px] md:h-[500px] md:w-[70%]">
            <Image
              src="/footer.jpg"
              alt="img"
              fill
              className="object-cover rounded-4xl"
              priority
            />
            <div className="absolute inset-0 bg-black/50 rounded-4xl flex flex-col justify-center items-center text-white p-4">
              <h2 className="text-white text-3xl md:text-5xl helvetica-bold mb-6 w-[60%] md:w-full text-center">
                Let&apos;s <span className="text-[#c49a6c]">Elevate</span> Your{' '}
                <span className="text-[#c49a6c]">Venue</span>.
              </h2>

              {isContactPage ? (
                <Link href="/products">
                  <button className="bg-[#3C2415] cursor-pointer poppins-semi text-white px-8 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                    Explore our Range
                    <MoveUpRight className="w-4 h-4" />
                  </button>
                </Link>
              ) : (
                <Link href="/contact">
                  <button className="bg-[#3C2415] cursor-pointer poppins-semi text-white px-8 py-3 rounded-full text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                    Schedule a Consultation
                    <MoveUpRight className="w-4 h-4" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/footerlogo.png"
                alt="Barbin Furniture Logo"
                width={200}
                height={64}
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-center space-x-4 md:space-x-12">
            <Link
              href="/about"
              className="hover:text-[#c49a6c] text-sm md:text-md poppins-bold transition-colors duration-300"
            >
              About
            </Link>
            <div className="w-0.5 h-8 md:h-12 bg-black" />
            <Link
              href="/products"
              className="hover:text-[#c49a6c] text-sm md:text-md poppins-bold transition-colors duration-300"
            >
              Products
            </Link>
            <div className="w-0.5 h-8 md:h-12 bg-black" />
            <Link
              href="/contact"
              className="hover:text-[#c49a6c] text-sm md:text-md poppins-bold transition-colors duration-300"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t w-full bg-[#3c2415] border-gray-200 p-6">
        <div className="flex w-full md:w-[90%] mx-auto flex-row justify-between items-center">
          {/* Social Media Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <a
              href="https://www.instagram.com/barbinfurniture?igsh=M3VvOTV0NDllN2Mw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#c49a6c] transition-colors duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/barbin-furniture/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#c49a6c] transition-colors duration-300"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-white poppins-semi text-xs md:text-[15px]">
            © 2025 Barbin Furniture
          </p>

          {/* Privacy Policy */}
          <Link
            href="/privacy-policy"
            className="text-white poppins-semi hover:text-[#c49a6c] text-xs md:text-[15px] transition-colors duration-300"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
