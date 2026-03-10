import { Metadata } from "next";
import { GearedFinanceCalculator } from "@/components/finance/geared-finance-calculator";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Finance - Barbin Furniture",
  description:
    "Explore our finance options and how we can help you finance your furniture needs.",
  keywords: [
    "finance",
    "Barbin Furnitures",
    "finance",
    "finance options",
    "finance your furniture needs",
  ],
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/finance",
  },
};

const Finance = () => {
  return (
    <div className="flex flex-col gap-14">
      <section className=" px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[220px] sm:min-h-[280px] md:min-h-[580px]">
            <Image
              src="/hero-finance.jpg"
              alt="Hospitality finance"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 sm:px-10 md:px-14 py-8 max-w-4xl">
                <h1 className="text-white helvetica-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  We provide you with the{" "}
                  <span className="text-[#C49A6C]">Best Hospitality Finance</span>{" "}
                  options in Australia.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <div className="gap-2 flex flex-col">
            <h2 className="text-3xl font-bold text-black">
              Use our calculator to get started
            </h2>
            <p className=" text-lg text-[#3C2F2FB2]/70">
              Let's calculate your monthly or weekly repayments and find a
              finance solution customised to you.
            </p>
          </div>

          <GearedFinanceCalculator />
        </div>
      </section>
    </div>
  );
};

export default Finance;
