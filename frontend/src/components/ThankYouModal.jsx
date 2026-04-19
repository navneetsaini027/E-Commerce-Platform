import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({ id: i, x: Math.random() * 100, delay: Math.random() * 0.5 }));

export default function ThankYouModal({ show, onDone }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ position: "fixed", inset: 0, zIndex: 9998, background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
        >
          {/* Particles */}
          {PARTICLES.map(p => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: [0, 0.8, 0], y: -200 }}
              transition={{ delay: p.delay, duration: 2, ease: "easeOut" }}
              style={{ position: "absolute", left: p.x + "%", bottom: "10%", width: 4, height: 4, borderRadius: "50%", background: "#E50010" }}
            />
          ))}

          {/* Glow */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #E50010, transparent 70%)", filter: "blur(60px)" }}
          />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px" }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: 11, letterSpacing: "0.4em", color: "#E50010", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}
            >
              See You Soon
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: "clamp(36px, 8vw, 80px)", fontWeight: 900, color: "#fff", margin: "0 0 8px", fontFamily: '"Cinzel Decorative", serif', lineHeight: 1.1 }}
            >
              Thank You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(255,255,255,0.5)", fontWeight: 300, letterSpacing: "0.15em", marginBottom: 32 }}
            >
              for shopping with Aashirwad Fashion
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ height: 1, background: "linear-gradient(to right, transparent, #E50010, transparent)", transformOrigin: "center", maxWidth: 300, margin: "0 auto" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 24, letterSpacing: "0.2em", textTransform: "uppercase" }}
            >
              Come back soon
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
