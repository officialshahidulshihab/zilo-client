import Link from "next/link";

const ServiceCard = ({ icon, serviceName, headline, body, hours, paymentNote, ctaLabel, ctaHref }) => {
  return (
    <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] flex flex-col hover:bg-[var(--color-kraft)] transition-colors">
      <div className="p-4 flex-1">
        <div className="text-3xl mb-3">{icon}</div>
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">
          {serviceName}
        </p>
        <h3
          className="text-[17px] font-bold text-[var(--color-ink)] leading-snug mb-2"
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          {headline}
        </h3>
        <p
          className="text-[13px] text-[var(--color-olive)] leading-relaxed mb-3"
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          {body}
        </p>
        <div className="border-t border-dashed border-[var(--color-line)] pt-3 space-y-1">
          <p className="font-mono text-[10px] text-[var(--color-olive)]">🕐 {hours}</p>
          <p className="font-mono text-[10px] text-[var(--color-olive)]">💳 {paymentNote}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <Link
          href={ctaHref}
          className="block w-full py-3 bg-[var(--color-rust)] hover:bg-[var(--color-brick)] text-white text-center text-[14px] font-bold transition-colors"
          style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;