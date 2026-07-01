"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SERVICES = [
  {
    icon: "🛵",
    name: "ZILO Express",
    bangla: "এক্সপ্রেস — ১ ঘণ্টায় ডেলিভারি",
    sheetBangla: "১ ঘণ্টার মধ্যে ডেলিভারি",
    href: "/order/express",
  },
  {
    icon: "📦",
    name: "ZILO Source",
    bangla: "সোর্স — শহর থেকে এনে দিই",
    sheetBangla: "শহর থেকে খুঁজে এনে দিই",
    href: "/order/source",
  },
  {
    icon: "🚀",
    name: "ZILO Parcel",
    bangla: "পার্সেল — পাঠিয়ে দিন",
    sheetBangla: "কাউকে পার্সেল পাঠান",
    href: "/order/parcel",
  },
];

const NAV_LINKS = [
  { label: "হোম",         href: "/" },
  { label: "ট্র্যাক করুন", href: "/track" },
  { label: "যোগাযোগ",    href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]         = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen]       = useState(false);
  const dropdownRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sheetOpen]);

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-[var(--color-paper)] border-b-[2px] border-[var(--color-ink)]"
            : "bg-[var(--color-paper)]/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="font-display text-[22px] text-[var(--color-ink)] leading-none shrink-0">
            ZILO
          </Link>

          {/* ── DESKTOP NAV (md+) ── */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: "var(--font-bangla)" }}
                  className={`text-[14px] font-medium transition-colors pb-0.5 ${
                    active
                      ? "text-[var(--color-rust)] border-b-2 border-[var(--color-rust)]"
                      : "text-[var(--color-olive)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── DESKTOP ORDER BUTTON + DROPDOWN ── */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--color-rust)] text-white text-[13px] font-bold hover:bg-[var(--color-brick)] transition-colors"
              style={{ fontFamily: "var(--font-bangla)" }}
            >
              অর্ডার করুন
              <span className={`text-[10px] transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-lg z-50">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-kraft)] transition-colors border-b border-[var(--color-line)] last:border-b-0"
                  >
                    <span className="text-xl shrink-0">{s.icon}</span>
                    <div>
                      <p className="font-mono text-[11px] font-bold text-[var(--color-ink)] tracking-wide">{s.name}</p>
                      <p className="text-[12px] text-[var(--color-olive)] mt-0.5" style={{ fontFamily: "var(--font-bangla)" }}>{s.bangla}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── MOBILE ORDER BUTTON (< md) ── */}
          <button
            onClick={() => setSheetOpen(true)}
            className="md:hidden flex flex-col items-center gap-0.5 text-[var(--color-rust)]"
            aria-label="অর্ডার করুন"
          >
            <span className="text-[22px] leading-none">🛒</span>
            <span className="text-[9px] font-bold tracking-wide" style={{ fontFamily: "var(--font-bangla)" }}>অর্ডার</span>
          </button>
        </div>
      </nav>

      {/* ── MOBILE BOTTOM SHEET ── */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-paper)] border-t-[3px] border-[var(--color-ink)] animate-slide-up">
            {/* Handle bar + close */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-olive)]"
              >
                কোন সার্ভিস চান?
              </p>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-[var(--color-ink)] hover:text-[var(--color-brick)] text-[18px] leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Service cards — use sheetBangla for the fuller subtitle copy */}
            <div className="px-4 pb-8 space-y-2.5">
              {SERVICES.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-4 border-2 border-[var(--color-ink)] bg-white active:bg-[var(--color-kraft)] p-4 transition-colors min-h-[80px]"
                >
                  <span className="text-3xl shrink-0">{s.icon}</span>
                  <div>
                    <p className="font-mono text-[13px] font-bold text-[var(--color-ink)]">{s.name}</p>
                    <p className="text-[14px] text-[var(--color-olive)] mt-0.5" style={{ fontFamily: "var(--font-bangla)" }}>{s.sheetBangla}</p>
                  </div>
                  <span className="ml-auto text-[var(--color-rust)] text-[18px] shrink-0">→</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Slide-up animation */}
      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.22s cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      `}</style>
    </>
  );
}