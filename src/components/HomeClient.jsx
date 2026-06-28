"use client";

import { useState } from "react";
import PolicyModal from "@/components/PolicyModal";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import OrderForm from "@/components/OrderForm";

const HomeClient = ({ status }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    setAgreed(true);
    setModalOpen(false);
  };

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

          {/* Policy agreement trigger — sits where Declaration used to be */}
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
        </div>
      </main>
    </>
  )
}

export default HomeClient