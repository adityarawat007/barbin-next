import { Metadata } from "next";
import { GearedFinanceCalculator } from "@/components/finance/geared-finance-calculator";

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
    <>
      <section className="mt-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Finance Options
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Use our Geared Finance calculator to estimate repayments tailored
              to your purchase amount.
            </p>
          </div>

          <GearedFinanceCalculator />
        </div>
      </section>
    </>
  );
};

export default Finance;
