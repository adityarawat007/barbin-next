import BarbinSlider from "@/components/home/barbinslider";
import OurCollections from "@/components/home/collections";
import FAQ from "@/components/home/faq";
import HospitalitySlider from "@/components/home/hospitality-slider";
import LogoSliders from "@/components/home/logo-sliders";
import Testimonials from "@/components/home/testimonials";

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
