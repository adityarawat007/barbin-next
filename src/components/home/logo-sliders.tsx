"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const LogoSliders = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationId = useRef<number | null>(null);
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
    { src: "/l9.png", link: "https://www.ryehotel.com.au/", alt: "Logo" },
  ];

  // Create multiple sets for seamless looping
  const repeatedLogos = [...logoData, ...logoData, ...logoData];

  const getClientX = (e: TouchEvent | MouseEvent): number => {
    if ("touches" in e && e.touches.length > 0) {
      return e.touches[0].clientX;
    } else if ("clientX" in e) {
      return e.clientX;
    }
    return 0;
  };

  // Auto-scroll animation
  useEffect(() => {
    if (!isDragging) {
      const animate = () => {
        setScrollPosition((prev) => {
          const logoWidth = 200;
          const totalWidth = logoData.length * logoWidth;
          const newPos = prev - scrollSpeed;

          return Math.abs(newPos) >= totalWidth ? 0 : newPos;
        });

        animationId.current = requestAnimationFrame(animate);
      };

      animationId.current = requestAnimationFrame(animate);

      return () => {
        if (animationId.current) {
          cancelAnimationFrame(animationId.current);
          animationId.current = null;
        }
      };
    } else {
      // If dragging starts, stop animation
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
      }
    }
  }, [isDragging, logoData.length]);

  type DragEvent =
    | React.MouseEvent<HTMLDivElement>
    | React.TouchEvent<HTMLDivElement>;

  const handleStart = (e: DragEvent) => {
    setIsDragging(true);
    const clientX = getClientX(e.nativeEvent as TouchEvent | MouseEvent);
    startX.current = clientX;
    e.preventDefault();
  };

  interface MoveEvent extends React.MouseEvent<HTMLDivElement> {
    nativeEvent: MouseEvent;
  }
  interface TouchMoveEvent extends React.TouchEvent<HTMLDivElement> {
    nativeEvent: TouchEvent;
  }
  type MoveDragEvent = MoveEvent | TouchMoveEvent;

  const handleMove = (e: MoveDragEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    const clientX = getClientX(e.nativeEvent as TouchEvent | MouseEvent);
    const deltaX = clientX - startX.current;

    setScrollPosition((prev: number) => {
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

  interface ContextMenuEvent extends React.MouseEvent<HTMLDivElement> {
    nativeEvent: MouseEvent;
  }

  const handleContextMenu = (e: ContextMenuEvent) => {
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
              <div className="relative h-24 w-[200px]">
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
