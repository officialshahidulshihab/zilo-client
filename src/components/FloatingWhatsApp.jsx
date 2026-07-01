"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "01866996873";

  useEffect(() => {
    // Show tooltip shortly after mount
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);

    // Hide tooltip after 3 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-[24px] right-[16px] z-[100] flex items-end gap-3 pointer-events-none">
      {/* Tooltip */}
      <div
        className={`bg-white border-2 border-[var(--color-ink)] shadow-md px-4 py-2 pointer-events-auto transition-all duration-300 transform origin-bottom-right ${
          showTooltip ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-[13px] font-bold text-[var(--color-ink)] m-0 leading-tight" style={{ fontFamily: "var(--font-bangla)" }}>
          সাহায্য লাগবে? WhatsApp করুন
        </p>
      </div>

      {/* Button */}
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-[var(--color-ink)] hover:scale-105 hover:bg-[#1EBE5D] transition-transform pointer-events-auto shrink-0"
        aria-label="Contact us on WhatsApp"
        onClick={() => setShowTooltip(false)}
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
