export default function AboutSection() {
  return (
    <section className="mt-14 pt-8 border-t-[3px] border-[var(--color-ink)]">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
        আমরা কারা
      </p>
      <h2
        className="text-[22px] font-bold text-[var(--color-ink)] mb-6"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        আমরা কারা?
      </h2>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* ZILO Brand Logo Block */}
        <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square bg-[var(--color-ink)] border-2 border-[var(--color-ink)] flex items-center justify-center shrink-0 p-4 text-center">
          <div>
            <span className="text-5xl block mb-3 font-display text-[var(--color-kraft)] tracking-widest">ZILO</span>
            <p className="text-[11px] font-mono text-[var(--color-kraft)] opacity-80 uppercase tracking-widest">
              LOCAL DELIVERY
            </p>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-4">
          <p
            className="text-[15px] leading-relaxed text-[var(--color-ink)] font-medium"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            "ZILO একটি লোকাল ডেলিভারি এবং পার্সেল সার্ভিস যা নোয়াপাড়া, বাগুয়ান এবং পাহাড়তলী এলাকার মানুষের দৈনন্দিন প্রয়োজন মেটাতে কাজ করছে। শহরে গিয়ে কেনাকাটা করার সময় যাদের নেই, তাদের জন্য আমাদের এই উদ্যোগ। প্রতিটি অর্ডারের গুরুত্ব আমরা বুঝি এবং দ্রুত ও নিরাপদে আপনার পণ্য পৌঁছে দিতে আমরা প্রতিশ্রুতিবদ্ধ।"
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white border-[1.5px] border-[var(--color-ink)] p-3">
              <p className="font-mono text-[10px] text-[var(--color-olive)] uppercase tracking-wider mb-1">
                সার্ভিস এলাকা
              </p>
              <p
                className="text-[14px] font-bold text-[var(--color-ink)]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                নোয়াপাড়া · বাগুয়ান · পাহাড়তলী
              </p>
            </div>
            <div className="bg-white border-[1.5px] border-[var(--color-ink)] p-3">
              <p className="font-mono text-[10px] text-[var(--color-olive)] uppercase tracking-wider mb-1">
                যোগাযোগ
              </p>
              <p className="text-[14px] font-bold font-mono text-[var(--color-ink)]">
                +880 1866-996873
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
