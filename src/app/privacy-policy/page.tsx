// app/privacy-policy/page.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Barbin Furnitures",
  description:
    "Barbin Furnitures is committed to protecting your privacy. Read our Privacy Policy to understand how we collect, use, and safeguard your personal information.",
  keywords:
    "privacy policy, Barbin Furnitures, personal information, data protection, Australian Privacy Principles",
  alternates: {
    canonical: "https://www.barbinfurniture.com.au/privacy-policy",
  },
};

const PrivacyPolicy = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-5xl helvetica-bold text-[#3C2415] mb-8 text-center">
        Privacy Policy
      </h1>

      {/* <p className="text-gray-700 poppins-light mb-8 text-center text-lg">
        Last updated: 25 July 2025
      </p> */}

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Introduction
        </h2>
        <p className="text-gray-700 poppins-light text-base">
          Barbin Furniture (“we”, “us”, “our”) is committed to protecting your
          privacy as an Australian furniture company. This Privacy Policy
          outlines how we collect, use, disclose, and safeguard your personal
          information in accordance with the Australian Privacy Principles
          (APPs) under the Privacy Act 1988 (Cth).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          What Personal Information We Collect
        </h2>
        <ul className="list-disc pl-6 text-gray-700 poppins-light text-base space-y-2">
          <li>Name, address, and contact details (including email and phone number)</li>
          <li>Order and purchase history</li>
          {/* <li>Payment information (processed securely via third-party providers)</li> */}
          <li>Enquiry and communication details</li>
          <li>Website usage data (such as IP address, browser type, and cookies)</li>
          <li>Any other information you provide to us directly or via our website</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          How We Collect Your Information
        </h2>
        <p className="text-gray-700 poppins-light text-base mb-2">
          We collect personal information in a variety of ways, including:
        </p>
        <ul className="list-disc pl-6 text-gray-700 poppins-light text-base space-y-2">
          <li>When you make a purchase or place an order</li>
          <li>When you contact us via our website, email, phone, or social media</li>
          <li>When you subscribe to our newsletter or marketing communications</li>
          <li>When you participate in promotions, surveys, or events</li>
          <li>Automatically through your use of our website (cookies and analytics)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Why We Collect and Use Your Information
        </h2>
        <ul className="list-disc pl-6 text-gray-700 poppins-light text-base space-y-2">
          <li>To process and fulfil your orders</li>
          <li>To communicate with you about your orders, enquiries, or requests</li>
          <li>To improve our products, services, and website experience</li>
          <li>To send you marketing and promotional materials (if you have opted in)</li>
          <li>To comply with legal obligations and resolve disputes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Disclosure of Your Information
        </h2>
        <p className="text-gray-700 poppins-light text-base mb-2">
          We may disclose your personal information to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 poppins-light text-base space-y-2">
          <li>
            Our employees and trusted service providers (such as delivery
            partners and payment processors)
          </li>
          <li>Third parties as required by law or to protect our rights</li>
          <li>Other parties with your consent or as otherwise permitted by law</li>
        </ul>
        <p className="text-gray-700 poppins-light text-base mt-2">
          We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Security of Your Information
        </h2>
        <p className="text-gray-700 poppins-light text-base">
          We take reasonable steps to protect your personal information from
          misuse, interference, loss, unauthorised access, modification, or
          disclosure. However, no method of transmission over the internet is
          completely secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Access and Correction
        </h2>
        <p className="text-gray-700 poppins-light text-base">
          You may request access to, or correction of, your personal information
          held by us at any time. Please contact us using the details below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Cookies and Analytics
        </h2>
        <p className="text-gray-700 poppins-light text-base">
          Our website uses cookies and similar technologies to enhance your
          browsing experience and analyse website traffic. You can manage your
          cookie preferences through your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Changes to This Policy
        </h2>
        <p className="text-gray-700 poppins-light text-base">
          We may update this Privacy Policy from time to time. The latest
          version will always be available on our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl md:text-2xl helvetica-bold text-[#c79f73] mb-4">
          Contact Us
        </h2>
        <p className="text-gray-700 poppins-light text-base">
          If you have any questions or concerns about our Privacy Policy or your
          personal information, please contact us at:
          <br />
          <span className="block mt-2 helvetica-bold text-[#3C2415]">
            Barbin Furniture
          </span>
          <span className="block">Email: info@barbinfurniture.com.au</span>
          <span className="block">Phone: +61 448 720 072</span>
          <span className="block">
            Address: Unit 3/5 Kinwal Ct Moorabbin VIC 3189 Australia
          </span>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
