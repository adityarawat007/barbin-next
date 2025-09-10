"use client"

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../components/firebase'; // adjust as needed
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { sendContactEmail } from '@/utils/emailService';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    reason: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
  
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.reason) {
        throw new Error('Please fill in all required fields');
      }
  
      // Save to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new',
      });
  
      // Send email through API route
      const { success, error } = await sendContactEmail({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });
  
      if (!success) {
        throw new Error(error || 'Failed to send email');
      }
  
      setSubmitStatus('success');
  
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        reason: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting contact message: ', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      <section className="w-full px-4 py-12 flex flex-col md:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="md:w-1/2 md:text-left">
          <h1 className="text-3xl md:text-5xl helvetica-bold mb-4">
            Let&apos;s <span className="text-[#C98B4B]">Connect</span>
          </h1>
          <p className="text-gray-700 text-lg mb-6 poppins-light">
            For product information, custom inquiries, or to schedule a consultation, please get in touch.
          </p>
          <Image
            src="/Group.png"
            alt="Contact Illustration"
            width={400}
            height={400}
            className="w-1/2 object-cover max-w-sm md:mx-0"
          />
        </div>

        {/* Right Section - Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="md:w-1/2 bg-white rounded-2xl shadow-md p-6 md:p-10 poppins-semi border border-gray-300"
        >
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p className="poppins-light">Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="poppins-light">Sorry, there was an error sending your message. Please try again.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm poppins-semi">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name here*"
                className="w-full border border-gray-300 rounded-xl h-12 px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C98B4B]"
                required
              />
            </div>
            <div>
              <label className="text-sm poppins-semi">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name here*"
                className="w-full border border-gray-300 rounded-xl h-12 px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C98B4B]"
                required
              />
            </div>
            <div>
              <label className="text-sm poppins-semi">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-xl h-12 px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C98B4B]"
              />
            </div>
            <div>
              <label className="text-sm poppins-semi">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address*"
                className="w-full border border-gray-300 rounded-xl h-12 px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C98B4B]"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm poppins-semi">Select Reason</label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-xl h-12 px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C98B4B]"
                required
              >
                <option value="">Select here</option>
                <option value="product">Product Info</option>
                <option value="custom">Custom Inquiry</option>
                <option value="consultation">Schedule a Consultation</option>
              </select>
            </div>
            <div className="col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-sm poppins-semi">Message</label>
                <span className="text-sm text-gray-500">Optional</span>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter text here..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C98B4B]"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-6 cursor-pointer rounded-full px-6 py-4 text-sm roboto-bold transition ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-[#4B2E1D] text-white hover:bg-[#3c2418]'
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Send us message'}
          </button>
        </form>
      </section>

      <div className="flex w-full justify-center md:w-4xl mx-auto flex-col items-center gap-4 mb-5 mt-5">
        <h2 className="text-2xl text-center md:text-4xl helvetica-bold">
          Want to talk to an <span className="text-[#c98b4b]">expert</span> right away?
        </h2>
        <div className="flex flex-col w-full items-center gap-2">
          <h2 className="text-2xl poppins-semi">David Hohepa</h2>
          <h3 className="text-lg poppins-light text-gray-600">National Sales Manager</h3>
          <div className="flex flex-col items-center md:flex-row gap-2 mt-3 md:gap-10">
            <a
              href="tel:+61448720072"
              className="flex items-center gap-2 text-lg text-[#4B2E1D] underline cursor-pointer"
            >
              <Phone size={16} />
              +61 448 720 072
            </a>
            <a
              href="mailto:d.hohepa@barbinfurniture.com.au"
              className="flex items-center gap-2 text-lg text-[#4B2E1D] underline cursor-pointer"
            >
              <Mail size={16} />
              d.hohepa@barbinfurniture.com.au
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
