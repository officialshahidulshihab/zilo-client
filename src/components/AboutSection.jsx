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
        {/* Placeholder Photo Slot */}
        <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-square bg-[var(--color-kraft)] border-2 border-[var(--color-ink)] flex items-center justify-center shrink-0 p-4 text-center">
          <div>
            <span className="text-4xl block mb-2">📸</span>
            <p className="text-[12px] font-mono text-[var(--color-olive)] uppercase tracking-wide">
              [ Owner Photo Placeholder ]
            </p>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-4">
          <p
            className="text-[15px] leading-relaxed text-[var(--color-ink)] font-medium"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            "আমরা নোয়াপাড়ার ছেলে। শহরে যাওয়া সবার পক্ষে সবসময় সম্ভব হয় না — সেই কথা মাথায় রেখেই ZILO শুরু করেছি। আমাদের তিনটি সার্ভিস, তিন ভাই মিলে চালাই — প্রতিটি ডেলিভারি আমাদের কাছে একটি মানুষের সমস্যার সমাধান।"
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
