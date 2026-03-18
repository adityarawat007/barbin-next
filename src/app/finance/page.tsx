import { Metadata } from "next";
import { GearedFinanceCalculator } from "@/components/finance/geared-finance-calculator";
import Image from "next/image";
import Link from "next/link";

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
                  <span className="text-[#C49A6C]">
                    Best Hospitality Finance
                  </span>{" "}
                  options in Australia.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center flex-col md:gap-12 gap-8">
          {/* Geared Finance intro block */}
          <div className="flex flex-col gap-6">
            {/* Logo + label row */}
            <div className="flex items-center gap-3">
              <Image
                src="/geared-logo.png"
                alt="Geared Finance Logo"
                className=" filter brightness-0 "
                width={300}
                height={300}
              />
            </div>

            {/* Heading + body copy */}
            <div className="max-w-4xl space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1F2933]">
                Simple, Flexible Equipment Finance Now Available.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#4B5563] leading-relaxed">
                Looking to upgrade or purchase new equipment for your business?
                We&apos;ve partnered with Geared Finance, a specialist
                commercial lender, to offer flexible equipment finance options —
                helping you get the gear you need without the upfront cash flow
                hit.
              </p>
            </div>

            {/* CTA button */}
            <div>
              <Link target="_blank" href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0ubfX1u95dyh_B-4nwaPGDdsXekYqYr8qk6wSgjefTgCuJZ0svbyy9rYl5JcokOQZ1VhGcv_Ti">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center px-6 py-3 rounded-full bg-[#8B3A2A] hover:bg-[#6f2e21] text-white text-sm md:text-base font-semibold shadow-sm transition-colors"
                >
                  Request a Callback
                </button>
              </Link>
            </div>
          </div>

          {/* Calculator */}
          <GearedFinanceCalculator />
        </div>
      </section>
    </div>
  );
};

export default Finance;
