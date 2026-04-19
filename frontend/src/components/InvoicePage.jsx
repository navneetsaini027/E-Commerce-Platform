import { motion, AnimatePresence } from "framer-motion";
import { X, Download, CreditCard, MapPin, Package, CheckCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import BRAND from "../config/brand";

const STATUS_COLORS = {
  pending:    { bg: "#FFF3E0", text: "#E65100" },
  processing: { bg: "#E3F2FD", text: "#0D47A1" },
  shipped:    { bg: "#F3E5F5", text: "#4A148C" },
  delivered:  { bg: "#E8F5E9", text: "#1B5E20" },
  cancelled:  { bg: "#FFEBEE", text: "#B71C1C" },
};

export default function InvoicePage({ order, onClose, onPayNow }) {
  const { theme } = useTheme();
  if (!order) return null;

  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = order.totalAmount - subtotal > 0 && order.totalAmount - subtotal < 200 ? order.totalAmount - subtotal : 0;

  const handlePrint = () => window.print();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2500, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.3 }}
        style={{ width: "min(680px, 100%)", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 4, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
      >
        {/* Invoice Header */}
        <div style={{ background: "#0a0a0a", padding: "32px 40px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
            <X size={16} />
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.3em", color: "#E50010", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Tax Invoice</p>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 4px", fontFamily: '"Cinzel Decorative", serif', letterSpacing: 1 }}>{BRAND.shortName}</h1>
              <p style={{ fontSize: 13, color: "#aaa", margin: 0, letterSpacing: 4 }}>FASHION</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>Invoice No.</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "monospace", letterSpacing: 1 }}>INV-{order._id.slice(-8).toUpperCase()}</p>
              <p style={{ fontSize: 11, color: "#666", marginTop: 8 }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>
          <div style={{ height: 2, background: "linear-gradient(to right, #E50010, #FF6B6B, transparent)", marginTop: 24 }} />
        </div>

        <div style={{ padding: "32px 40px" }}>
          {/* Status + Addresses */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Bill To</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 4 }}>{order.user?.name || "Customer"}</p>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                {order.shippingAddress?.address}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                PIN: {order.shippingAddress?.pincode}<br />
                Ph: {order.shippingAddress?.phone}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Order Status</p>
              <span style={{ background: sc.bg, color: sc.text, padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
                {order.status}
              </span>
              <p style={{ fontSize: 12, color: "#999", marginTop: 12 }}>Payment: <strong style={{ color: "#000", textTransform: "uppercase" }}>{order.paymentMethod}</strong></p>
              <p style={{ fontSize: 12, color: order.isPaid ? "#22c55e" : "#E65100", fontWeight: 700, marginTop: 4 }}>
                {order.isPaid ? "✓ Paid" : "⏳ Payment Pending"}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
            <thead>
              <tr style={{ background: "#f8f8f8", borderBottom: "2px solid #eee" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>Item</th>
                <th style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>Qty</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>Price</th>
                <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {item.product?.image && <img src={item.product.image} alt="" style={{ width: 44, height: 56, objectFit: "cover", background: "#f5f5f5" }} />}
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#000", margin: "0 0 2px" }}>{item.product?.name || "Product"}</p>
                        <p style={{ fontSize: 11, color: "#999", margin: 0 }}>{item.product?.category}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 12px", textAlign: "center", fontSize: 13, color: "#555" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontSize: 13, color: "#555" }}>Rs.{item.price.toLocaleString()}</td>
                  <td style={{ padding: "14px 12px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#000" }}>Rs.{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 260 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 }}>
                <span>Subtotal</span><span>Rs.{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 8 }}>
                <span>Shipping</span><span>{shipping === 0 ? "FREE" : "Rs." + shipping}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#22c55e", marginBottom: 8 }}>
                  <span>Discount</span><span>-Rs.{order.discount}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: "#000", paddingTop: 12, borderTop: "2px solid #000", marginTop: 8 }}>
                <span>Total</span><span>Rs.{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 24, borderTop: "1px solid #eee" }}>
            <button onClick={handlePrint} style={{ flex: 1, padding: "12px", border: "1px solid #000", background: "#fff", color: "#000", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Download size={14} /> Download Invoice
            </button>
            {!order.isPaid && order.status !== "cancelled" && (
              <button onClick={() => onPayNow(order)} style={{ flex: 2, padding: "12px", border: "none", background: "#E50010", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <CreditCard size={14} /> Pay Now — Rs.{order.totalAmount.toLocaleString()}
              </button>
            )}
            {order.isPaid && (
              <div style={{ flex: 2, padding: "12px", background: "#E8F5E9", color: "#1B5E20", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <CheckCircle size={14} /> Payment Complete
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 32, textAlign: "center", paddingTop: 20, borderTop: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 12, color: "#999" }}>Thank you for shopping with Aashirwad Fashion</p>
            <p style={{ fontSize: 11, color: "#ccc", marginTop: 4 }}>support@aashirwadfashion.com · +91 98765 43210</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
