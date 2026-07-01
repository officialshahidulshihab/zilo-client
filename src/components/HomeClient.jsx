"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OrderWindowBanner from "@/components/OrderWindowBanner";
import ServiceCard from "@/components/ServiceCard";
import ScenariosSection from "@/components/ScenariosSection";
import HowItWorks from "@/components/HowItWorks";
import WhyZiloSection from "@/components/WhyZiloSection";
import SocialProof from "@/components/SocialProof";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const SERVICES = [
  {
    icon: "🛵",
    serviceName: "ZILO Express",
    headline: "দ্রুত দরকার? ১ ঘণ্টায় পৌঁছে দিই",
    body: "কাছের দোকান থেকে যা লাগে এখনই নিয়ে আসি। বাজার থেকে ওষুধ — সব কিছু।",
    hours: "সময়: সকাল 10 — রাত 7",
    paymentNote: "৳250 পর্যন্ত — ডেলিভারিতে টাকা দিন (COD) · ৳250-এর বেশি — আগেই পাঠান",
    ctaLabel: "এক্সপ্রেস অর্ডার করুন →",
    ctaHref: "/order/express",
  },
  {
    icon: "📦",
    serviceName: "ZILO Source",
    headline: "অনলাইনে দেখলেন? আমরা এনে দিই",
    body: "যেকোনো সাইট বা দোকানের লিঙ্ক দিন — আমরা খুঁজে বের করে ছবি দেখিয়ে কিনে আনি।",
    hours: "অর্ডার: রাত 12 — দুপুর 12 → সেইদিনই ডেলিভারি · সন্ধ্যা 6 — রাত 12 → পরদিন",
    paymentNote: "সম্পূর্ণ অগ্রিম · সর্বনিম্ন ৳500",
    ctaLabel: "সোর্স অর্ডার করুন →",
    ctaHref: "/order/source",
  },
  {
    icon: "🚀",
    serviceName: "ZILO Parcel",
    headline: "কাউকে কিছু পাঠাতে চান?",
    body: "নোয়াপাড়া থেকে পাহাড়তলী — আমরা তুলে নিয়ে পৌঁছে দিই। কোনো ঝামেলা নেই।",
    hours: "সময়: সকাল 10 — বিকাল 5",
    paymentNote: "পাঠানোর আগেই পেমেন্ট · প্রেরকই দেবেন",
    ctaLabel: "পার্সেল পাঠান →",
    ctaHref: "/order/parcel",
  },
];

// Platforms section — inline, no separate component needed
const PlatformsSection = () => (
  <section className="mt-10">
    <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
      যেকোনো জায়গা থেকে
    </p>
    <h2
      className="text-[22px] font-bold text-[var(--color-ink)] mb-2"
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
    >
      যেকোনো জায়গা থেকে অর্ডার করুন
    </h2>
    <p
      className="text-[13.5px] text-[var(--color-olive)] mb-5"
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
    >
      লিঙ্ক দিন অথবা বর্ণনা করুন — আমরা খুঁজে বের করবো
    </p>
    <div className="flex flex-wrap gap-2">
      {["📘 Facebook", "🛒 Daraz", "📸 Instagram", "🎵 TikTok Shop", "🌐 যেকোনো ওয়েবসাইট"].map((p, i) => (
        <span
          key={i}
          className="font-mono text-[11px] tracking-wide bg-white border-2 border-[var(--color-ink)] px-3 py-2 text-[var(--color-ink)] font-semibold"
        >
          {p}
        </span>
      ))}
    </div>
  </section>
);

// Final CTA strip — inline
const FinalCTA = () => (
  <section className="mt-12 border-t-[3px] border-[var(--color-ink)] pt-8">
    <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
      শুরু করুন
    </p>
    <h2
      className="text-[22px] font-bold text-[var(--color-ink)] mb-5"
      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
    >
      প্রস্তুত? এখনই শুরু করুন
    </h2>
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/order/express"
        className="flex-1 py-4 bg-[var(--color-rust)] hover:bg-[var(--color-brick)] text-white text-center text-[15px] font-bold transition-colors"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        🛵 এক্সপ্রেস অর্ডার
      </Link>
      <Link
        href="/order/source"
        className="flex-1 py-4 border-2 border-[var(--color-ink)] bg-white hover:bg-[var(--color-kraft)] text-[var(--color-ink)] text-center text-[15px] font-bold transition-colors"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        📦 সোর্স অর্ডার
      </Link>
      <Link
        href="/order/parcel"
        className="flex-1 py-4 border-2 border-[var(--color-ink)] bg-white hover:bg-[var(--color-kraft)] text-[var(--color-ink)] text-center text-[15px] font-bold transition-colors"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        🚀 পার্সেল পাঠান
      </Link>
    </div>
  </section>
);

const HomeClient = ({ status }) => {
  const [liveStatus, setLiveStatus] = useState(status);

  return (
    <>
      <FloatingWhatsApp />

      <main className="bg-[var(--color-paper)] min-h-screen">
        {/* Navbar is rendered in layout, but if not, include here */}

        <div className="max-w-xl mx-auto px-4 pb-16">

          {/* 1 — Hero */}
          <HeroSection />

          {/* 2 — Live Order Window Banner */}
          <OrderWindowBanner initialStatus={liveStatus} onStatusChange={setLiveStatus} />

          {/* 3 — Service Cards */}
          <section className="mt-10">
            <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
              আমাদের সার্ভিস
            </p>
            <h2
              className="text-[22px] font-bold text-[var(--color-ink)] mb-5"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              কোন সার্ভিস দরকার?
            </h2>
            {/* Horizontal scroll on mobile, 3-col grid on larger screens */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
              {SERVICES.map((s, i) => (
                <div key={i} className="shrink-0 w-[72vw] sm:w-auto">
                  <ServiceCard {...s} />
                </div>
              ))}
            </div>
          </section>

          {/* 4 — Who Uses ZILO */}
          <ScenariosSection />

          {/* 5 — How It Works (tabbed) */}
          <HowItWorks />

          {/* 6 — Why ZILO */}
          <WhyZiloSection />

          {/* 7 — Social Proof */}
          <SocialProof />

          {/* 8 — About Us */}
          <AboutSection />

          {/* 9 — Supported Platforms */}
          <PlatformsSection />

          {/* 10 — FAQ */}
          <FAQSection />

          {/* 11 — Final CTA Strip */}
          <FinalCTA />

        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
};

export default HomeClient;