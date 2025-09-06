"use client";

import React, { useState, useCallback } from "react";
import { Link as LinkIcon } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { sendCustomOrderEmail } from "@/utils/emailService";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectDetails: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectDetails: "",
};

const uploadFileToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

const CustomProjectForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/svg+xml",
        ];
        if (!allowedTypes.includes(file.type)) {
          alert(
            "Please select a valid image file (JPEG, PNG, GIF, WebP, or SVG)"
          );
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB");
          return;
        }

        setSelectedFile(file);
      }
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { firstName, lastName, email, phone, projectDetails } = formData;

      if (!firstName || !lastName || !email || !projectDetails) {
        throw new Error("Please fill in all required fields");
      }

      let fileUrl = "";
      if (selectedFile) {
        fileUrl = await uploadFileToCloudinary(selectedFile);
      }

      await addDoc(collection(db, "customOrders"), {
        ...formData,
        fileUrl,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      const { success, error } = await sendCustomOrderEmail({
        firstName,
        lastName,
        email,
        phone,
        projectDetails,
        fileUrl,
      });

      if (!success) {
        throw new Error(error || "Failed to send custom order email");
      }

      setSubmitStatus("success");
      setFormData(initialFormData);
      setSelectedFile(null);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <h2 className="text-2xl md:text-4xl helvetica-bold text-center mb-8">
        Have a Custom Project in Mind?
      </h2>

      <div className="bg-[#EEEEEE] p-8 rounded-lg">
        <form onSubmit={handleSubmit}>
          {/* Status Message */}
          {submitStatus === "success" && (
            <p className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg poppins-light">
              Thank you! Your inquiry has been submitted.
            </p>
          )}
          {submitStatus === "error" && (
            <p className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg poppins-light">
              Something went wrong. Please try again.
            </p>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {["firstName", "lastName"].map((field) => (
              <div key={field}>
                <label className="block text-sm poppins-light mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1")} *
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  required
                  className="w-full poppins-light px-3 py-2 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C2415] focus:border-transparent"
                />
              </div>
            ))}
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm poppins-light mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full poppins-light px-3 py-2 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C2415] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm poppins-light mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full poppins-light px-3 py-2 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C2415] focus:border-transparent"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-6">
            <label className="block text-sm poppins-light mb-2">
              Project Details *
            </label>
            <textarea
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleInputChange}
              rows={6}
              required
              placeholder="Please describe your custom furniture project, including dimensions, materials, style preferences, and any specific requirements..."
              className="w-full poppins-light px-3 py-2 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3C2415] focus:border-transparent resize-none"
            />
          </div>

          {/* File Upload + Submit */}
          <div className="flex justify-end items-center gap-3">
            <input
              type="file"
              id="file-upload"
              hidden
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer hover:text-gray-800 text-gray-600"
            >
              <LinkIcon className="w-5 h-5" />
            </label>
            {selectedFile && (
              <span className="text-xs poppins-light">{selectedFile.name}</span>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-10 py-4 rounded-full poppins-light transition-colors ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3C2415] text-white hover:bg-[#2a1a0e]"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomProjectForm;
