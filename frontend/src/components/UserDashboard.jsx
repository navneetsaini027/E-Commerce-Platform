import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Edit2, Check, Camera, Package, Heart, Tag, LogOut, ShoppingBag } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import API from "../api/api";

export default function UserDashboard({ user, onClose, onLogout, onUpdateUser }) {
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.patch("/auth/profile", form);
      const updated = { ...user, ...res.data };
      localStorage.setItem("user", JSON.stringify(updated));
      onUpdateUser(updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const TABS = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders",  label: "My Orders",  icon: Package },
  ];

  const inp = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1px solid " + theme.colors.border,
    background: theme.colors.surface, color: theme.colors.text,
    fontSize: 14, outline: "none", fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, backdropFilter: "blur(4px)" }}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0,
              width: "min(420px, 100vw)", zIndex: 2100,
              background: theme.colors.background,
              display: "flex", flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div style={{ padding: "24px 24px 0", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#E50010", fontWeight: 700, marginBottom: 4 }}>My Account</p>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text, margin: 0 }}>Dashboard</h2>
                </div>
                <button onClick={onClose} style={{ padding: 8, color: theme.colors.text, background: "none", border: "none", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>

              {/* Avatar */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", background: theme.colors.surface, borderRadius: 16, marginBottom: 20, border: "1px solid " + theme.colors.border }}>
                <div style={{ position: "relative" }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #E50010" }} />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E50010", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "#fff", border: "3px solid #E50010" }}>
                      {initials}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: "50%", background: "#22c55e", border: "2px solid " + theme.colors.background }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: theme.colors.textSecondary, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: user.role === "admin" ? "#E3F2FD" : "#F3E5F5", color: user.role === "admin" ? "#0D47A1" : "#6A1B9A", padding: "2px 8px", borderRadius: 20 }}>
                    {user.role || "Member"}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: activeTab === tab.id ? "#E50010" : theme.colors.surface,
                    color: activeTab === tab.id ? "#fff" : theme.colors.textSecondary,
                    fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}>
                    <tab.icon size={14} /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
              {activeTab === "profile" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text, margin: 0 }}>Personal Information</p>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#E50010", background: "none", border: "1px solid #E50010", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>
                        <Edit2 size={12} /> Edit
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setEditing(false)} style={{ fontSize: 12, color: theme.colors.textSecondary, background: "none", border: "1px solid " + theme.colors.border, borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "#22c55e", border: "none", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>
                          <Check size={12} /> {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>

                  {saved && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#E8F5E9", color: "#2E7D32", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
                      Profile updated successfully!
                    </motion.div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.colors.textSecondary, display: "block", marginBottom: 6 }}>Full Name</label>
                      {editing ? (
                        <input style={inp} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                      ) : (
                        <p style={{ fontSize: 15, fontWeight: 500, color: theme.colors.text, margin: 0, padding: "10px 0", borderBottom: "1px solid " + theme.colors.border }}>{user.name}</p>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.colors.textSecondary, display: "block", marginBottom: 6 }}>Email Address</label>
                      <p style={{ fontSize: 15, fontWeight: 500, color: theme.colors.textSecondary, margin: 0, padding: "10px 0", borderBottom: "1px solid " + theme.colors.border }}>{user.email}
                        <span style={{ marginLeft: 8, fontSize: 10, background: "#E8F5E9", color: "#2E7D32", padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>Verified</span>
                      </p>
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.colors.textSecondary, display: "block", marginBottom: 6 }}>Phone Number</label>
                      {editing ? (
                        <input style={inp} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" type="tel" />
                      ) : (
                        <p style={{ fontSize: 15, fontWeight: 500, color: user.phone ? theme.colors.text : theme.colors.textSecondary, margin: 0, padding: "10px 0", borderBottom: "1px solid " + theme.colors.border }}>
                          {user.phone || "Not added yet"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.colors.textSecondary, display: "block", marginBottom: 6 }}>Member Since</label>
                      <p style={{ fontSize: 15, fontWeight: 500, color: theme.colors.text, margin: 0, padding: "10px 0", borderBottom: "1px solid " + theme.colors.border }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "2025"}
                      </p>
                    </div>
                  </div>

                  {/* Coupon reminder */}
                  <div style={{ marginTop: 24, background: "linear-gradient(135deg, #1a0a0a, #2a0a0a)", border: "1px dashed #E50010", borderRadius: 14, padding: "20px" }}>
                    <p style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E50010", fontWeight: 700, margin: "0 0 8px" }}>Your Welcome Gift</p>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: 4, fontFamily: "monospace" }}>WELCOME15</p>
                    <p style={{ fontSize: 12, color: "#888", margin: 0 }}>15% off on your first order</p>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <ShoppingBag size={48} color={theme.colors.border} style={{ margin: "0 auto 16px" }} />
                  <p style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text, marginBottom: 8 }}>View your orders</p>
                  <p style={{ fontSize: 13, color: theme.colors.textSecondary, marginBottom: 20 }}>Track and manage all your purchases</p>
                  <button onClick={() => { onClose(); }} style={{ background: "#E50010", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
                    Go to My Orders
                  </button>
                </div>
              )}
            </div>

            {/* Logout */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid " + theme.colors.border, flexShrink: 0 }}>
              <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px", borderRadius: 12, border: "1px solid #E50010", background: "none", color: "#E50010", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
