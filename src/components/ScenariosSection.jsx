const SCENARIOS = [
  { emoji: "🎓", text: "পরীক্ষার আগের দিন স্টেশনারি শেষ — বের হওয়ার সময় নেই", service: "Express" },
  { emoji: "💊", text: "ওষুধ দরকার এখনই — কিন্তু বাড়ি থেকে বের হওয়া যাচ্ছে না", service: "Express" },
  { emoji: "🏠", text: "মেহমান আসছে, বাজার করতে পারিনি — এখন কি হবে?", service: "Express" },
  { emoji: "🛍️", text: "শহর থেকে পছন্দের জিনিস আনতে হবে — আজই চাই", service: "Source" },
  { emoji: "📦", text: "পাহাড়তলীতে কাউকে জিনিস পাঠাতে হবে", service: "Parcel" },
];

const SERVICE_COLORS = {
  Express: { bg: "bg-[#f0faf3]", border: "border-[#1e8449]", text: "text-[#1e8449]" },
  Source:  { bg: "bg-[var(--color-kraft)]", border: "border-[var(--color-rust)]", text: "text-[var(--color-rust)]" },
  Parcel:  { bg: "bg-[#EEF2FF]", border: "border-[#3730a3]", text: "text-[#3730a3]" },
};

const ScenariosSection = () => {
  return (
    <section className="mt-10">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
        কারা ব্যবহার করেন
      </p>
      <h2
        className="text-[22px] font-bold text-[var(--color-ink)] mb-2"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        কারা ZILO ব্যবহার করেন?
      </h2>
      <p
        className="text-[13.5px] text-[var(--color-olive)] mb-5"
        style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
      >
        এখন দরকার কিন্তু যাওয়ার সময় নেই — তখনই ZILO
      </p>

      <div className="space-y-2.5">
        {SCENARIOS.map((s, ind) => {
          const c = SERVICE_COLORS[s.service];
          return (
            <div
              key={ind}
              className={`flex items-start gap-3 border-[1.5px] ${c.border} ${c.bg} p-3.5`}
            >
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] text-[var(--color-ink)] leading-snug"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {s.text}
                </p>
              </div>
              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border ${c.border} ${c.text} shrink-0 mt-0.5`}>
                {s.service}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ScenariosSection;