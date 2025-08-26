// app/contact/page.tsx

import { Metadata } from 'next';
import Contact from './page-client';

export const metadata: Metadata = {
  title: 'Contact Us | Barbin Furnitures',
  description:
    "Get in touch with Barbin Furnitures for product information, custom inquiries, or to schedule a consultation. We're here to help you create the perfect space.",
  keywords:
    'contact, Barbin Furnitures, product information, custom inquiries, consultation, hospitality furniture, commercial furniture',
  alternates: {
    canonical: 'https://www.barbinfurniture.com.au/contact',
  },
};

export default function ContactPage() {
  return (
    <Contact />
  );
}

