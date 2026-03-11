import HotelGallerySlider from "@/components/portfolio/hotel-gallery-slider";
import HotelGridSlider from "@/components/portfolio/hotel-grid-slider";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio - Barbin Furniture",
  description:
    "Explore our portfolio showcasing bespoke furniture solutions for Australia’s finest venues. From luxurious hotels to elegant restaurants, see how we transform spaces with custom designs that blend style and functionality.",
  keywords: [
    "portfolio",
    "Barbin Furnitures",
    "hospitality furniture",
    "premium furniture",
    "Australian furniture",
    "commercial furniture",
  ],
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/portfolio",
  },
};

const Portfolio = () => {
  return (
    <>
      <div className="flex flex-col gap-6 mt-12 lg:gap-10 max-w-7xl mx-auto">
        <div className="flex flex-col px-3  w-full   mx-auto  items-center justify-center">
          <h1 className="text-3xl md:text-5xl helvetica-bold w-full text-center">
            In The <span className="text-[#C49A6C]"> Finest</span> Venues.
          </h1>
          <div className="flex flex-col gap-10 text-center justify-center items-center">
            <h2 className="poppins-light">
              We are proud partners in creating Australia's most memorable
              spaces.
            </h2>
            <Link href="/contact">
              <button className=" text-xs w-fit poppins-semi px-6 py-4 bg-[#3C2415] text-white rounded-full cursor-pointer">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
        {/* <HotelGallerySlider/> */}
        <HotelGridSlider />
      </div>
    </>
  );
};

export default Portfolio;
