"use client";

import { useEffect, useState } from "react";

const CALCULATOR_API_URL =
  "https://internal.gearedfinance.com.au/api/PartnerCalculator/GetCalculatorWidgetURL?CalculatorName=Hosfurm&Amount=20000&ApiKey=fd3ca74f-33f8-4490-9e83-ae1e8b3a607f";

export function GearedFinanceCalculator() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(CALCULATOR_API_URL)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error("Failed to load"))))
      .then((text) => setUrl(text.trim()))
      .catch((err) => console.error("Error loading widget:", err));
  }, []);

  if (!url) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-gray-500 text-sm">
        Loading finance calculator...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <iframe
        src={url}
        title="Geared Finance Calculator"
        className="w-full h-[510px]"
        loading="lazy"
      />
    </div>
  );
}
