import { Metadata } from "next";

import BarbinSlider from "@/components/home/barbinslider";
import OurCollections from "@/components/home/collections";
import FAQ from "@/components/home/faq";
import HospitalitySlider from "@/components/home/hospitality-slider";
import LogoSliders from "@/components/home/logo-sliders";
import Testimonials from "@/components/home/testimonials";

export const metadata: Metadata = {
  title: "Barbin Furniture - Trusted by Leading Venues",
  description: "Elevate your venue with Barbin Furniture's exquisite range.",
  keywords: [
    "Barbin Furnitures",
    "hospitality furniture",  
    "premium furniture",
    "Australian furniture",
    "commercial furniture",
  ],
  alternates: {
    canonical: "https://www.barbinfurniture.com.au",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <HospitalitySlider />
      <OurCollections />
      <LogoSliders />
      <FAQ />
      <Testimonials />
      <BarbinSlider />
    </div>
  );
}
