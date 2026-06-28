"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "";
const STORAGE_KEY = "zilo_admin_authed";
const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";

const STATUSES = [
  "Order Received",
  "Payment Verified",
  "Sourcing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const STATUS_COLORS = {
  "Order Received":   "bg-[#4A4A42]",
  "Payment Verified": "bg-[#1a5276]",
  "Sourcing":         "bg-[#7d6608]",
  "Out for Delivery": "bg-[#1e8449]",
  "Delivered":        "bg-[#145a32]",
  "Cancelled":        "bg-[#7A2E22]",
};

// ── WhatsApp message builder ──────────────────────────────
const buildWhatsAppMessage = (order, newStatus, statusNote) => {
  const trackUrl = `${CLIENT_URL}/track?orderId=${order.orderId}&phone=${order.phone}`;
  const note = statusNote?.trim() ? `\n\n📝 ${statusNote.trim()}` : "";

  const messages = {
    "Payment Verified": [
      `আস্সালামু আলাইকুম ${order.custName} ভাই/আপু! 👋`,
      ``,
      `✅ *পেমেন্ট নিশ্চিত হয়েছে*`,
      `আপনার ৳${order.amountPaid} পেমেন্ট (${order.paymentMethod}) ভেরিফাই করা হয়েছে।`,
      ``,
      `🛒 *অর্ডার:* ${order.itemName} (${order.brandName})`,
      `🔖 *অর্ডার আইডি:* ${order.orderId}${note}`,
      ``,
      `এখন আপনার আইটেম সোর্স করার কাজ শুরু হবে। আমরা আইটেম খুঁজে পেলে ছবি পাঠাবো।`,
      ``,
      `📦 ট্র্যাক করুন: ${trackUrl}`,
    ],

    "Sourcing": [
      `আস্সালামু আলাইকুম ${order.custName} ভাই/আপু! 👋`,
      ``,
      `🔍 *আইটেম খোঁজা শুরু হয়েছে*`,
      `আপনার অর্ডার এখন সোর্স করা হচ্ছে।`,
      ``,
      `🛒 *আইটেম:* ${order.itemName} (${order.brandName})`,
      `🔖 *অর্ডার আইডি:* ${order.orderId}${note}`,
      ``,
      `আইটেম পেলে আমরা ছবি পাঠাবো — ছবি দেখে অ্যাপ্রুভ করুন তারপরে কেনা হবে।`,
      ``,
      `📦 ট্র্যাক করুন: ${trackUrl}`,
    ],

    "Out for Delivery": [
      `আস্সালামু আলাইকুম ${order.custName} ভাই/আপু! 👋`,
      ``,
      `🏍️ *আপনার ডেলিভারি রওনা দিয়েছে!*`,
      `আপনার আইটেম এখন পথে আছে।`,
      ``,
      `🛒 *আইটেম:* ${order.itemName} (${order.brandName})`,
      `📍 *ঠিকানা:* ${order.union}, ${order.wardArea}, ${order.villageBari}${order.landmark ? `, ${order.landmark}` : ""}`,
      `🔖 *অর্ডার আইডি:* ${order.orderId}${note}`,
      ``,
      `বাড়িতে থাকুন — আজকে সন্ধ্যার মধ্যে পৌঁছে যাবে ইনশাআল্লাহ।`,
      ``,
      `📦 ট্র্যাক করুন: ${trackUrl}`,
    ],

    "Delivered": [
      `আস্সালামু আলাইকুম ${order.custName} ভাই/আপু! 👋`,
      ``,
      `✅ *ডেলিভারি সম্পন্ন হয়েছে!*`,
      `আপনার আইটেম পৌঁছে গেছে।`,
      ``,
      `🛒 *আইটেম:* ${order.itemName} (${order.brandName})`,
      `🔖 *অর্ডার আইডি:* ${order.orderId}${note}`,
      ``,
      `ZILO ব্যবহার করার জন্য ধন্যবাদ! 🙏`,
      `পরের বার আবার অর্ডার করুন: ${CLIENT_URL}`,
    ],

    "Cancelled": [
      `আস্সালামু আলাইকুম ${order.custName} ভাই/আপু! 👋`,
      ``,
      `❌ *অর্ডার বাতিল হয়েছে*`,
      `দুঃখিত, আপনার অর্ডারটি বাতিল করতে হয়েছে।`,
      ``,
      `🛒 *আইটেম:* ${order.itemName} (${order.brandName})`,
      `🔖 *অর্ডার আইডি:* ${order.orderId}${note}`,
      ``,
      `রিফান্ড সম্পর্কিত তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।`,
      ``,
      `📦 ট্র্যাক করুন: ${trackUrl}`,
    ],
  };

  return messages[newStatus] || null;
};

