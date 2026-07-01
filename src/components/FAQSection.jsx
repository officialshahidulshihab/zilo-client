"use client";

import { useState } from "react";

const FAQS = [
  { q: "কোন এলাকায় ডেলিভারি করা হয়?", a: "নোয়াপাড়া, বাগুয়ান এবং পাহাড়তলী ইউনিয়নে। এলাকার বাইরে হলে আমাদের সাথে যোগাযোগ করুন।" },
  { q: "কত দ্রুত ডেলিভারি পাবো?", a: "ZILO Express: 1 ঘণ্টার মধ্যে। ZILO Source: দুপুর 12-এর আগে অর্ডার দিলে সেইদিন সন্ধ্যায়।" },
  { q: "টাকা কখন দিতে হবে?", a: "Express-এ ৳250-এর কম হলে ডেলিভারির সময়। বাকি সব ক্ষেত্রে আগেই — bKash বা Nagad-এ।" },
  { q: "জিনিসটা না পেলে কী হবে?", a: "আপনাকে সঙ্গে সঙ্গে জানাবো এবং পুরো টাকা ফেরত দেবো।" },
  { q: "কেনার আগে কি দেখাবেন?", a: "অবশ্যই। ZILO Source-এ আমরা WhatsApp-এ ছবি পাঠাই — আপনি OK না দিলে কিনি না।" },
  { q: "ফেসবুক থেকে কি অর্ডার করা যায়?", a: "হ্যাঁ। Facebook, Daraz, Instagram, TikTok Shop — যেকোনো লিঙ্ক দিলেই হবে।" },
  { q: "যদি মন পরিবর্তন করি?", a: "ছবি দেখানোর আগে বাতিল করলে পুরো টাকা ফেরত। ছবি দেখে OK দেওয়ার পর বাতিল করা যাবে না।" },
  { q: "পার্সেলে কী পাঠানো যাবে?", a: "কাগজপত্র, কাপড়, ছোট ইলেকট্রনিক্স, খাবার (প্যাকেজড)। বেআইনি জিনিস গ্রহণযোগ্য নয়।" },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-10">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
        FAQ
      </p>
      <h2
        className="text-[22px] font-bold text-[var(--color-ink)] mb-5"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        সাধারণ প্রশ্ন
      </h2>

      <div className="border-t-2 border-[var(--color-ink)]">
        {FAQS.map((faq, ind) => (
          <div key={ind} className="border-b border-[var(--color-line)]">
            <button
              onClick={() => setOpenIndex(openIndex === ind ? null : ind)}
              className="w-full flex items-center justify-between gap-3 py-4 text-left"
            >
              <span
                className="text-[14.5px] font-semibold text-[var(--color-ink)] leading-snug"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {faq.q}
              </span>
              <span className="text-[var(--color-rust)] font-mono text-[18px] shrink-0 leading-none">
                {openIndex === ind ? "−" : "+"}
              </span>
            </button>
            {openIndex === ind && (
              <div className="pb-4 pr-8">
                <p
                  className="text-[13.5px] text-[var(--color-olive)] leading-relaxed"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;