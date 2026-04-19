import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Mail, Plus, Trash2, Edit2, X, Check, TrendingUp, AlertCircle, RefreshCw, LogOut, Search } from "lucide-react";
import { getAdminStats, getAdminOrders, updateOrderStatus, getAdminUsers, updateUserRole, getProducts, addProduct, deleteProduct, updateProductStock, getAdminCoupons, createCoupon, deleteCoupon, getAdminNewsletter } from "../api/api";
import { useTheme } from "../contexts/ThemeContext";
import { CATEGORIES } from "../data/products";

const STATUS_COLORS = {
  pending:    { bg: "#FFF3E0", text: "#E65100", border: "#FFB74D" },
  processing: { bg: "#E3F2FD", text: "#0D47A1", border: "#64B5F6" },
  shipped:    { bg: "#F3E5F5", text: "#4A148C", border: "#CE93D8" },
  delivered:  { bg: "#E8F5E9", text: "#1B5E20", border: "#81C784" },
  cancelled:  { bg: "#FFEBEE", text: "#B71C1C", border: "#EF9A9A" },
};

const TABS = [
  { id: "overview",   label: "Overview",   icon: LayoutDashboard },
  { id: "orders",     label: "Orders",     icon: ShoppingBag },
  { id: "products",   label: "Products",   icon: Package },
  { id: "users",      label: "Users",      icon: Users },
  { id: "coupons",    label: "Coupons",    icon: Tag },
  { id: "newsletter", label: "Newsletter", icon: Mail },
];

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span style={{ background: c.bg, color: c.text, border: "1px solid " + c.border, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
        <RefreshCw size={28} color="#1a1a2e" />
      </motion.div>
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === "error" ? "#FFEBEE" : "#E8F5E9";
  const color = type === "error" ? "#B71C1C" : "#1B5E20";
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: bg, color, padding: "12px 20px", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, maxWidth: 360 }}>
      {type === "error" ? <AlertCircle size={16} /> : <Check size={16} />}
      <span style={{ fontSize: 14 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: 8, color }}><X size={14} /></button>
    </motion.div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAdminStats().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const cards = stats ? [
    { label: "Total Revenue",    value: "Rs." + (stats.totalRevenue || 0).toLocaleString(), icon: TrendingUp, bg: "#E3F2FD", color: "#1565C0" },
    { label: "Total Orders",     value: stats.totalOrders ?? 0,                              icon: ShoppingBag, bg: "#F3E5F5", color: "#6A1B9A" },
    { label: "Total Products",   value: stats.totalProducts ?? 0,                            icon: Package,    bg: "#E8F5E9", color: "#2E7D32" },
    { label: "Total Users",      value: stats.totalUsers ?? 0,                               icon: Users,      bg: "#FFF3E0", color: "#E65100" },
    { label: "Subscribers",      value: stats.totalSubscribers ?? 0,                         icon: Mail,       bg: "#FCE4EC", color: "#880E4F" },
    { label: "Revenue (7 days)", value: "Rs." + (stats.recentRevenue || 0).toLocaleString(), icon: TrendingUp, bg: "#E0F2F1", color: "#00695C" },
  ] : [];
  if (loading) return <Loader />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
      {cards.map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          style={{ background: c.bg, borderRadius: 16, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: c.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <c.icon size={22} color="#fff" />
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: c.color }}>{c.value}</div>
          <div style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>{c.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function OrdersTab({ toast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);
  const load = () => { setLoading(true); getAdminOrders().then(r => setOrders(r.data.orders || r.data)).catch(() => toast("Failed to load orders", "error")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleStatus = async (id, status) => {
    setUpdating(id);
    try { await updateOrderStatus(id, status); setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o)); toast("Status updated"); }
    catch { toast("Failed", "error"); } finally { setUpdating(null); }
  };
  const filters = ["all","pending","processing","shipped","delivered","cancelled"];
  const filtered = orders.filter(o => {
    const mf = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const ms = !q || o._id.includes(q) || (o.user?.name||"").toLowerCase().includes(q) || (o.user?.email||"").toLowerCase().includes(q);
    return mf && ms;
  });
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filter === f ? "#1a1a2e" : "#f0f0f0", color: filter === f ? "#fff" : "#555", textTransform: "capitalize" }}>{f}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "#f5f5f5", borderRadius: 10, padding: "6px 12px" }}>
          <Search size={14} color="#888" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ border: "none", background: "none", outline: "none", fontSize: 13, width: 160 }} />
        </div>
        <button onClick={load} style={{ background: "#f0f0f0", border: "none", borderRadius: 10, padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
      {loading ? <Loader /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8f8f8" }}>
                {["Order ID","Customer","Items","Total","Status","Date","Update"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", borderBottom: "2px solid #eee", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No orders found</td></tr>
              ) : filtered.map(o => (
                <tr key={o._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#555", fontSize: 12 }}>#{o._id.slice(0,8)}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ fontWeight: 600 }}>{o.user?.name || "Guest"}</div>
                    <div style={{ color: "#888", fontSize: 11 }}>{o.user?.email || ""}</div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>{o.items?.length ?? 0}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>Rs.{(o.totalAmount||0).toLocaleString()}</td>
                  <td style={{ padding: "10px 12px" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: "10px 12px", color: "#888", whiteSpace: "nowrap" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <select value={o.status} disabled={updating === o._id} onChange={e => handleStatus(o._id, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #ddd", fontSize: 12, cursor: "pointer" }}>
                      {["pending","processing","shipped","delivered","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const PCATS = CATEGORIES.filter(c => c !== "All");
const emptyForm = { name: "", price: "", memberPrice: "", category: PCATS[0] || "", image: "", stock: "50", description: "" };

function ProductsTab({ toast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editStock, setEditStock] = useState({});
  const [stockVal, setStockVal] = useState({});
  const inp = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none", boxSizing: "border-box" };
  const load = () => { setLoading(true); getProducts().then(r => setProducts(r.data)).catch(() => toast("Failed", "error")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleAdd = async e => {
    e.preventDefault(); setAdding(true);
    try { await addProduct({ ...form, price: Number(form.price), memberPrice: Number(form.memberPrice), stock: Number(form.stock) }); toast("Product added"); setForm(emptyForm); setShowForm(false); load(); }
    catch { toast("Failed to add", "error"); } finally { setAdding(false); }
  };
  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return;
    try { await deleteProduct(id); toast("Deleted"); load(); } catch { toast("Failed", "error"); }
  };
  const handleStockSave = async id => {
    try { await updateProductStock(id, Number(stockVal[id])); toast("Stock updated"); setEditStock(p => ({ ...p, [id]: false })); load(); }
    catch { toast("Failed", "error"); }
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontWeight: 600 }}>{products.length} Products</span>
        <button onClick={() => setShowForm(p => !p)} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Add Product
        </button>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleAdd} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "#f8f9ff", borderRadius: 14, padding: 20, marginBottom: 24, border: "1px solid #e0e4ff", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Name *</label><input required style={inp} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Price (Rs.) *</label><input required type="number" style={inp} value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Member Price</label><input type="number" style={inp} value={form.memberPrice} onChange={e => setForm(p => ({ ...p, memberPrice: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Category</label>
                <select style={inp} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {PCATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Image URL</label><input style={inp} value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Stock</label><input type="number" style={inp} value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} /></div>
              <div style={{ gridColumn: "1 / -1" }}><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Description</label><textarea style={{ ...inp, resize: "vertical", minHeight: 56 }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button type="submit" disabled={adding} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{adding ? "Adding..." : "Add Product"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      {loading ? <Loader /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ height: 130, background: "#f5f5f5", overflow: "hidden" }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}><Package size={36} /></div>}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{p.category} &bull; Rs.{(p.price||0).toLocaleString()}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#555" }}>Stock:</span>
                  {editStock[p._id] ? (
                    <>
                      <input type="number" value={stockVal[p._id] ?? p.stock ?? 0} onChange={e => setStockVal(prev => ({ ...prev, [p._id]: e.target.value }))} style={{ width: 56, padding: "3px 6px", borderRadius: 6, border: "1px solid #ddd", fontSize: 12 }} />
                      <button onClick={() => handleStockSave(p._id)} style={{ background: "#E8F5E9", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#2E7D32" }}><Check size={12} /></button>
                      <button onClick={() => setEditStock(prev => ({ ...prev, [p._id]: false }))} style={{ background: "#FFEBEE", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#B71C1C" }}><X size={12} /></button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{p.stock ?? 0}</span>
                      <button onClick={() => { setEditStock(prev => ({ ...prev, [p._id]: true })); setStockVal(prev => ({ ...prev, [p._id]: p.stock ?? 0 })); }} style={{ background: "#f0f0f0", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                        <Edit2 size={11} /> Edit
                      </button>
                    </>
                  )}
                </div>
                <button onClick={() => handleDelete(p._id)} style={{ width: "100%", background: "#FFEBEE", color: "#B71C1C", border: "none", borderRadius: 8, padding: "7px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState(null);

  const load = () => { getAdminUsers().then(r => setUsers(r.data)).catch(() => toast("Failed", "error")).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleRoleToggle = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Make ${u.name} a ${newRole}?`)) return;
    setToggling(u._id);
    try {
      await updateUserRole(u._id, newRole);
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, role: newRole } : x));
      toast(`${u.name} is now ${newRole}`);
    } catch { toast("Failed to update role", "error"); }
    finally { setToggling(null); }
  };

  const filtered = users.filter(u => !search || (u.name||"").toLowerCase().includes(search.toLowerCase()) || (u.email||"").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f5f5f5", borderRadius: 10, padding: "8px 14px", marginBottom: 20, maxWidth: 300 }}>
        <Search size={14} color="#888" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ border: "none", background: "none", outline: "none", fontSize: 13, width: "100%" }} />
      </div>
      {loading ? <Loader /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#f8f8f8" }}>
              {["Name","Email","Role","Joined","Action"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", borderBottom: "2px solid #eee" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No users</td></tr>
              : filtered.map(u => (
                <tr key={u._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: "10px 12px", color: "#555" }}>{u.email}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ background: u.role === "admin" ? "#E3F2FD" : "#F3E5F5", color: u.role === "admin" ? "#0D47A1" : "#6A1B9A", padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{u.role || "user"}</span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#888" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={toggling === u._id}
                      style={{
                        padding: "4px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
                        background: u.role === "admin" ? "#FFEBEE" : "#E8F5E9",
                        color: u.role === "admin" ? "#B71C1C" : "#1B5E20",
                        opacity: toggling === u._id ? 0.6 : 1,
                      }}
                    >
                      {toggling === u._id ? "..." : u.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const emptyCoupon = { code: "", discountType: "percentage", discountValue: "", minPurchase: "", description: "", validUntil: "" };

function CouponsTab({ toast }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyCoupon);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const inp = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none", boxSizing: "border-box" };
  const load = () => { setLoading(true); getAdminCoupons().then(r => setCoupons(r.data)).catch(() => toast("Failed", "error")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleCreate = async e => {
    e.preventDefault(); setCreating(true);
    try { await createCoupon({ ...form, discountValue: Number(form.discountValue), minPurchase: Number(form.minPurchase) }); toast("Coupon created"); setForm(emptyCoupon); setShowForm(false); load(); }
    catch { toast("Failed", "error"); } finally { setCreating(false); }
  };
  const handleDelete = async id => {
    if (!window.confirm("Delete coupon?")) return;
    try { await deleteCoupon(id); toast("Deleted"); load(); } catch { toast("Failed", "error"); }
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontWeight: 600 }}>{coupons.length} Coupons</span>
        <button onClick={() => setShowForm(p => !p)} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Create Coupon
        </button>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleCreate} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ background: "#f8f9ff", borderRadius: 14, padding: 20, marginBottom: 24, border: "1px solid #e0e4ff", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Code *</label><input required style={inp} value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. SAVE20" /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Type</label>
                <select style={inp} value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (Rs.)</option>
                </select>
              </div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Value *</label><input required type="number" style={inp} value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Min Purchase</label><input type="number" style={inp} value={form.minPurchase} onChange={e => setForm(p => ({ ...p, minPurchase: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Valid Until</label><input type="date" style={inp} value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} /></div>
              <div><label style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>Description</label><input style={inp} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button type="submit" disabled={creating} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{creating ? "Creating..." : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      {loading ? <Loader /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {coupons.length === 0 ? <p style={{ color: "#aaa" }}>No coupons yet.</p> : coupons.map(c => (
            <div key={c._id} style={{ background: "#fff", borderRadius: 14, border: "1px dashed #ccc", padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#1a1a2e", letterSpacing: 2 }}>{c.code}</div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{c.discountType === "percentage" ? c.discountValue + "% off" : "Rs." + c.discountValue + " off"}{c.minPurchase ? " | Min Rs." + c.minPurchase : ""}</div>
                  {c.description && <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{c.description}</div>}
                </div>
                <button onClick={() => handleDelete(c._id)} style={{ background: "#FFEBEE", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#B71C1C" }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsletterTab({ toast }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => { getAdminNewsletter().then(r => setData(r.data.subscribers || r.data)).catch(() => toast("Failed", "error")).finally(() => setLoading(false)); }, []);
  const filtered = data.filter(s => !search || (s.email||"").toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #E3F2FD, #F3E5F5)", borderRadius: 16, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center" }}><Mail size={24} color="#fff" /></div>
        <div><div style={{ fontSize: 32, fontWeight: 700, color: "#1a1a2e" }}>{data.length}</div><div style={{ fontSize: 14, color: "#555" }}>Total Subscribers</div></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f5f5f5", borderRadius: 10, padding: "8px 14px", marginBottom: 20, maxWidth: 300 }}>
        <Search size={14} color="#888" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails..." style={{ border: "none", background: "none", outline: "none", fontSize: 13, width: "100%" }} />
      </div>
      {loading ? <Loader /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "#f8f8f8" }}>
              {["#","Email","Subscribed On"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#555", borderBottom: "2px solid #eee" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={3} style={{ textAlign: "center", padding: 40, color: "#aaa" }}>No subscribers</td></tr>
              : filtered.map((s, i) => (
                <tr key={s._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 12px", color: "#aaa", width: 40 }}>{i+1}</td>
                  <td style={{ padding: "10px 12px" }}>{s.email}</td>
                  <td style={{ padding: "10px 12px", color: "#888" }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ user, onLogout, onClose }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [toastData, setToastData] = useState(null);
  const showToast = (msg, type = "success") => setToastData({ msg, type });

  if (!user || user.role !== "admin") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: theme.colors.background, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <AlertCircle size={56} color="#E50010" />
        <h2 style={{ fontSize: 28, fontWeight: 700, color: theme.colors.text, margin: 0 }}>Access Denied</h2>
        <p style={{ color: theme.colors.textSecondary, margin: 0 }}>Admin access required. Login as admin to continue.</p>
        <button onClick={onClose} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Go Back</button>
      </div>
    );
  }

  const tabProps = { toast: showToast };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 230, flexShrink: 0, background: "#1a1a2e", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>Aashirwad</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left", background: active ? "rgba(255,255,255,0.12)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.55)", fontWeight: active ? 600 : 400, fontSize: 14, transition: "all 0.15s" }}>
                <tab.icon size={16} />
                {tab.label}
                {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#E50010" }} />}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#E50010", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 14 }}>
              {(user.name || "A")[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(229,0,16,0.15)", color: "#FF6B6B", fontSize: 13, fontWeight: 600 }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: theme.colors.background, overflow: "hidden" }}>
        <div style={{ padding: "18px 28px", borderBottom: "1px solid " + theme.colors.border, display: "flex", alignItems: "center", justifyContent: "space-between", background: theme.colors.surface, flexShrink: 0 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.colors.text }}>{TABS.find(t => t.id === activeTab)?.label}</h1>
            <p style={{ margin: 0, fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <button onClick={onClose} style={{ background: theme.colors.border, border: "none", borderRadius: 10, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: theme.colors.text }}>
            <X size={15} /> Close
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
              {activeTab === "overview"   && <OverviewTab    {...tabProps} />}
              {activeTab === "orders"     && <OrdersTab      {...tabProps} />}
              {activeTab === "products"   && <ProductsTab    {...tabProps} />}
              {activeTab === "users"      && <UsersTab       {...tabProps} />}
              {activeTab === "coupons"    && <CouponsTab     {...tabProps} />}
              {activeTab === "newsletter" && <NewsletterTab  {...tabProps} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toastData && <Toast key={toastData.msg} msg={toastData.msg} type={toastData.type} onClose={() => setToastData(null)} />}
      </AnimatePresence>
    </div>
  );
}
