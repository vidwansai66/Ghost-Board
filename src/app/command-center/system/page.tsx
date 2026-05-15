"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Brain, CheckCircle, Cpu, RefreshCw, Settings, Shield, Sliders, Terminal, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const EXEC_PERMISSIONS = [
  { name: "CEO AI",          read: true, write: true,  execute: true,  override: true  },
  { name: "CTO AI",          read: true, write: true,  execute: true,  override: false },
  { name: "Marketing AI",    read: true, write: true,  execute: false, override: false },
  { name: "HR AI",           read: true, write: false, execute: false, override: false },
  { name: "Operations AI",   read: true, write: true,  execute: true,  override: false },
  { name: "Security AI",     read: true, write: true,  execute: true,  override: true  },
];

const PROTOCOLS = [
  { id: "AUTO_RECOVERY",      label: "Autonomous Recovery Mode",      active: true  },
  { id: "EXEC_OVERRIDE",      label: "Executive Override Protocol",    active: true  },
  { id: "CRISIS_ESCALATE",    label: "Crisis Auto-Escalation",         active: true  },
  { id: "SELF_HEALING_NET",   label: "Self-Healing Network",           active: true  },
  { id: "AI_DECISION_LOG",    label: "AI Decision Audit Log",          active: true  },
  { id: "EXTERNAL_COMMS",     label: "External Communication Feed",    active: false },
  { id: "MANUAL_OVERRIDE",    label: "Manual Human Override",          active: false },
  { id: "HARD_SHUTDOWN",      label: "Emergency Hard Shutdown",        active: false },
];

const SYSTEM_LOGS = [
  "NEURAL_SYNC: All 6 executive agents synchronized",
  "PROTOCOL_UPDATE: Auto-recovery v3.2 applied",
  "MEMORY_GC: Completed — 2.1 GB freed",
  "CONFIG_RELOAD: Protocol stack reloaded",
  "HEARTBEAT: All nodes responding within SLA",
  "AUDIT_LOG: 48,291 decisions logged this cycle",
];

export default function SystemCorePage() {
  const [protocols, setProtocols] = useState(PROTOCOLS);
  const [syncProgress, setSyncProgress] = useState(100);
  const [coreTemp, setCoreTemp] = useState(42);
  const [version] = useState("GHOST_CORE v4.0.2-alpha.7");
  const [logLines, setLogLines] = useState<string[]>(SYSTEM_LOGS);

  useEffect(() => {
    const t = setInterval(() => {
      setCoreTemp(v => Math.max(38, Math.min(55, v + (Math.random() * 2 - 1))));
      setSyncProgress(v => v > 100 ? 0 : v + Math.random() * 5);
      const newLog = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
      setLogLines(prev => [newLog, ...prev.slice(0, 9)]);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const toggleProtocol = (id: string) => {
    setProtocols(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="min-h-screen">
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter">
            GHOST_BOARD // <span className="text-emerald-500">SYS_CORE</span>
          </h1>
          <span className="text-[10px] font-mono text-emerald-500/60 tracking-widest uppercase">Autonomous Protocol & Configuration Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-gray-600">{version}</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500">CORE NOMINAL</span>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-[1800px] mx-auto">

        {/* Core Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "CORE TEMP", value: `${coreTemp.toFixed(1)}°C`, icon: Cpu, color: coreTemp > 50 ? "text-orange-500" : "text-emerald-500", status: coreTemp > 50 ? "WARN" : "OK" },
            { label: "NEURAL SYNC", value: `${Math.min(100, syncProgress).toFixed(0)}%`, icon: RefreshCw, color: "text-primary", status: "SYNCING" },
            { label: "ACTIVE PROTOCOLS", value: `${protocols.filter(p => p.active).length}/${protocols.length}`, icon: Shield, color: "text-secondary", status: "ACTIVE" },
            { label: "AUDIT EVENTS", value: "48,291", icon: Brain, color: "text-yellow-400", status: "LOGGED" },
          ].map((stat) => (
            <GlassCard key={stat.label} className="bg-black/60 border-white/10 flex items-center gap-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">{stat.label}</div>
                <div className={`text-[8px] font-bold mt-0.5 ${stat.color}`}>{stat.status}</div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* Protocol Toggles */}
          <GlassCard className="col-span-5 bg-black/60 border-emerald-500/10">
            <div className="flex items-center gap-2 mb-6">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Autonomous Protocol Controls</h3>
            </div>
            <div className="space-y-3">
              {protocols.map(proto => (
                <div key={proto.id} className="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-lg hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-center gap-3">
                    {proto.active
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <AlertTriangle className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                    <span className="text-[11px] font-mono text-gray-300">{proto.label}</span>
                  </div>
                  <button
                    onClick={() => toggleProtocol(proto.id)}
                    className={`relative w-10 h-5 rounded-full border transition-all duration-300 flex-shrink-0 ${
                      proto.active
                        ? 'bg-emerald-500/20 border-emerald-500/50'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <motion.div
                      animate={{ x: proto.active ? 20 : 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`absolute top-0.5 w-4 h-4 rounded-full ${proto.active ? 'bg-emerald-500' : 'bg-gray-600'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Right Column */}
          <div className="col-span-7 flex flex-col gap-6">

            {/* Executive Permission Matrix */}
            <GlassCard className="bg-black/60 border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Executive Permission Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-mono">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-gray-500 uppercase pb-2 font-bold">Agent</th>
                      {["READ", "WRITE", "EXECUTE", "OVERRIDE"].map(h => (
                        <th key={h} className="text-center text-gray-500 uppercase pb-2 font-bold px-2">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EXEC_PERMISSIONS.map((exec, i) => (
                      <motion.tr
                        key={exec.name}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors"
                      >
                        <td className="py-2 text-gray-300 font-bold">{exec.name}</td>
                        {[exec.read, exec.write, exec.execute, exec.override].map((perm, j) => (
                          <td key={j} className="text-center py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                              perm
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                : 'bg-gray-500/10 text-gray-600 border border-gray-500/10'
                            }`}>
                              {perm ? '✓ YES' : '✗ NO'}
                            </span>
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* System Diagnostic Log */}
            <GlassCard className="bg-black/60 border-emerald-500/10 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Diagnostic Terminal</h3>
              </div>
              <div className="bg-black/60 border border-white/5 rounded-lg p-4 font-mono text-[10px] space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar">
                <AnimatePresence initial={false}>
                  {logLines.map((line, i) => (
                    <motion.div
                      key={`${line}-${i}`}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3"
                    >
                      <span className="text-emerald-500">{'>'}</span>
                      <span className="text-gray-400">{line}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block w-2 h-3 bg-emerald-500 ml-5 align-middle"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
