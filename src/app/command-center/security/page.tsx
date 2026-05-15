"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Lock, Radio, Shield, ShieldAlert, ShieldCheck, Skull, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const EVENT_POOL = [
  { type: "INFO", message: "Firewall rule update applied — Policy_84_Alpha", src: "FW_CONTROLLER", color: "text-gray-400" },
  { type: "WARN", message: "Unusual login attempt blocked — IP: 185.220.101.x", src: "AUTH_GATE", color: "text-orange-500" },
  { type: "INFO", message: "TLS certificate rotated for API endpoint", src: "CERT_MGMT", color: "text-gray-400" },
  { type: "OK",   message: "Threat signature database updated — v4.8.2", src: "AV_ENGINE", color: "text-emerald-500" },
  { type: "WARN", message: "Port scan detected — source neutralized", src: "IDS_MODULE", color: "text-orange-500" },
  { type: "OK",   message: "Zero-trust policy validation passed", src: "TRUST_ENGINE", color: "text-emerald-500" },
  { type: "INFO", message: "AI agent auth token refreshed", src: "EXEC_LAYER", color: "text-gray-400" },
  { type: "OK",   message: "Encrypted channel re-keyed — 4096-bit", src: "CRYPTO_CORE", color: "text-emerald-500" },
  { type: "WARN", message: "Anomalous data exfil pattern detected and blocked", src: "DLP_SHIELD", color: "text-orange-500" },
  { type: "INFO", message: "Security sweep complete — sector 7 clear", src: "SCAN_ENGINE", color: "text-gray-400" },
];

const PROTOCOLS = [
  { name: "ZERO_TRUST_ENFORCEMENT",      active: true },
  { name: "QUANTUM_KEY_EXCHANGE",         active: true },
  { name: "ANOMALY_DETECTION_V3",         active: true },
  { name: "EXECUTIVE_COMPARTMENTALIZE",   active: true },
  { name: "EMERGENCY_LOCKDOWN",           active: false },
  { name: "EXFIL_PREVENTION",             active: true },
];

export default function SecurityPage() {
  const [threatLevel, setThreatLevel] = useState(2);
  const [integrity, setIntegrity] = useState(99.9);
  const [events, setEvents] = useState<Array<{ id: string; type: string; message: string; src: string; color: string; time: string }>>([]);
  const [breachAttempts, setBreachAttempts] = useState(1_847);

  useEffect(() => {
    // Seed initial events
    const initial = EVENT_POOL.slice(0, 5).map((e, i) => ({
      ...e,
      id: `init-${i}`,
      time: `${String(9 + i).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`
    }));
    setEvents(initial);

    const t = setInterval(() => {
      const pool = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const now = new Date();
      setEvents(prev => [
        { ...pool, id: Date.now().toString(), time: now.toLocaleTimeString('en-US', { hour12: false }) },
        ...prev.slice(0, 14),
      ]);
      setBreachAttempts(v => v + Math.floor(Math.random() * 3));
      setIntegrity(v => Math.max(99.5, Math.min(100, v + (Math.random() * 0.1 - 0.05))));
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const threatColors = ["text-emerald-500", "text-emerald-400", "text-yellow-400", "text-orange-400", "text-red-500"];
  const threatLabels = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "CRITICAL"];
  const threatBg = ["bg-emerald-500/10", "bg-emerald-400/10", "bg-yellow-400/10", "bg-orange-400/10", "bg-red-500/10"];
  const threatBorder = ["border-emerald-500/20", "border-emerald-400/20", "border-yellow-400/20", "border-orange-400/20", "border-red-500/20"];

  return (
    <div className="min-h-screen">
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter">
            GHOST_BOARD // <span className="text-destructive">SEC_CENTER</span>
          </h1>
          <span className="text-[10px] font-mono text-destructive/60 tracking-widest uppercase">Autonomous Cyber Defense & Threat Intelligence</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <Eye className="w-4 h-4 text-destructive animate-pulse" />
            <span className="text-gray-400">BREACH ATTEMPTS BLOCKED:</span>
            <span className="text-destructive font-black text-lg">{breachAttempts.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-[1800px] mx-auto">

        {/* Threat Overview Row */}
        <div className="grid grid-cols-12 gap-6">

          {/* Big Threat Level */}
          <GlassCard className={`col-span-4 ${threatBg[threatLevel]} border ${threatBorder[threatLevel]} relative overflow-hidden`}>
            <motion.div
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute inset-0 ${threatBg[threatLevel]} pointer-events-none`}
            />
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className={`w-4 h-4 ${threatColors[threatLevel]} animate-pulse`} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Threat Level</span>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className={`text-8xl font-black ${threatColors[threatLevel]} leading-none`}>
                0{threatLevel + 1}
              </div>
              <div className={`text-xl font-black mt-2 ${threatColors[threatLevel]}`}>
                {threatLabels[threatLevel]}
              </div>
              <div className="mt-4 flex gap-2">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className={`w-6 h-2 rounded-full ${i <= threatLevel ? threatBg[i].replace('/10', '/60') : 'bg-white/5'}`} />
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Security Stats */}
          <div className="col-span-4 grid grid-rows-2 gap-4">
            <GlassCard className="bg-black/60 border-white/10 flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
              <div>
                <div className="text-3xl font-black text-white">{integrity.toFixed(3)}%</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Security Integrity Score</div>
              </div>
            </GlassCard>
            <GlassCard className="bg-black/60 border-white/10 flex items-center gap-4">
              <Lock className="w-10 h-10 text-primary" />
              <div>
                <div className="text-3xl font-black text-white">4,096-bit</div>
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Active Encryption Grade</div>
              </div>
            </GlassCard>
          </div>

          {/* Protocol Status */}
          <GlassCard className="col-span-4 bg-black/60 border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-4 h-4 text-primary" />
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Security Protocols</h3>
            </div>
            <div className="space-y-3">
              {PROTOCOLS.map(proto => (
                <div key={proto.name} className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-400">{proto.name}</span>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold ${
                    proto.active
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${proto.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                    {proto.active ? 'ACTIVE' : 'STANDBY'}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Live Event Log */}
        <GlassCard className="bg-black/60 border-destructive/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-destructive" />
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Security Event Timeline</h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-destructive rounded-full" />
              <span className="text-[9px] font-mono text-gray-500">REAL-TIME FEED</span>
            </div>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            <AnimatePresence initial={false}>
              {events.map(ev => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 p-2 bg-white/3 border border-white/5 rounded font-mono text-[10px]"
                >
                  <span className="text-gray-600 flex-shrink-0">{ev.time}</span>
                  <span className={`flex-shrink-0 font-black w-10 ${ev.color}`}>{ev.type}</span>
                  <span className="text-gray-400 flex-1">{ev.message}</span>
                  <span className="text-gray-600 flex-shrink-0">[{ev.src}]</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
