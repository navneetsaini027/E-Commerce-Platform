import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2, CheckCircle, Lock, Copy } from "lucide-react";
import BRAND from "../config/brand";

const UPI_ID = "nickeysaini02@okaxis";

export default function PaymentPage({ order, onClose, onSuccess }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!order) return null;
  const amount = order.totalAmount;
  const txnNote = "Order-" + order._id.slice(-8).toUpperCase();

  const handleUpiAppPay = (app) => {
    const links = {
      gpay: "tez://upi/pay?pa=" + UPI_ID + "&am=" + amount + "&tn=" + txnNote + "&cu=INR",
      phonepe: "phonepe://pay?pa=" + UPI_ID + "&am=" + amount + "&tn=" + txnNote + "&cu=INR",
      paytm: "paytmmp://pay?pa=" + UPI_ID + "&am=" + amount + "&tn=" + txnNote + "&cu=INR",
      bhim: "upi://pay?pa=" + UPI_ID + "&am=" + amount + "&tn=" + txnNote + "&cu=INR",
    };
    window.location.href = links[app];
    setTimeout(() => {
      setProcessing(true);
      setTimeout(() => { setProcessing(false); setDone(true); setTimeout(() => { onSuccess(order); onClose(); }, 3000); }, 3000);
    }, 1500);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = async () => {
    setError("");
    if (method === "upi" && !upiId.includes("@")) { setError("Enter a valid UPI ID"); return; }
    if (method === "card" && (card.number.replace(/\s/g,"").length < 16 || !card.name || !card.expiry || card.cvv.length < 3)) { setError("Fill all card details"); return; }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    setProcessing(false);
    setDone(true);
    setTimeout(() => { onSuccess(order); onClose(); }, 3000);
  };

  const formatCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };
  const inp = { width:"100%", padding:"12px 14px", border:"1px solid #e0e0e0", borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box", background:"#fafafa" };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ width:"min(480px, 100%)", background:"#fff", borderRadius:20, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.5)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ background:"#0a0a0a", padding:"24px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:9, letterSpacing:"0.3em", color:"#E50010", textTransform:"uppercase", fontWeight:700, margin:"0 0 4px" }}>Secure Payment</p>
            <h2 style={{ fontSize:18, fontWeight:900, color:"#fff", margin:0 }}>{BRAND.name}</h2>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:11, color:"#666", margin:"0 0 2px" }}>Amount Due</p>
            <p style={{ fontSize:22, fontWeight:900, color:"#E50010", margin:0 }}>Rs.{amount.toLocaleString()}</p>
          </div>
        </div>

        {done ? (
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} style={{ padding:"48px 28px", textAlign:"center" }}>
            <CheckCircle size={72} color="#22c55e" style={{ margin:"0 auto 20px" }} />
            <h3 style={{ fontSize:24, fontWeight:800, color:"#000", marginBottom:8 }}>Payment Successful!</h3>
            <p style={{ fontSize:14, color:"#666" }}>Rs.{amount.toLocaleString()} paid</p>
          </motion.div>
        ) : (
          <div style={{ padding:"24px 28px" }}>
            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {[{id:"upi",label:"UPI",Icon:Smartphone},{id:"card",label:"Card",Icon:CreditCard},{id:"netbanking",label:"Net Banking",Icon:Building2}].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{ flex:1, padding:"10px 8px", borderRadius:12, border:"2px solid "+(method===m.id?"#E50010":"#e0e0e0"), background:method===m.id?"#fff5f5":"#fff", color:method===m.id?"#E50010":"#555", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <m.Icon size={18} />{m.label}
                </button>
              ))}
            </div>

            {method === "upi" && (
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"#555", marginBottom:14 }}>Pay with UPI App</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  {[{id:"gpay",label:"Google Pay",color:"#4285F4"},{id:"phonepe",label:"PhonePe",color:"#5F259F"},{id:"paytm",label:"Paytm",color:"#00BAF2"},{id:"bhim",label:"BHIM UPI",color:"#FF6B00"}].map(app => (
                    <button key={app.id} onClick={() => handleUpiAppPay(app.id)}
                      style={{ padding:"14px 10px", border:"2px solid "+app.color+"33", borderRadius:12, background:app.color+"11", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:app.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:14 }}>{app.label[0]}</div>
                      <span style={{ fontSize:12, fontWeight:700, color:app.color }}>{app.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ background:"#f8f8f8", borderRadius:12, padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, border:"1px solid #e0e0e0" }}>
                  <div>
                    <p style={{ fontSize:11, color:"#999", margin:"0 0 2px" }}>UPI ID</p>
                    <p style={{ fontSize:15, fontWeight:700, color:"#000", margin:0, fontFamily:"monospace" }}>{UPI_ID}</p>
                  </div>
                  <button onClick={handleCopyUpi} style={{ background:copied?"#22c55e":"#E50010", color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                    <Copy size={13} />{copied?"Copied!":"Copy"}
                  </button>
                </div>
                <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8 }}>Or enter UPI ID manually</label>
                <input style={inp} value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" />
              </div>
            )}

            {method === "card" && (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div><label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:6 }}>Card Number</label>
                  <input style={inp} value={card.number} onChange={e => setCard(p=>({...p,number:formatCard(e.target.value)}))} placeholder="1234 5678 9012 3456" maxLength={19} /></div>
                <div><label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:6 }}>Cardholder Name</label>
                  <input style={inp} value={card.name} onChange={e => setCard(p=>({...p,name:e.target.value}))} placeholder="Name on card" /></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:6 }}>Expiry</label>
                    <input style={inp} value={card.expiry} onChange={e => setCard(p=>({...p,expiry:formatExpiry(e.target.value)}))} placeholder="MM/YY" maxLength={5} /></div>
                  <div><label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:6 }}>CVV</label>
                    <input style={inp} value={card.cvv} onChange={e => setCard(p=>({...p,cvv:e.target.value.replace(/\D/g,"").slice(0,3)}))} placeholder="..." maxLength={3} type="password" /></div>
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {["SBI","HDFC","ICICI","Axis","Kotak","PNB"].map(bank => (
                  <button key={bank} onClick={handlePay} style={{ padding:"14px", border:"1px solid #e0e0e0", borderRadius:12, background:"#fafafa", fontSize:13, fontWeight:600, cursor:"pointer", color:"#333" }}>{bank} Bank</button>
                ))}
              </div>
            )}

            {error && <p style={{ fontSize:12, color:"#E50010", marginTop:12, textAlign:"center" }}>{error}</p>}

            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button onClick={onClose} style={{ flex:1, padding:"13px", border:"1px solid #e0e0e0", background:"#fff", borderRadius:12, fontSize:13, fontWeight:600, cursor:"pointer", color:"#555" }}>Cancel</button>
              {(method !== "upi" || upiId) && (
                <button onClick={handlePay} disabled={processing} style={{ flex:2, padding:"13px", border:"none", background:processing?"#999":"#E50010", color:"#fff", borderRadius:12, fontSize:13, fontWeight:700, cursor:processing?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <Lock size={14} />{processing?"Processing...":"Pay Rs."+amount.toLocaleString()}
                </button>
              )}
            </div>
            <p style={{ textAlign:"center", fontSize:11, color:"#aaa", marginTop:14, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
              <Lock size={11} /> 256-bit SSL Secured
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
