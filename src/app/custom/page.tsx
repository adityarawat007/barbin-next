import CustomProjectForm from "@/components/custom/custom-project";
import ProcessSteps from "@/components/custom/process-steps";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: 'Custom Projects - Barbin Furniture',
  description: 'Discover our custom furniture solutions designed for unique spaces. From concept to creation, we bring your vision to life with bespoke designs that reflect your style and functionality needs.',
  keywords: [
    "custom projects",
    "Barbin Furnitures",
    "hospitality furniture",
    "premium furniture",
    "Australian furniture",
    "commercial furniture",
  ],
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/custom",
  },
}

const Custom = () => {
  return (
    <>
      <div className="flex flex-col items center">
        <div className="flex w-full justify-center mt-5">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl md:text-4xl helvetica-bold  text-center leading-12">
              {" "}
              <span className="text-[#C49A6C]">Bespoke</span> Furniture.
              <br />
              Your <span className="text-[#C49A6C]"> Vision</span>, Crafted.
            </h1>

            <p className="text-xs md:text-sm text-center mt-8 poppins-light">
              We create custom furniture solutions tailored to your venue's
              unique identity.
            </p>
          </div>
        </div>
        <ProcessSteps />
        <CustomProjectForm />
      </div>
    </>
  );
};

export default Custom;
