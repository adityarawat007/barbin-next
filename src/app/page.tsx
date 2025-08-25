import OurCollections from "@/components/home/collections";
import HospitalitySlider from "@/components/home/hospitality-slider";
import LogoSliders from "@/components/home/logo-sliders";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <HospitalitySlider />
      <OurCollections />
      <LogoSliders /> 
    </div>
  );
}
