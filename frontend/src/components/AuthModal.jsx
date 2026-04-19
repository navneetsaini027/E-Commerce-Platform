import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, CheckCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { login, register, googleLogin } from "../api/api";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [welcome, setWelcome] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const showWelcomeMsg = (userData, isNew) => {
    setWelcome({ name: userData.name, isNew });
    setTimeout(() => { setWelcome(null); onClose(); }, 2800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = mode === "login"
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      setForm({ name: "", email: "", password: "" });
      showWelcomeMsg(res.data.user, mode === "register");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setGoogleLoading(true);
    setError("");
    try {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: "Bearer " + tokenResponse.access_token },
      });
      const userInfo = await userInfoRes.json();
      const credential = userInfo.sub + "|" + userInfo.email + "|" + userInfo.name + "|" + (userInfo.picture || "");
      const res = await googleLogin(credential);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuthSuccess(res.data.user);
      showWelcomeMsg(res.data.user, res.data.isNew);
    } catch (err) {
      setError("Google login failed. Please try email login.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLoginHook = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google login was cancelled or failed."),
  });

  const switchMode = () => {
    setMode(prev => prev === "login" ? "register" : "login");
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  const INPUT = {
    width: "100%", border: "none", borderBottom: "1px solid #d0d0d0",
    padding: "10px 0", fontSize: 14, outline: "none", background: "transparent",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1300, backdropFilter: "blur(3px)" }}
          />

          <AnimatePresence>
            {welcome && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
                <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", duration: 0.5 }}
                  style={{ background: "#fff", borderRadius: 20, padding: "48px 52px", textAlign: "center", maxWidth: 380, boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} style={{ marginBottom: 20 }}>
                    <CheckCircle size={60} color="#22c55e" style={{ margin: "0 auto" }} />
                  </motion.div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: "#000", marginBottom: 6 }}>
                    {welcome.isNew ? "Welcome to" : "Welcome back,"}
                  </h2>
                  {welcome.isNew && (
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#E50010", marginBottom: 6, fontFamily: '"Cinzel Decorative", serif' }}>
                      Aashirwad Fashion
                    </p>
                  )}
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#333", marginBottom: 12 }}>
                    {welcome.name.split(" ")[0]}!
                  </p>
                  <p style={{ fontSize: 13, color: "#767676", lineHeight: 1.6 }}>
                    {welcome.isNew ? "Your account is ready. Enjoy exclusive member prices!" : "Great to see you again. Happy shopping!"}
                  </p>
                  {welcome.isNew && (
                    <div style={{ marginTop: 16, background: "#fff8f0", border: "1px solid #ffd700", borderRadius: 10, padding: "10px 16px" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#E65100" }}>Use code WELCOME15 for 15% off your first order!</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{
            position: "fixed", inset: 0, zIndex: 1400,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px", pointerEvents: "none",
          }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              background: "#fff", width: "min(420px, 100%)", padding: "40px 36px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              maxHeight: "90vh", overflowY: "auto",
              pointerEvents: "all", position: "relative",
            }}
          >
            <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, padding: 8 }}>
              <X size={18} />
            </button>

            <div style={{ marginBottom: 28, textAlign: "center" }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p style={{ fontSize: 13, color: "#767676", marginTop: 6 }}>
                {mode === "login" ? "Sign in to continue shopping" : "Join Aashirwad Fashion today"}
              </p>
            </div>

            <button type="button" onClick={() => googleLoginHook()} disabled={googleLoading}
              style={{ width: "100%", padding: "12px", fontSize: 13, fontWeight: 600, border: "1px solid #d0d0d0", background: googleLoading ? "#f5f5f5" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: googleLoading ? "not-allowed" : "pointer", marginBottom: 16, borderRadius: 4, transition: "border-color 0.2s" }}
              onMouseEnter={e => { if (!googleLoading) e.currentTarget.style.borderColor = "#4285F4"; }}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#d0d0d0"}
            >
              {googleLoading ? "Signing in..." : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
              <span style={{ padding: "0 14px", fontSize: 11, color: "#767676", textTransform: "uppercase", letterSpacing: "0.08em" }}>Or</span>
              <div style={{ flex: 1, height: 1, background: "#e0e0e0" }} />
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "register" && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#767676" }}>Full Name</label>
                  <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Your name" required style={INPUT} />
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#767676" }}>Email</label>
                <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="your@email.com" required style={INPUT} />
              </div>
              <div style={{ marginBottom: 28, position: "relative" }}>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#767676" }}>Password</label>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => handleChange("password", e.target.value)} placeholder="••••••••" required style={{ ...INPUT, paddingRight: 32 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 0, bottom: 10, color: "#767676" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && <p style={{ fontSize: 12, color: "#E50010", marginBottom: 16, textAlign: "center" }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#767676" : "#000", color: "#fff", padding: "14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none" }}>
                <Mail size={14} />
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#767676" }}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={switchMode} style={{ fontWeight: 700, color: "#000", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
