"use client";

import { useState } from "react";

const CLAUSES = [
  { title: "Price is an estimate, not final", body: "The real price can change. If it shifts more than 10%, we call you before paying." },
  { title: "Booking fee is non-refundable", body: "Once we start sourcing your item, the booking fee is kept — even if you cancel." },
  { title: "You must approve a photo before we buy", body: "We send a photo on WhatsApp. No reply in time means the order is cancelled." },
  { title: "No returns after photo approval", body: "\"I don't like it\" isn't a valid return once you've approved the photo. Wrong item or damage in transit is refunded in full." },
  { title: "Substitutes need your OK", body: "If your exact item isn't available, we call you. Accept an alternative, or get your deposit back." },
  { title: "Same-day cutoff is strict — 12:00 PM", body: "Order before 12 PM and same-day delivery is guaranteed. After 12 PM, mark \"Urgent\"." },
  { title: "Delivery zone is fixed", body: "We only deliver inside Noapara, Baguan, and Pahartali unions." },
  { title: "Weight & fragile limits apply", body: "Fragile items (glass, ceramics) need padding and may cost extra." },
  { title: "Payment is always full advance", body: "100% advance via bKash/Nagad before we source your item. No cash-on-delivery." },
  { title: "Minimum order is ৳500", body: "Orders under ৳500 in total item value aren't accepted." },
];

export let declarationAgreed = false;

const Declaration = ({ onAgree }) => {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = (e) => {
    setAgreed(e.target.checked);
    if (onAgree) onAgree(e.target.checked);
  };

  return (
    <section className="mt-9">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
        Read before ordering
      </p>
      <h2 className="font-display text-[22px] text-[var(--color-ink)] mb-3">Declaration</h2>
      <p className="text-[13.5px] text-[var(--color-olive)] mb-4">
        These are the 10 most common points of conflict in this kind of service. Read them, then tick the box below.
      </p>

      <div className="space-y-2.5">
        {CLAUSES.map((clause, i) => (
          <div key={i} className="border-[1.5px] border-[var(--color-brick)] bg-[#FBF1EC] p-3.5">
            <span className="inline-block font-mono text-[10px] bg-[var(--color-brick)] text-white px-2 py-0.5 mb-1.5 tracking-wide">
              CLAUSE {i + 1}
            </span>
            <strong className="block text-[14.5px] text-[var(--color-brick)] mb-1">{clause.title}</strong>
            <p className="text-[13px] text-[#3a2420] m-0">{clause.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-[var(--color-ink)] flex gap-3 items-start">
        <input
          type="checkbox"
          id="agreeBox"
          checked={agreed}
          onChange={handleAgree}
          className="w-5 h-5 mt-0.5 shrink-0 accent-[var(--color-brick)]"
        />
        <label htmlFor="agreeBox" className="text-[14px] font-semibold cursor-pointer">
          I have read all 10 points above and agree to them before placing my order.
        </label>
      </div>
    </section>
  );
};

export default Declaration;