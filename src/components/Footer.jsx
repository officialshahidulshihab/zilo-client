import Link from "next/link";

export default function Footer() {
  const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "01866996873";

  return (
    <footer className="bg-[var(--color-ink)] text-white pt-10 pb-6 mt-16">
      <div className="max-w-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 border-b border-[var(--color-olive)] pb-8">
          
          {/* Left Side */}
          <div className="space-y-2">
            <h3 className="font-display text-2xl tracking-widest text-[var(--color-kraft)]">
              ZILO
            </h3>
            <p className="text-[14.5px] text-[#cfc4a8]" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              নোয়াপাড়া ⇄ পাহাড়তলী · বাইক ডেলিভারি · প্রতিদিন
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col md:items-end space-y-2">
            <a 
              href={`https://wa.me/${WHATSAPP}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[14.5px] text-[#cfc4a8] hover:text-white transition-colors"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              WhatsApp: {WHATSAPP}
            </a>
            <Link 
              href="/track" 
              className="text-[14.5px] text-[#cfc4a8] hover:text-white transition-colors underline"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              অর্ডার ট্র্যাক করুন
            </Link>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="text-center md:text-left">
          <p className="font-mono text-[11px] text-[#9a9485] tracking-widest uppercase" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            © {new Date().getFullYear()} ZILO — সকল অধিকার সংরক্ষিত
          </p>
        </div>
      </div>
    </footer>
  );
}
