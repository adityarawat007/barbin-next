"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const LogoSliders = () => {
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

  return (
    <div className="max-w-full mx-auto mb-10 overflow-hidden">
      <Marquee
        speed={40}
        gradient={false}
        autoFill
        className="py-4"
        aria-label="Client logos"
      >
        {logoData.map((logo) => (
          <a
            key={logo.src}
            href={logo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mx-5 inline-block h-24 w-[200px] shrink-0 hover:opacity-80 transition-opacity duration-200"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="object-contain"
              sizes="200px"
              loading="lazy"
              draggable={false}
            />
          </a>
        ))}
      </Marquee>
    </div>
  );
};

export default LogoSliders;
