import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "Barbin Furniture",
  description:
    "Elevate your venue with Barbin Furniture's exquisite range. Premium hospitality furniture designed for style, comfort, and durability. Explore our collections today!",
  keywords:
    "furniture, Barbin Furnitures, hospitality furniture, commercial furniture, Australian furniture",
  alternates: {
    canonical: "https://www.barbinfurniture.com.au",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "../../public/favicon.ico",
  },
  openGraph: {
    title: "Barbin Furniture",
    description:
      "Elevate your venue with Barbin Furniture's exquisite range. Premium hospitality furniture designed for style, comfort, and durability. Explore our collections today!",
    url: "https://www.barbinfurniture.com.au",
    siteName: "Barbin Furniture",
    images: [
      {
        url: "https://www.barbinfurniture.com.au/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Barbin Furniture Preview",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbin Furniture",
    description:
      "Elevate your venue with Barbin Furniture's exquisite range. Premium hospitality furniture designed for style, comfort, and durability. Explore our collections today!",
    site: "@barbinfurniture",
    creator: "@barbinfurniture",
    images: ["https://www.barbinfurniture.com.au/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
