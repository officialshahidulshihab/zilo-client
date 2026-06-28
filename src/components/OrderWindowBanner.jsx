"use client";

import { useState, useEffect, useRef } from "react";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Pure display formatting — the actual decision of whether orders are open
// always comes from the backend (/api/status, re-checked again on submit).
function formatRemaining(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}

const PHASE_CONFIG = {
  morning: {
    badge: "🟢 OPEN",
    badgeClass: "bg-[#1e8449]",
    headline: "Order now — get it delivered today evening.",
    countdownLabel: "Order window closes in",
  },
  "midday-closed": {
    badge: "🔴 PAUSED",
    badgeClass: "bg-[var(--color-brick)]",
    headline: "We're sourcing & delivering today's orders right now.",
    countdownLabel: "Reopens at 6 PM in",
  },
  evening: {
    badge: "🌙 OPEN",
    badgeClass: "bg-[#1a5276]",
    headline: "Order now — get it delivered tomorrow.",
    countdownLabel: "New window opens at 12 PM in",
  },
  "manual-closed": {
    badge: "⚠ CLOSED",
    badgeClass: "bg-[var(--color-brick)]",
    headline: null,
    countdownLabel: null,
  },
};

// initialStatus: the JSON shape returned by GET /api/status
//   { isOpen, message, phase, etaText, nextTransitionAt }
// onStatusChange: optional callback fired whenever this component refetches
//   a fresh status (e.g. so the parent page can re-enable/disable OrderForm)
const OrderWindowBanner = ({ initialStatus, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [remaining, setRemaining] = useState(0);
  const refetchedRef = useRef(false);

  const refreshStatus = async () => {
    try {
      const res = await fetch(`${SERVER}/api/status`, { cache: "no-store" });
      const data = await res.json();
      setStatus(data);
      refetchedRef.current = false;
      if (onStatusChange) onStatusChange(data);
    } catch {
      // Network hiccup — keep showing the last known status. The order
      // submit handler still gets re-validated server-side regardless.
    }
  };

  // Tick every second purely off the fixed nextTransitionAt timestamp (no
  // drift even if the tab was backgrounded). When it hits zero, refetch once
  // to pick up the new phase from the backend — the single source of truth
  // for exactly when the window changes.
  useEffect(() => {
    if (!status?.nextTransitionAt) {
      setRemaining(0);
      return;
    }
    const target = new Date(status.nextTransitionAt).getTime();

    const tick = () => {
      const diff = target - Date.now();
      setRemaining(diff);
      if (diff <= 0 && !refetchedRef.current) {
        refetchedRef.current = true;
        refreshStatus();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status?.nextTransitionAt]);

  if (!status) return null;
  const config = PHASE_CONFIG[status.phase] || PHASE_CONFIG["manual-closed"];

  return (
    <div className="mt-4 border-2 border-[var(--color-ink)] bg-[var(--color-kraft)] p-3.5 text-sm">
      <span className={`inline-block text-[10px] font-bold text-white px-2 py-0.5 mb-2 ${config.badgeClass}`}>
        {config.badge}
      </span>

      {status.phase === "manual-closed" ? (
        <span className="text-[13px] text-[var(--color-brick)] font-semibold block">
          {status.message || "We're not running today. Check back tomorrow."}
        </span>
      ) : (
        <>
          <strong className="block mb-1 text-[var(--color-ink)] text-[14px]">
            {config.headline}
          </strong>
          {status.nextTransitionAt && (
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-[12px] text-[var(--color-olive)]">{config.countdownLabel}</span>
              <span className="font-mono text-[15px] font-bold text-[var(--color-rust)] tabular-nums">
                {formatRemaining(remaining)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderWindowBanner;