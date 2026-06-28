import OrderWindowBanner from "./OrderWindowBanner";

const Header = ({ status }) => {
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

      <OrderWindowBanner initialStatus={status} />
    </header>
  );
};

export default Header;