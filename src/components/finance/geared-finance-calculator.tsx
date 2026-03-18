"use client";

import { useEffect, useState } from "react";

const CALCULATOR_API_URL =
  process.env.NEXT_PUBLIC_GEARED_FINANCE_CALCULATOR_API_URL ?? "";

export function GearedFinanceCalculator() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!CALCULATOR_API_URL) {
      console.error(
        "Missing NEXT_PUBLIC_GEARED_FINANCE_CALCULATOR_API_URL environment variable.",
      );
      return;
    }
    fetch(CALCULATOR_API_URL)
      .then((res) =>
        res.ok ? res.text() : Promise.reject(new Error("Failed to load")),
      )
      .then((text) => setUrl(text.trim()))
      .catch((err) => console.error("Error loading widget:", err));
  }, []);

  if (!url) {
    return (
      <div className="w-full h-[505px] rounded-2xl overflow-hidden bg-gray-400 animate-pulse" />
    );
  }

  return (
    <div className="w-full mx-auto  rounded-lg md:h-[505px] h-[1100px] overflow-auto ">
      <iframe
        src={url}
        title="Geared Finance Calculator"
        className="w-full h-full select-none rounded-2xl border-0 "
        loading="lazy"
      />
    </div>
  );
}
