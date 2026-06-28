const STEPS = [
  { title: "Order before 12:00 PM", desc: "Same-day delivery is confirmed for every order placed on time." },
  { title: "We source it in the city", desc: "You approve a photo on WhatsApp before we pay for it." },
  { title: "Delivered to your door, that evening", desc: "By bike, on the Noapara ⇄ Pahartali route." },
];

const HowItWorks = () => (
  <section className="mt-9">
    <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
      How it works
    </p>
    <h2 className="font-display text-[22px] text-[var(--color-ink)] mb-4">Order → Source → Deliver</h2>
    <ol className="space-y-0">
      {STEPS.map((step, i) => (
        <li key={i} className="flex gap-3.5 py-3.5 border-t border-dashed border-[var(--color-line)] first:border-t-0">
          <span className="w-7 h-7 shrink-0 border-2 border-[var(--color-ink)] rounded-full flex items-center justify-center font-mono text-[13px] font-semibold">
            {i + 1}
          </span>
          <div>
            <strong className="block text-[15px]">{step.title}</strong>
            <span className="text-[13.5px] text-[var(--color-olive)]">{step.desc}</span>
          </div>
        </li>
      ))}
    </ol>
    <p className="text-[12px] text-[var(--color-olive)] mt-3">
      Service runs on university travel days. Off-days are posted in advance.
    </p>
  </section>
);

export default HowItWorks;