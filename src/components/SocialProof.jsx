const STATS = [
  { value: "৩২০+", label: "অর্ডার ডেলিভারি হয়েছে" },
  { value: "4.9★", label: "কাস্টমার রেটিং" },
  { value: "< ১ ঘণ্টা", label: "গড় ডেলিভারি সময়" },
];

const SocialProof = () => {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-3 border-2 border-[var(--color-ink)] overflow-hidden">
        {STATS.map((stat, ind) => (
          <div
            key={ind}
            className={`px-3 py-5 text-center ${ind < STATS.length - 1 ? "border-r-2 border-[var(--color-ink)]" : ""}`}
          >
            <p className="font-display text-[clamp(20px,5vw,28px)] text-[var(--color-rust)] leading-none mb-1">
              {stat.value}
            </p>
            <p
              className="text-[11px] text-[var(--color-olive)] leading-snug"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;