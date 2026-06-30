"use client";

import { useState } from "react";
import { toast } from "react-toastify";

const SERVER = process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "01866996873";
const BKASH_NAGAD = "01866996873";

const UNIONS = ["Noapara", "Baguan", "Pahartali"];

const OrderForm = ({ isOpen, etaText, agreedFromOutside = false }) => {
  const agreed = agreedFromOutside;
  const [isRepeat, setIsRepeat] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [refLinkStatus, setRefLinkStatus] = useState("");
  const [form, setForm] = useState({
    custName: "", phone: "", union: "", wardArea: "", villageBari: "", landmark: "",
    itemName: "", brandName: "", refPhoto: "",
    shopName: "", lastPrice: "", budget: "",
    paymentMethod: "", amountPaid: "", transactionId: "",
    notes: "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleScreenshot = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Screenshot must be under 5MB."); return; }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const checkRefLink = async () => {
    if (!form.refPhoto.startsWith("http")) { setRefLinkStatus("❌ Doesn't look like a URL"); return; }
    setRefLinkStatus("Checking…");
    try {
      const res = await fetch(`${SERVER}/api/check-url?url=${encodeURIComponent(form.refPhoto)}`);
      const data = await res.json();
      setRefLinkStatus(data.ok ? "✓ Link is reachable" : "⚠ Link might not open — include anyway");
    } catch { setRefLinkStatus("⚠ Could not verify — include anyway"); }
  };

  const validate = () => {
    const required = ["custName", "phone", "union", "wardArea", "villageBari", "itemName", "brandName", "refPhoto", "paymentMethod", "amountPaid", "transactionId"];
    for (const key of required) {
      if (!form[key].trim()) { toast.error(`Please fill in: ${key}`); return false; }
    }
    if (!screenshotFile) { toast.error("Please attach a payment screenshot."); return false; }
    if (!agreed) { toast.error("Please agree to the terms & policies first."); return false; }
    if (Number(form.amountPaid) < 500) { toast.error("Minimum order is ৳500."); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append("isRepeat", isRepeat);
    formData.append("isUrgent", isUrgent);
    if (screenshotFile) formData.append("screenshot", screenshotFile);

    try {
      const res = await fetch(`${SERVER}/api/orders`, { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.orderId);
        setSubmitted(true);

        // Build WhatsApp message
        const lines = [
          "*New order — ZILO*",
          `Order ID: ${data.orderId}`,
          `Customer: ${form.custName} (${form.phone})`,
          `Type: ${isRepeat ? "Repeat item" : "New item"}`,
          isUrgent ? "URGENT — after 12:00 PM" : "Standard — same-day confirmed",
          `Item: ${form.itemName} (${form.brandName})`,
          `Ref: ${form.refPhoto}`,
          `Budget: ৳${form.budget}`,
          `Delivery: ${form.union} → ${form.wardArea}, ${form.villageBari}`,
          form.landmark ? `Landmark: ${form.landmark}` : "",
          `Payment: ${form.paymentMethod} — ৳${form.amountPaid} — TxID: ${form.transactionId}`,
          form.notes ? `Notes: ${form.notes}` : "",
          "",
          "Customer has agreed to ZILO terms & policies.",
        ].filter(Boolean);

        const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
        window.open(waUrl, "_blank");
      } else {
        toast.error(data.message || "Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="mt-6 border-2 border-[var(--color-ink)] bg-[var(--color-kraft)] p-6 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h2 className="font-display text-2xl text-[var(--color-ink)] mb-2">Order received!</h2>
        <p className="text-[14px] text-[var(--color-olive)] mb-4">
          Your WhatsApp message has been sent. We'll confirm and deliver <strong>{etaText || "soon"}</strong>.
        </p>
        <div className="font-mono text-[13px] bg-white border border-[var(--color-ink)] p-3.5 mb-5 text-left leading-loose">
          <div>Order ID: <strong>{orderId}</strong></div>
          <div>Customer: {form.custName} ({form.phone})</div>
          <div>Item: {form.itemName}</div>
          <div>Amount: ৳{form.amountPaid}</div>
        </div>
        <a
          href={`/track?orderId=${orderId}&phone=${form.phone}`}
          className="inline-block bg-[var(--color-rust)] text-white px-6 py-3 font-semibold text-[15px] hover:bg-[var(--color-brick)] transition-colors"
        >
          Track this order →
        </a>
        <p className="text-[12px] text-[var(--color-olive)] mt-4">
          Keep your Order ID safe. Use it to track your delivery.
        </p>
      </div>
    )
  }

  return (
    <section className="mt-9">
      <p className="font-mono text-[11.5px] tracking-[0.14em] uppercase text-[var(--color-rust)] mb-1">Your order</p>
      <h2 className="font-display text-[22px] text-[var(--color-ink)] mb-5">Place an order</h2>

      {/* Customer details */}
      <div className="mb-5">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink)] border-t-[1.5px] border-[var(--color-ink)] pt-4 mb-3.5">
          Customer details
        </p>
        <Field label="Full name *" name="custName" placeholder="e.g. Rahim Uddin" value={form.custName} onChange={handleChange} />
        <Field label="WhatsApp number *" name="phone" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} />
      </div>

      {/* Delivery address */}
      <div className="mb-5">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink)] border-t-[1.5px] border-[var(--color-ink)] pt-4 mb-3.5">
          Delivery address
        </p>
        <div className="mb-3.5">
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            Union *
          </label>
          <select name="union" value={form.union} onChange={handleChange}
            className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] focus:outline-none">
            <option value="">Select union</option>
            {UNIONS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <Field label="Ward / area *" name="wardArea" placeholder="e.g. Ward 4, Noapara Bazar area" value={form.wardArea} onChange={handleChange} />
        <Field label="Village / Bari *" name="villageBari" placeholder="e.g. Miah Bari, 2nd lane" value={form.villageBari} onChange={handleChange} />
        <Field label="Nearest landmark (optional)" name="landmark" placeholder="e.g. behind the mosque" value={form.landmark} onChange={handleChange} />
      </div>

      {/* Item details */}
      <div className="mb-5">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink)] border-t-[1.5px] border-[var(--color-ink)] pt-4 mb-3.5">
          Item details
        </p>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button onClick={() => setIsRepeat(false)} className={`py-2.5 text-[14px] font-semibold border-2 transition-colors ${!isRepeat ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white text-[var(--color-ink)] border-[var(--color-ink)]"}`}>
            New item
          </button>
          <button onClick={() => setIsRepeat(true)} className={`py-2.5 text-[14px] font-semibold border-2 transition-colors ${isRepeat ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]" : "bg-white text-[var(--color-ink)] border-[var(--color-ink)]"}`}>
            Ordered before
          </button>
        </div>
        <Field label="Item name *" name="itemName" placeholder="e.g. Mango Juice, 1L" value={form.itemName} onChange={handleChange} />
        <Field label="Brand *" name="brandName" placeholder="e.g. Pran" value={form.brandName} onChange={handleChange} />
        <div className="mb-3.5">
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            Reference photo *
          </label>
          <input
            type="text" name="refPhoto" value={form.refPhoto} onChange={handleChange}
            placeholder="Paste a photo link (Facebook, Daraz, Google…)"
            className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] focus:outline-none"
          />
          <button onClick={checkRefLink} className="mt-1.5 px-3 py-1.5 text-[12.5px] font-semibold border-[1.5px] border-[var(--color-ink)] bg-white hover:bg-[var(--color-kraft)] transition-colors">
            Check this link
          </button>
          {refLinkStatus && <p className="text-[12px] text-[var(--color-olive)] mt-1">{refLinkStatus}</p>}
        </div>
        {isRepeat && (
          <>
            <Field label="Shop name" name="shopName" placeholder="e.g. Hasan Store, Reazuddin Bazar" value={form.shopName} onChange={handleChange} />
            <Field label="Last price you paid" name="lastPrice" placeholder="e.g. ৳450" value={form.lastPrice} onChange={handleChange} />
          </>
        )}
        <Field label="Your budget / max price" name="budget" placeholder="e.g. up to ৳800 (min ৳500)" value={form.budget} onChange={handleChange} />
      </div>

      {/* Payment */}
      <div className="mb-5">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink)] border-t-[1.5px] border-[var(--color-ink)] pt-4 mb-3.5">
          Payment
        </p>
        <div className="border-[1.5px] border-[var(--color-ink)] bg-[var(--color-kraft)] p-3.5 mb-4">
          <strong className="block text-[15px] mb-1">Send your advance payment to:</strong>
          <span className="font-mono text-[18px] font-semibold tracking-[0.03em]">{BKASH_NAGAD}</span>
          <p className="text-[12px] text-[var(--color-olive)] mt-1.5">
            Same number for both bKash and Nagad. Choose "Send Money," not "Payment."
          </p>
        </div>
        <div className="mb-3.5">
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            Payment method *
          </label>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}
            className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] focus:outline-none">
            <option value="">Select one</option>
            <option>bKash</option>
            <option>Nagad</option>
          </select>
        </div>
        <Field label="Amount you sent (৳) *" name="amountPaid" type="number" placeholder="e.g. 500" value={form.amountPaid} onChange={handleChange} />
        <Field label="Transaction ID *" name="transactionId" placeholder="e.g. 9F7K2LX1QZ" value={form.transactionId} onChange={handleChange} />

        {/* Screenshot upload */}
        <div className="mb-3.5">
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            Payment screenshot *
          </label>
          {!screenshotFile ? (
            <label className="border-2 border-dashed border-[var(--color-ink)] bg-white p-6 flex flex-col items-center cursor-pointer hover:border-[var(--color-rust)] hover:bg-[#fff8f0] transition-colors">
              <span className="text-3xl mb-2">📎</span>
              <span className="text-[14px] font-semibold">Tap to choose screenshot</span>
              <span className="text-[12px] text-[var(--color-olive)]">JPG, PNG — under 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleScreenshot(e.target.files?.[0])} />
            </label>
          ) : (
            <div className="border-[1.5px] border-[var(--color-ink)] p-3 bg-white">
              <img src={screenshotPreview} alt="Screenshot" className="max-w-[140px] border border-[var(--color-ink)]" />
              <p className="text-[12px] text-[var(--color-olive)] mt-1">{screenshotFile.name}</p>
              <button onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                className="text-[12px] text-[var(--color-brick)] underline mt-1 bg-none border-none cursor-pointer">
                ✕ Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timing */}
      <div className="mb-5">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-ink)] border-t-[1.5px] border-[var(--color-ink)] pt-4 mb-3.5">
          Timing
        </p>
        <div className="border-[1.5px] border-[var(--color-ink)] bg-[var(--color-kraft)] p-3.5 mb-3.5">
          <label className="flex items-center gap-2.5 text-[14px] font-semibold cursor-pointer">
            <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-[18px] h-[18px] accent-[var(--color-ink)]" />
            This order is urgent — placed after 12:00 PM
          </label>
          <p className="text-[12px] text-[var(--color-olive)] mt-1.5">
            We'll confirm if same-day is still possible. If not, it's set for the next route day.
          </p>
        </div>
        <div className="mb-3.5">
          <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
            Anything else we should know
          </label>
          <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
            placeholder="Size, color, deadline, anything else"
            className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] resize-y focus:outline-none" />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!agreed || !isOpen || submitting}
        className={`w-full py-4 text-[16px] font-bold text-white transition-colors ${
          agreed && isOpen && !submitting
            ? "bg-[var(--color-rust)] hover:bg-[var(--color-brick)] cursor-pointer"
            : "bg-[#b9ad8f] cursor-not-allowed"
        }`}
      >
        {submitting ? "Sending…" : !agreed ? "Read & agree to terms above to continue" : "Place order & open WhatsApp"}
      </button>
      {!isOpen && (
        <p className="text-[12.5px] text-[var(--color-brick)] text-center mt-2">
          Orders are paused today. Check back tomorrow.
        </p>
      )}
    </section>
  )
};

const Field = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div className="mb-3.5">
    <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--color-olive)] mb-1.5 block">
      {label}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] focus:outline-none focus:border-[var(--color-rust)]"
    />
  </div>
);

export default OrderForm;