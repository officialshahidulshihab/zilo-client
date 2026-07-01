"use client";

import { useState, useRef, useCallback } from "react";

// open: whether the modal is currently shown
// onAgree: called when the customer clicks "I agree" after reading to the end
// onClose: called when they dismiss without (re-)agreeing — only allowed if
//          they've already agreed on a past visit (alreadyAgreedBefore)
// alreadyAgreedBefore: lets a returning, already-agreed customer close this
//          freely if they reopened it just to re-read it
const PolicyModal = ({ open, onAgree, onClose, alreadyAgreedBefore }) => {
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reachedEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
    if (reachedEnd) setScrolledToEnd(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] max-w-lg w-full max-h-[88vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-4 border-b-[3px] border-[var(--color-ink)] flex items-start justify-between gap-3 shrink-0">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
              Please read before ordering
            </p>
            <h2 className="font-display text-[22px] text-[var(--color-ink)] leading-none">
              ZILO Terms &amp; Policies
            </h2>
          </div>
          {alreadyAgreedBefore && (
            <button
              onClick={onClose}
              className="text-[var(--color-olive)] hover:text-[var(--color-brick)] text-xl leading-none shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-[13.5px] text-[var(--color-ink)]"
        >
          <PolicySection title="How ordering works">
            <PolicyItem>You send us what you want — a reference photo or link — plus your delivery address.</PolicyItem>
            <PolicyItem>We go find it locally and send you a photo on WhatsApp for approval before we ever spend your money on it.</PolicyItem>
            <PolicyItem>Once you approve, we buy it and deliver it straight to your door.</PolicyItem>
          </PolicySection>

          <PolicySection title="Pricing & payment">
            <PolicyItem>Prices shown while ordering are our best estimate. If the real price comes in more than 10% over that, we call you before paying — no surprise bills.</PolicyItem>
            <PolicyItem>Payment is 100% advance via bKash or Nagad before we source anything. We don't offer cash-on-delivery.</PolicyItem>
            <PolicyItem>Minimum order value is ৳500 in total item value.</PolicyItem>
          </PolicySection>

          <PolicySection title="Approval, substitutes & cancellations">
            <PolicyItem>We never buy anything before you approve a photo on WhatsApp. No reply within a reasonable time means the order is automatically cancelled.</PolicyItem>
            <PolicyItem>Once we start actively sourcing your order, the booking fee is non-refundable — even if you change your mind — since that covers the time and effort already spent finding it (a ৳50 cancellation fee will be deducted).</PolicyItem>
            <PolicyItem>If your exact item isn't available, we'll call you with the closest alternative we found. Accept it, or cancel for a full deposit refund.</PolicyItem>
          </PolicySection>

          <PolicySection title="Returns & refunds">
            <PolicyItem>Because you approve a photo first, "I don't like it after all" isn't valid grounds for a return once you've approved.</PolicyItem>
            <PolicyItem>A wrong item or damage in transit is different — that one's on us. Full refund or free replacement, your choice.</PolicyItem>
          </PolicySection>

          <PolicySection title="Delivery windows & zone">
            <PolicyItem>We only deliver inside Noapara, Baguan, and Pahartali unions.</PolicyItem>
            <PolicyItem>Order between 12 AM–12 PM → delivered that same evening. Between 12 PM–6 PM we're out sourcing & delivering the day's batch, so new orders pause. Order between 6 PM–12 AM → delivered the next day.</PolicyItem>
            <PolicyItem>Fragile items (glass, ceramics, etc.) need extra padding for safe transit and may carry a small added packing cost — we'll always tell you upfront if so.</PolicyItem>
          </PolicySection>

          <PolicySection title="Your part in this">
            <PolicyItem>Please give us an accurate delivery address, landmark, and phone number, plus a clear reference photo.</PolicyItem>
            <PolicyItem>Stay reachable on WhatsApp while we're sourcing — an unanswered approval request leads to automatic cancellation, as above.</PolicyItem>
          </PolicySection>

          <p className="text-[12px] text-[var(--color-olive)] pt-2 border-t border-dashed border-[var(--color-line)]">
            By placing an order with ZILO, you're agreeing to all of the above. Questions any time — just message us on WhatsApp.
          </p>
        </div>

        {/* Footer / agree action */}
        <div className="px-5 py-4 border-t-[3px] border-[var(--color-ink)] bg-[var(--color-kraft)] shrink-0">
          {!scrolledToEnd && (
            <p className="text-[11.5px] text-[var(--color-rust)] font-semibold mb-2 text-center">
              ↓ Scroll to the end to continue ↓
            </p>
          )}
          <button
            onClick={onAgree}
            disabled={!scrolledToEnd}
            className={`w-full py-3.5 text-[15px] font-bold text-white transition-colors ${
              scrolledToEnd
                ? "bg-[var(--color-rust)] hover:bg-[var(--color-brick)] cursor-pointer"
                : "bg-[#b9ad8f] cursor-not-allowed"
            }`}
          >
            {scrolledToEnd ? "I've read this — I agree" : "Please read to the end first"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PolicySection = ({ title, children }) => (
  <div>
    <h3 className="font-display text-[16px] text-[var(--color-rust)] mb-1.5">{title}</h3>
    <ul className="space-y-1.5 list-none">{children}</ul>
  </div>
);

const PolicyItem = ({ children }) => (
  <li className="flex gap-2">
    <span className="text-[var(--color-rust)] shrink-0">·</span>
    <span>{children}</span>
  </li>
);

export default PolicyModal;