const Header = ({ isOpen, statusMessage }) => {
  return (
    <header className="pt-7 pb-5 border-b-[3px] border-[var(--color-ink)]">
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-olive)] mb-2">
        NOAPARA ⇄ PAHARTALI · BY BIKE · DAILY
      </p>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-[3px] border-[var(--color-rust)] bg-white flex items-center justify-center shrink-0">
          <span className="font-display text-2xl text-[var(--color-rust)]">Z</span>
        </div>
        <div>
          <h1 className="font-display text-[clamp(28px,7vw,36px)] text-[var(--color-ink)] leading-none">ZILO</h1>
          <p className="text-sm text-[var(--color-olive)] mt-1">
            Order before 12 PM — delivered to your door that evening.
          </p>
        </div>
      </div>

      {isOpen ? (
        <div className="mt-4 border-2 border-[var(--color-ink)] bg-[var(--color-kraft)] p-3.5 text-sm">
          <strong className="block mb-1 text-[var(--color-ink)]">Same-day delivery, every order — our main promise.</strong>
          <span className="text-[var(--color-olive)] text-[13px]">
            Order before 12:00 PM and it's confirmed for delivery that same evening. Ordering after 12:00? Mark it "Urgent" — we'll confirm if there's still time.
          </span>
        </div>
      ) : (
        <div className="mt-4 border-2 border-[var(--color-brick)] bg-[#FBF1EC] p-3.5 text-sm">
          <strong className="block mb-1 text-[var(--color-brick)]">⚠ Service is off today</strong>
          <span className="text-[13px]">{statusMessage || "We're not running today. Check back tomorrow."}</span>
        </div>
      )}
    </header>
  );
};

export default Header;