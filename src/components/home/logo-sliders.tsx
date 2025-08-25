"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const LogoSliders = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [animationId, setAnimationId] = useState(null);
  const startX = useRef(0);
  const containerRef = useRef(null);
  const scrollSpeed = 0.5; // pixels per frame for auto-scroll

  // Logo data with their respective links
  const logoData = [
    { src: "/1.png", link: "https://www.royalftghotel.com.au/", alt: "Logo" },
    { src: "/2.png", link: "https://www.oxford152.com.au/", alt: "Logo" },
    {
      src: "/3.png",
      link: "https://www.albanycreektavern.com.au/",
      alt: "Logo",
    },
    { src: "/4.png", link: "https://castellos.com.au/", alt: "Logo" },
    { src: "/5.png", link: "https://linkedin.com", alt: "LinkedIn" },
    {
      src: "/6.png",
      link: "https://www.cherryhilltavern.com.au/",
      alt: "Logo",
    },
    { src: "/7.png", link: "https://cobdengolf.com.au/", alt: "Logo" },
    { src: "/l8.png", link: "https://www.thepalacehotel.com.au", alt: "Logo" },
    { src: "/l9.png", link: "http://www.ryehotel.com.au/", alt: "Logo" },
  ];

  // Create multiple sets for seamless looping
  const repeatedLogos = [...logoData, ...logoData, ...logoData];

  const getClientX = (e: any) => {
    return e.touches ? e.touches[0].clientX : e.clientX;
  };

  // Auto-scroll animation
  useEffect(() => {
    if (!isDragging) {
      const animate = () => {
        setScrollPosition((prev) => {
          const logoWidth = 200; // Approximate width + gap
          const totalWidth = logoData.length * logoWidth;
          const newPos = prev - scrollSpeed;

          // Reset when one complete set has passed
          if (Math.abs(newPos) >= totalWidth) {
            return 0;
          }
          return newPos;
        });
        setAnimationId(requestAnimationFrame(animate) as any);
      };

      const id = requestAnimationFrame(animate);
      setAnimationId(id as any);

      return () => {
        if (id) {
          cancelAnimationFrame(id);
        }
      };
    } else {
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }
    }
  }, [isDragging]);

  const handleStart = (e: any) => {
    setIsDragging(true);
    const clientX = getClientX(e);
    startX.current = clientX;
    e.preventDefault();
  };

  const handleMove = (e: any) => {
    if (!isDragging) return;

    e.preventDefault();
    const clientX = getClientX(e);
    const deltaX = clientX - startX.current;

    setScrollPosition((prev) => {
      const logoWidth = 200;
      const totalWidth = logoData.length * logoWidth;
      let newPos = prev + deltaX * 0.8; // Reduce sensitivity for smoother feel

      // Keep position within bounds for seamless looping
      if (newPos > logoWidth) {
        newPos = newPos - totalWidth;
      } else if (newPos < -totalWidth - logoWidth) {
        newPos = newPos + totalWidth;
      }

      return newPos;
    });

    startX.current = clientX;
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleLeave = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-full mx-auto mb-10 overflow-hidden">
      <div
        ref={containerRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleLeave}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onContextMenu={handleContextMenu}
        className="cursor-grab active:cursor-grabbing select-none py-4"
        style={{
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        <div
          className="flex items-center gap-10 whitespace-nowrap"
          style={{
            transform: `translateX(${scrollPosition}px)`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            width: "max-content",
          }}
        >
          {repeatedLogos.map((logo, index) => (
            <div
              key={index}
              className="inline-block hover:opacity-80 transition-opacity duration-200 flex-shrink-0"
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault();
                }
              }}
            >
              <div className="relative h-24 w-full">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  className="object-contain"
                  loading="lazy"
                  draggable={false}
                  style={{ pointerEvents: isDragging ? "none" : "auto" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSliders;
