const ROWS = [
  { problem: "বাড়ি থেকে বের হওয়া যাচ্ছে না", solution: "আমরা যাই" },
  { problem: "কোন দোকানে পাওয়া যাবে জানি না", solution: "আমরা খুঁজে বের করি" },
  { problem: "কেনার আগে দেখতে চাই", solution: "ছবি দেখিয়ে তারপর কিনি" },
  { problem: "Daraz-এ 3–7 দিন অপেক্ষা", solution: "আমরা আজই দিই" },
  { problem: "পাঠানোর কেউ নেই", solution: "আমরাই সেই কেউ" },
];

const WhyZiloSection = () => {
  return (
    <section className="mt-10">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
        কেন ZILO
      </p>
      <h2
        className="text-[22px] font-bold text-[var(--color-ink)] mb-5"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        নিজে যাবেন না কেন ZILO?
      </h2>

      <div className="border-2 border-[var(--color-ink)] overflow-hidden">
        <div className="grid grid-cols-2 bg-[var(--color-ink)]">
          <div className="px-4 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-kraft)]">সমস্যা</p>
          </div>
          <div className="px-4 py-2.5 border-l border-white/20">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-kraft)]">ZILO-র সমাধান</p>
          </div>
        </div>
        {ROWS.map((row, ind) => (
          <div
            key={ind}
            className={`grid grid-cols-2 border-t border-[var(--color-line)] ${ind % 2 === 0 ? "bg-white" : "bg-[var(--color-kraft)]"}`}
          >
            <div className="px-4 py-3">
              <p
                className="text-[13.5px] text-[var(--color-olive)]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {row.problem}
              </p>
            </div>
            <div className="px-4 py-3 border-l border-[var(--color-line)]">
              <p
                className="text-[13.5px] font-semibold text-[var(--color-rust)]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {row.solution}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyZiloSection;