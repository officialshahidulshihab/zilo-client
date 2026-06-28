"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const STATUS_STEPS = ["Order Received", "Payment Verified", "Sourcing", "Out for Delivery", "Delivered"];

const STATUS_COLORS = {
  "Order Received":   "#4A4A42",
  "Payment Verified": "#1a5276",
  "Sourcing":         "#7d6608",
  "Out for Delivery": "#1e8449",
  "Delivered":        "#145a32",
  "Cancelled":        "#7A2E22",
};

// ── Inner component: uses useSearchParams() safely inside Suspense ──
function TrackPageContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [phone, setPhone]     = useState(searchParams.get("phone")   || "");
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-check when both params are present in the URL
  useEffect(() => {
    if (searchParams.get("orderId") && searchParams.get("phone")) {
      handleCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = async () => {
    if (!orderId.trim() || !phone.trim()) {
      setError("Enter both Order ID and phone number.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `${SERVER}/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`
      );
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError("No matching order found. Double-check your Order ID and phone number.");
    } catch {
      setError("Couldn't reach the order system. Message us on WhatsApp instead.");
    }
    setLoading(false);
  };

  const currentIdx = result ? STATUS_STEPS.indexOf(result.status) : -1;

  return (
    <div className="max-w-[480px] mx-auto px-4 pb-16">
      <header className="pt-7 pb-5 border-b-[3px] border-[var(--color-ink)]">
        <h1 className="font-display text-[clamp(22px,6vw,30px)] text-[var(--color-ink)]">ZILO</h1>
        <p className="text-[14px] text-[var(--color-olive)] mt-1">Track your order status</p>
      </header>

      <div className="mt-6 space-y-4">
        <div>
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ZIL-0007"
            className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            WhatsApp number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] focus:outline-none"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full py-3.5 bg-[var(--color-rust)] text-white text-[15px] font-bold hover:bg-[var(--color-brick)] transition-colors disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check status"}
        </button>
      </div>

      {error && (
        <p className="text-[var(--color-brick)] text-[13.5px] mt-4">{error}</p>
      )}

      {result && (
        <div className="mt-5 border-[1.5px] border-[var(--color-ink)] bg-[var(--color-kraft)] p-4">
          <h3 className="font-display text-[18px] text-[var(--color-ink)] mb-2">{result.orderId}</h3>
          <div className="text-[13.5px] space-y-1 mb-3">
            <div>Placed: {result.date}</div>
            <div>Item: <strong>{result.itemName}</strong> ({result.brandName})</div>
          </div>
          <div className="mb-3">
            <span
              className="inline-block px-3 py-1 text-[13px] font-bold text-white"
              style={{ backgroundColor: STATUS_COLORS[result.status] || "#4A4A42" }}
            >
              {result.status}
            </span>
          </div>
          {result.status !== "Cancelled" && (
            <div className="flex border-[1.5px] border-[var(--color-ink)] overflow-hidden">
              {STATUS_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`flex-1 text-center py-2 px-1 text-[10px] font-mono leading-tight border-r border-[var(--color-ink)] last:border-r-0 transition-colors ${
                    i < currentIdx
                      ? "bg-[var(--color-ink)] text-white"
                      : i === currentIdx
                      ? "bg-[var(--color-rust)] text-white"
                      : "bg-white text-[var(--color-olive)]"
                  }`}
                >
                  {step.replace(" ", "\n")}
                </div>
              ))}
            </div>
          )}
          {result.statusNote && (
            <p className="text-[12.5px] text-[var(--color-olive)] mt-2">{result.statusNote}</p>
          )}
        </div>
      )}

      <a
        href="/"
        className="inline-block mt-6 text-[13.5px] text-[var(--color-rust)] font-semibold hover:underline"
      >
        ← Place a new order
      </a>

      <footer className="mt-9 border-t border-dashed border-[var(--color-line)] pt-3.5 text-[11.5px] text-[var(--color-olive)] text-center">
        ZILO — same-day delivery, Noapara ⇄ Pahartali, by bike.
      </footer>
    </div>
  );
}

// ── Fallback shown while the inner component suspends ──
function TrackFallback() {
  return (
    <div className="max-w-[480px] mx-auto px-4 pb-16">
      <header className="pt-7 pb-5 border-b-[3px] border-[var(--color-ink)]">
        <h1 className="font-display text-[clamp(22px,6vw,30px)] text-[var(--color-ink)]">ZILO</h1>
        <p className="text-[14px] text-[var(--color-olive)] mt-1">Track your order status</p>
      </header>
      <p className="font-mono text-[13px] text-[var(--color-olive)] animate-pulse mt-8">
        Loading…
      </p>
    </div>
  );
}

// ── Page export: Suspense wraps the part that calls useSearchParams() ──
export default function TrackPage() {
  return (
    <main className="bg-[var(--color-paper)] min-h-screen">
      <Suspense fallback={<TrackFallback />}>
        <TrackPageContent />
      </Suspense>
    </main>
  );
}