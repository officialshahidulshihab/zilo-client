"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
// ✅ FIX: Read the key from env — must match ADMIN_KEY on the server exactly
const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || "";
const STORAGE_KEY = "zilo_admin_authed";

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
    // ✅ FIX: Compare against ADMIN_KEY from env, not a hardcoded string
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

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // ✅ FIX: Use ADMIN_KEY from env for the header
      const headers = { "x-admin-key": ADMIN_KEY };

      const [ordersRes, statsRes, statusRes] = await Promise.all([
        fetch(`${SERVER}/api/admin/orders`, { headers }),
        fetch(`${SERVER}/api/admin/stats`, { headers }),
        fetch(`${SERVER}/api/status`),
      ]);

      // ✅ FIX: Catch 403 specifically so you know it's a key mismatch
      if (ordersRes.status === 403) {
        toast.error("Admin key rejected by server. Check your .env files.");
        setLoading(false);
        return;
      }
      if (!ordersRes.ok) throw new Error(`Orders fetch failed: ${ordersRes.status}`);
      if (!statsRes.ok)  throw new Error(`Stats fetch failed: ${statsRes.status}`);

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

  // ── ACTIONS ───────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${SERVER}/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Status → ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
    setUpdatingId(null);
  };

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

  // ── RENDER: auth not yet checked ───────────
  if (!authChecked) return null;

  // ── RENDER: login screen ──────────────────────────────────
  // Intentionally minimal — no branding, no hint this is admin
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

  // ── RENDER: dashboard ─────────────────────────────────────
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
            title="Refresh"
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

                    {expandedId === order._id && (
                      <div className="border-t border-[var(--color-line)] p-4 bg-[var(--color-kraft)]">
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
                          {order.refPhoto && (
                            <div className="sm:col-span-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] block mb-0.5">
                                Ref photo
                              </span>
                              <a href={order.refPhoto} target="_blank" rel="noreferrer"
                                className="text-[var(--color-rust)] underline break-all text-[12.5px]">
                                {order.refPhoto}
                              </a>
                            </div>
                          )}
                          {order.screenshotUrl && (
                            <div className="sm:col-span-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] block mb-1">
                                Payment screenshot
                              </span>
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

                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-olive)] mb-2">
                            Update status
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.map((s, ind) => (
                              <button
                                key={ind}
                                onClick={() => handleStatusChange(order._id, s)}
                                disabled={updatingId === order._id || order.status === s}
                                className={`px-3 py-1.5 text-[12px] font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  order.status === s
                                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                                    : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                                }`}
                              >
                                {updatingId === order._id && order.status !== s ? "…" : s}
                              </button>
                            ))}
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