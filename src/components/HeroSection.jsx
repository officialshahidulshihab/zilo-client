const HeroSection = () => {
  return (
    <section className="pt-10 pb-8 border-b-[3px] border-[var(--color-ink)]">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-olive)] mb-4">
        NOAPARA · BAGUAN · PAHARTALI — SAME DAY
      </p>
      <h1
        className="text-[clamp(32px,9vw,56px)] font-bold text-[var(--color-ink)] leading-[1.15] mb-4"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        শহরে যেতে পারছেন না?
      </h1>
      <p
        className="text-[clamp(17px,4.5vw,22px)] text-[var(--color-ink)] font-semibold leading-[1.5] mb-5 max-w-sm"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        আমরা যাচ্ছি। আপনার জন্য কিনে,{" "}
        <span className="text-[var(--color-rust)]">আপনার দরজায় পৌঁছে দিই।</span>
      </p>
      <p
        className="text-[14px] text-[var(--color-olive)] border-l-[3px] border-[var(--color-rust)] pl-3"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        নোয়াপাড়া · বাগুয়ান · পাহাড়তলী — একই দিনে
      </p>
      <div className="flex flex-wrap gap-2 mt-6">
        {["✔ ছবি দেখে তারপর কিনি", "✔ একই দিনে ডেলিভারি", "✔ bKash & Nagad", "✔ স্থানীয় টিম"].map((badge, ind) => (
          <span key={ind} className="font-mono text-[10.5px] tracking-wide bg-[var(--color-kraft)] border border-[var(--color-line)] px-2.5 py-1 text-[var(--color-ink)]">
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;