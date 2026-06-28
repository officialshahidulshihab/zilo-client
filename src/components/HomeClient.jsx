"use client";

import { useState } from "react";
import PolicyModal from "@/components/PoloiciModal";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import OrderForm from "@/components/OrderForm";

// Shown in place of the order form when orders aren't being accepted
const OrdersClosedCard = ({ phase, etaText }) => {
  const isMidday = phase === "midday-closed";
  return (
    <section className="mt-9">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
        Your order
      </p>
      <h2 className="font-display text-[22px] text-[var(--color-ink)] mb-4">
        Place an order
      </h2>
      <div
        className={`border-2 p-6 text-center ${
          isMidday
            ? "border-[var(--color-ink)] bg-[var(--color-kraft)]"
            : "border-[var(--color-brick)] bg-[#FBF1EC]"
        }`}
      >
        <div className="text-4xl mb-3">{isMidday ? "🏍️" : "📅"}</div>
        <p
          className={`font-display text-[20px] mb-2 ${
            isMidday ? "text-[var(--color-ink)]" : "text-[var(--color-brick)]"
          }`}
        >
          {isMidday ? "We're out delivering right now." : "No service today."}
        </p>
        <p className="text-[13.5px] text-[var(--color-olive)] max-w-xs mx-auto">
          {isMidday
            ? "Come back after 6 PM to place your order for tomorrow."
            : "Orders will reopen on the next service day. Normal hours apply then."}
        </p>
        {isMidday && (
          <div className="mt-4 inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-4 py-2">
            <span className="text-[12px] text-[var(--color-olive)]">Normal hours:</span>
            <span className="font-mono text-[12px] font-semibold text-[var(--color-ink)]">
              12 AM–12 PM &amp; 6 PM–12 AM
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

const HomeClient = ({ status }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    setAgreed(true);
    setModalOpen(false);
  };

  const acceptingOrders = status.isOpen && status.phase !== "midday-closed";

  return (
    <>
      <PolicyModal
        open={modalOpen}
        onAgree={handleAgree}
        onClose={() => setModalOpen(false)}
        alreadyAgreedBefore={agreed}
      />

      <main className="bg-[var(--color-paper)] min-h-screen">
        <div className="max-w-xl mx-auto px-4 pb-16">
          <Header status={status} />
          <HowItWorks />

          {acceptingOrders ? (
            <>
              {/* Policy agreement trigger */}
              <section className="mt-9">
                <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
                  Read before ordering
                </p>
                <h2 className="font-display text-[22px] text-[var(--color-ink)] mb-3">
                  Terms &amp; Policies
                </h2>
                <p className="text-[13.5px] text-[var(--color-olive)] mb-4">
                  Before placing an order, please read our full terms — pricing, refunds, delivery zone, and more.
                </p>
                {agreed ? (
                  <div className="flex items-center gap-3 border-[1.5px] border-green-700 bg-[#f0faf3] px-4 py-3">
                    <span className="text-green-700 text-[18px] shrink-0">✓</span>
                    <div className="flex-1">
                      <p className="text-[13.5px] font-semibold text-green-800">
                        You&apos;ve agreed to the terms &amp; policies.
                      </p>
                    </div>
                    <button
                      onClick={() => setModalOpen(true)}
                      className="text-[12px] text-[var(--color-olive)] underline hover:text-[var(--color-ink)] shrink-0"
                    >
                      Re-read
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full py-3.5 border-2 border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] font-bold hover:bg-[var(--color-kraft)] transition-colors"
                  >
                    Read &amp; agree to terms before ordering →
                  </button>
                )}
              </section>

              <OrderForm
                isOpen={status.isOpen}
                etaText={status.etaText}
                agreedFromOutside={agreed}
              />
            </>
          ) : (
            <OrdersClosedCard phase={status.phase} etaText={status.etaText} />
          )}
        </div>
      </main>
    </>
  )
}

export default HomeClient