const openWhatsApp = (order, newStatus, statusNote) => {
  const lines = buildWhatsAppMessage(order, newStatus, statusNote);
  if (!lines) return;

  let phone = order.phone.replace(/\D/g, "");
  if (phone.startsWith("0")) phone = "880" + phone.slice(1);
  if (!phone.startsWith("880")) phone = "880" + phone;

  const text = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
};

const WA_NOTIFY_STATUSES = new Set([
  "Payment Verified",
  "Sourcing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
]);

const AdminPage = () => {
  // ── AUTH ────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setAuthed(true);
    setAuthChecked(true);
  }, []);

  const handleLogin = () => {
    if (key === ADMIN_KEY) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
      toast.success("Welcome, operator.");
    } else {
      toast.error("Wrong key.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setKey("");
  };

  // ── DATA ─────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, revenue: 0 });
  const [serviceStatus, setServiceStatus] = useState({ isOpen: true, message: "" });
  const [offMessage, setOffMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // ── UI STATE ─────────────────────────────────────────────
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const [expandedId, setExpandedId] = useState(null);
  const [statusNotes, setStatusNotes] = useState({});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { "x-admin-key": ADMIN_KEY };

      const [ordersRes, statsRes, statusRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/orders`, { headers }),
        fetch(`${SERVER}/api/admin/stats`, { headers }),
        fetch(`${SERVER}/api/status`),
      ]);

      if (ordersRes.status === 403) {
        toast.error("Admin key rejected. Check your .env files.");
        setLoading(false);
        return;
      }
      if (!ordersRes.ok) throw new Error(`Orders fetch failed: ${ordersRes.status}`);
      if (!statsRes.ok) throw new Error(`Stats fetch failed: ${statsRes.status}`);

      const [ordersData, statsData, statusData] = await Promise.all([
        ordersRes.json(),
        statsRes.json(),
        statusRes.json(),
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setStats(statsData);
      setServiceStatus(statusData);
      setOffMessage(statusData.message || "");
    } catch (err) {
      console.error("fetchAll error:", err);
      toast.error("Failed to load data — check the server is running.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  // ── STATUS UPDATE + WhatsApp ───────────────────────────
  const handleStatusChange = async (order, newStatus) => {
    const note = statusNotes[order._id] || "";
    setUpdatingId(order._id);

    try {
      const res = await fetch(`${SERVER}/api/admin/orders/${order._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ status: newStatus, statusNote: note }),
      });
      if (!res.ok) throw new Error(await res.text());

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: newStatus, statusNote: note } : o
        )
      );

      if (WA_NOTIFY_STATUSES.has(newStatus)) {
        openWhatsApp(order, newStatus, note);
        toast.success(`Status → ${newStatus} · WhatsApp খুলছে…`);
      } else {
        toast.success(`Status → ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }

    setUpdatingId(null);
  };

  // ── SERVICE CONTROLS ──────────────────────────────────
  const toggleService = async () => {
    const next = !serviceStatus.isOpen;
    try {
      const res = await fetch(`${SERVER}/api/admin/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ isOpen: next, message: offMessage }),
      });
      if (!res.ok) throw new Error(await res.text());
      setServiceStatus((s) => ({ ...s, isOpen: next }));
      toast.success(next ? "Service is now open." : "Service paused.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle service.");
    }
  };

  const saveOffMessage = async () => {
    try {
      const res = await fetch(`${SERVER}/api/admin/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_KEY },
        body: JSON.stringify({ isOpen: serviceStatus.isOpen, message: offMessage }),
      });
      if (!res.ok) throw new Error(await res.text());
      setServiceStatus((s) => ({ ...s, message: offMessage }));
      toast.success("Message saved.");
    } catch {
      toast.error("Failed to save message.");
    }
  };

  // ── FILTERING ─────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderId?.toLowerCase().includes(q) ||
      o.custName?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.itemName?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  if (!authChecked) return null;

  // ── LOGIN ────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-4">
        <div className="w-full max-w-xs">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full px-3 py-3 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[15px] mb-3 focus:outline-none focus:border-[var(--color-rust)]"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[var(--color-ink)] text-white font-bold text-[15px] hover:bg-[var(--color-rust)] transition-colors"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--color-paper)]">

      {/* Top bar */}
      <div className="border-b-[3px] border-[var(--color-ink)] px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] text-[var(--color-ink)] leading-none">ZILO Admin</h1>
          <p className="text-[12px] text-[var(--color-olive)] mt-0.5">Noapara ⇄ Pahartali</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${serviceStatus.isOpen ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-[12px] text-[var(--color-olive)] hidden sm:inline">
              {serviceStatus.isOpen ? "Open" : "Paused"}
            </span>
          </div>
          <button
            onClick={fetchAll}
            className="px-3 py-1.5 text-[12px] font-semibold border-[1.5px] border-[var(--color-ink)] bg-white hover:bg-[var(--color-kraft)] transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-[12px] font-semibold border-[1.5px] border-[var(--color-brick)] text-[var(--color-brick)] hover:bg-[var(--color-brick)] hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[var(--color-line)]">
        {[
          { label: "Total orders", value: stats.total ?? 0 },
          { label: "Today",        value: stats.today ?? 0 },
          { label: "Pending",      value: stats.pending ?? 0 },
          { label: "Revenue (৳)",  value: `৳${(stats.revenue ?? 0).toLocaleString()}` },
        ].map((s, ind) => (
          <div key={ind} className="px-4 py-4 border-r border-[var(--color-line)] last:border-r-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-olive)]">{s.label}</p>
            <p className="font-display text-[26px] text-[var(--color-ink)] mt-1 leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-line)] mb-6">
          {["orders", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-[13px] font-semibold capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[var(--color-rust)] text-[var(--color-rust)]"
                  : "border-transparent text-[var(--color-olive)] hover:text-[var(--color-ink)]"
              }`}
            >
              {tab}
              {tab === "orders" && orders.length > 0 && (
                <span className="ml-1.5 font-mono text-[10px] bg-[var(--color-kraft)] px-1.5 py-0.5">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, order ID, item…"
                className="flex-1 px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[14px] focus:outline-none focus:border-[var(--color-rust)]"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[14px] focus:outline-none"
              >
                <option value="all">All statuses</option>
                {STATUSES.map((s, ind) => <option key={ind} value={s}>{s}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <p className="font-mono text-[13px] text-[var(--color-olive)] animate-pulse">Loading orders…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--color-line)] py-14 text-center">
                <p className="font-display text-[22px] text-[var(--color-ink)]">No orders found</p>
                <p className="text-[13px] text-[var(--color-olive)] mt-1">Try a different filter or search term.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((order, ind) => (
                  <div key={ind} className="border-[1.5px] border-[var(--color-line)] bg-white">

                    {/* Collapsed row */}
                    <div
                      className="p-4 flex items-start gap-3 cursor-pointer hover:bg-[var(--color-kraft)] transition-colors"
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-[12px] font-bold text-[var(--color-rust)]">
                            {order.orderId}
                          </span>
                          <span className={`text-[10px] font-bold text-white px-2 py-0.5 ${STATUS_COLORS[order.status] || "bg-[#4A4A42]"}`}>
                            {order.status}
                          </span>
                          {order.isUrgent && (
                            <span className="text-[10px] font-bold bg-[var(--color-brick)] text-white px-2 py-0.5">
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-[14px] font-semibold text-[var(--color-ink)] truncate">{order.custName}</p>
                        <p className="text-[12.5px] text-[var(--color-olive)]">
                          {order.phone} · {order.itemName}
                        </p>
                        <p className="text-[12px] text-[var(--color-olive)]">
                          {order.date} · ৳{order.amountPaid}
                        </p>
                      </div>
                      <span className="text-[var(--color-olive)] shrink-0 mt-1">
                        {expandedId === order._id ? "▲" : "▼"}
                      </span>
                    </div>

                    {/* Expanded panel */}
                    {expandedId === order._id && (
                      <div className="border-t border-[var(--color-line)] p-4 bg-[var(--color-kraft)]">

                        {/* Order details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px] mb-5">
                          <Detail label="Item" value={`${order.itemName} — ${order.brandName}`} />
                          <Detail label="Type" value={order.isRepeat ? "Repeat item" : "New item"} />
                          <Detail label="Delivery" value={`${order.union}, ${order.wardArea}, ${order.villageBari}${order.landmark ? ` (${order.landmark})` : ""}`} />
                          <Detail label="Payment" value={`${order.paymentMethod} · TxID: ${order.transactionId}`} />
                          <Detail label="Amount paid" value={`৳${order.amountPaid}`} />
                          {order.budget && <Detail label="Budget" value={order.budget} />}
                          {order.shopName && <Detail label="Shop" value={order.shopName} />}
                          {order.lastPrice && <Detail label="Last price" value={order.lastPrice} />}
                          {order.notes && <Detail label="Notes" value={order.notes} span />}
                          {order.statusNote && <Detail label="Last status note" value={order.statusNote} span />}
                          {order.refPhoto && (
                            <div className="sm:col-span-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] block mb-0.5">Ref photo</span>
                              <a href={order.refPhoto} target="_blank" rel="noreferrer"
                                className="text-[var(--color-rust)] underline break-all text-[12.5px]">
                                {order.refPhoto}
                              </a>
                            </div>
                          )}
                          {order.screenshotUrl && (
                            <div className="sm:col-span-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] block mb-1">Payment screenshot</span>
                              <a href={order.screenshotUrl} target="_blank" rel="noreferrer">
                                <img
                                  src={order.screenshotUrl}
                                  alt="Payment screenshot"
                                  className="max-w-[140px] border border-[var(--color-ink)] hover:opacity-80 transition-opacity"
                                />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* ── STATUS UPDATE ── */}
                        <div className="border-t border-[var(--color-line)] pt-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] mb-2">
                            Update status
                          </p>

                          {/* Note field */}
                          <div className="mb-3">
                            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-olive)] block mb-1">
                              Message note (optional — included in WhatsApp)
                            </label>
                            <input
                              type="text"
                              value={statusNotes[order._id] || ""}
                              onChange={(e) =>
                                setStatusNotes((prev) => ({ ...prev, [order._id]: e.target.value }))
                              }
                              placeholder="e.g. আপনার আইটেম পাওয়া গেছে, ছবি দেখুন"
                              className="w-full px-3 py-2 border-[1.5px] border-[var(--color-line)] bg-white text-[var(--color-ink)] text-[13px] focus:outline-none focus:border-[var(--color-rust)]"
                            />
                          </div>

                          {/* Status buttons */}
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.map((s, ind) => {
                              const isActive = order.status === s;
                              const isUpdating = updatingId === order._id;
                              const willNotify = WA_NOTIFY_STATUSES.has(s);
                              return (
                                <button
                                  key={ind}
                                  onClick={() => handleStatusChange(order, s)}
                                  disabled={isUpdating || isActive}
                                  className={`px-3 py-1.5 text-[12px] font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${
                                    isActive
                                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                      : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                                  }`}
                                >
                                  {isUpdating && !isActive ? "…" : s}
                                  {willNotify && !isActive && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <p className="text-[11px] text-[var(--color-olive)] mt-2.5 flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            এই স্ট্যাটাসগুলো আপডেট করলে WhatsApp-এ কাস্টমারকে মেসেজ পাঠানো হবে।
                          </p>
                        </div>

                        {/* Manual WhatsApp */}
                        <div className="mt-3 pt-3 border-t border-[var(--color-line)]">
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] mb-2">
                            Manual WhatsApp
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openWhatsApp(order, order.status, statusNotes[order._id] || "")}
                              disabled={!WA_NOTIFY_STATUSES.has(order.status)}
                              className="px-3 py-1.5 text-[12px] font-semibold bg-[#25D366] text-white border border-[#1ebe5d] hover:bg-[#1ebe5d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              ↗ বর্তমান স্ট্যাটাসের মেসেজ পাঠান
                            </button>
                            <a
                              href={`https://wa.me/${(() => {
                                let p = order.phone.replace(/\D/g, "");
                                if (p.startsWith("0")) p = "880" + p.slice(1);
                                if (!p.startsWith("880")) p = "880" + p;
                                return p;
                              })()}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 text-[12px] font-semibold bg-white text-[var(--color-ink)] border border-[var(--color-line)] hover:border-[var(--color-ink)] transition-colors"
                            >
                              💬 WhatsApp খুলুন (blank)
                            </a>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === "settings" && (
          <div className="max-w-lg space-y-5">
            <h2 className="font-display text-[22px] text-[var(--color-ink)]">Service settings</h2>

            <div className="border-[1.5px] border-[var(--color-ink)] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-[15px]">Service status</p>
                  <p className="text-[13px] text-[var(--color-olive)]">Pause orders on off-days</p>
                </div>
                <button
                  onClick={toggleService}
                  className={`px-5 py-2 font-bold text-[13px] border-2 transition-colors ${
                    serviceStatus.isOpen
                      ? "border-green-700 text-green-700 hover:bg-green-700 hover:text-white"
                      : "border-[var(--color-brick)] text-[var(--color-brick)] hover:bg-[var(--color-brick)] hover:text-white"
                  }`}
                >
                  {serviceStatus.isOpen ? "✓ Open — click to pause" : "✕ Paused — click to open"}
                </button>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-olive)] block mb-1.5">
                  Off-day message (shown to customers when paused)
                </label>
                <textarea
                  rows={2}
                  value={offMessage}
                  onChange={(e) => setOffMessage(e.target.value)}
                  placeholder="e.g. No service today — exams. Back tomorrow, inshallah."
                  className="w-full px-3 py-2.5 border-[1.5px] border-[var(--color-ink)] bg-white text-[var(--color-ink)] text-[14px] resize-none focus:outline-none focus:border-[var(--color-rust)]"
                />
                <button
                  onClick={saveOffMessage}
                  className="mt-2 px-4 py-2 bg-[var(--color-rust)] text-white text-[13px] font-bold hover:bg-[var(--color-brick)] transition-colors"
                >
                  Save message
                </button>
              </div>
            </div>

            <div className="border-[1.5px] border-[var(--color-line)] p-5">
              <p className="font-semibold text-[15px] mb-1">Session</p>
              <p className="text-[13px] text-[var(--color-olive)] mb-3">
                You are logged in as operator. Your session persists across page refreshes.
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-[1.5px] border-[var(--color-brick)] text-[var(--color-brick)] text-[13px] font-semibold hover:bg-[var(--color-brick)] hover:text-white transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value, span }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] block mb-0.5">
      {label}
    </span>
    <span className="text-[13px] text-[var(--color-ink)]">{value}</span>
  </div>
);

export default AdminPage;