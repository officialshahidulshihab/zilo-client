"use client";

import { useState, useEffect, useRef } from "react";

const SERVER = process.env.NODE_ENV === "production" ? "https://zilo-server.vercel.app" : "http://localhost:5000";

function formatRemaining(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}

// ── Schedule strip — always visible, highlights the current slot ──────────────
const ScheduleStrip = ({ phase }) => {
  const slots = [
    { key: "morning",       icon: "🟢", time: "12 AM – 12 PM", label: "Order → delivered today" },
    { key: "midday-closed", icon: "🏍️", time: "12 PM – 6 PM",  label: "Out sourcing & delivering" },
    { key: "evening",       icon: "🌙", time: "6 PM – 12 AM",  label: "Order → delivered tomorrow" },
  ];

  return (
    <div className="grid grid-cols-3 border-t border-dashed border-[var(--color-line)] mt-3 pt-3 gap-px">
      {slots.map((slot) => {
        const active = phase === slot.key;
        return (
          <div
            key={slot.key}
            className={`px-1.5 py-2 text-center transition-colors ${
              active ? "bg-[var(--color-ink)] text-white rounded-sm" : "text-[var(--color-olive)]"
            }`}
          >
            <div className="text-[14px] mb-0.5">{slot.icon}</div>
            <div className={`font-mono text-[9.5px] font-bold tracking-wide uppercase ${active ? "text-white" : "text-[var(--color-ink)]"}`}>
              {slot.time}
            </div>
            <div className={`text-[10.5px] mt-0.5 leading-tight ${active ? "text-white/80" : "text-[var(--color-olive)]"}`}>
              {slot.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
      // keep last known state — backend re-validates on submit anyway
    }
  };

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

  const { phase, message, nextTransitionAt } = status;
  const hasCustomMessage = !!message && message.trim().length > 0;

  // ── OPEN: morning or evening ─────────────────────────────────────────────
  if (phase === "morning" || phase === "evening") {
    const isMorning = phase === "morning";
    return (
      <div className="mt-4 border-2 border-[#1e8449] bg-[#f0faf3] p-3.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#1e8449] text-white text-[10px] font-bold px-2 py-0.5 mb-1.5 tracking-wide">
              🟢 ACCEPTING ORDERS
            </span>
            <p className="text-[14px] font-semibold text-[#145a32]">
              {isMorning
                ? "Order now — delivered to your door this evening."
                : "Order now — delivered to your door tomorrow."}
            </p>
          </div>
          {nextTransitionAt && (
            <div className="text-right shrink-0">
              <p className="text-[10px] font-mono uppercase tracking-wide text-[#1e8449]">Window closes in</p>
              <p className="font-mono text-[20px] font-bold text-[#145a32] tabular-nums leading-none">
                {formatRemaining(remaining)}
              </p>
            </div>
          )}
        </div>
        <ScheduleStrip phase={phase} />
      </div>
    )
  }

  // ── MIDDAY: out sourcing & delivering ───────────────────────────────────
  if (phase === "midday-closed") {
    return (
      <div className="mt-4 border-2 border-[var(--color-ink)] bg-[var(--color-kraft)] p-3.5">
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-ink)] text-white text-[10px] font-bold px-2 py-0.5 mb-1.5 tracking-wide">
          🏍️ OUT DELIVERING
        </span>
        <p className="text-[14px] font-semibold text-[var(--color-ink)]">
          We&apos;re on the road right now — sourcing &amp; delivering today&apos;s orders.
        </p>
        <p className="text-[12.5px] text-[var(--color-olive)] mt-1">
          New orders open again at <strong>6 PM</strong>. Come back then to order for tomorrow.
        </p>
        {nextTransitionAt && (
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-[11px] text-[var(--color-olive)] font-mono uppercase tracking-wide">Back in</span>
            <span className="font-mono text-[18px] font-bold text-[var(--color-rust)] tabular-nums">
              {formatRemaining(remaining)}
            </span>
          </div>
        )}
        <ScheduleStrip phase={phase} />
      </div>
    )
  }

  // ── MANUAL OFF-DAY ──────────────────────────────────────────────────────
  if (phase === "manual-closed") {
    return (
      <div className="mt-4 border-2 border-[var(--color-brick)] bg-[#FBF1EC] p-3.5">
        <span className="inline-flex items-center gap-1.5 bg-[var(--color-brick)] text-white text-[10px] font-bold px-2 py-0.5 mb-1.5 tracking-wide">
          📅 NO SERVICE TODAY
        </span>
        <p className="text-[14px] font-semibold text-[var(--color-brick)]">
          {hasCustomMessage ? message : "We're not running today — check back tomorrow."}
        </p>
        <p className="text-[12px] text-[var(--color-olive)] mt-1.5">
          Once we&apos;re back, the normal daily schedule applies:
        </p>
        <ScheduleStrip phase={phase} />
      </div>
    )
  }

  return null
};

export default OrderWindowBanner;