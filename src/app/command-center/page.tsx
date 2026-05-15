"use client";

import { ExecutiveCard } from "@/components/dashboard/executive-card";
import { CollabPanel } from "@/components/dashboard/collab-panel";
import { CrisisMonitor } from "@/components/dashboard/crisis-monitor";
import { WorkflowVisualizer } from "@/components/dashboard/workflow-visualizer";
import { IntelligenceReport } from "@/components/dashboard/intelligence-report";
import { CrisisOrchestrationPanel } from "@/components/dashboard/crisis-orchestration-panel";
import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BarChart3, Building2, Cpu, Globe2, Radio, Shield, TrendingUp, Wifi, Zap } from "lucide-react";
import { useSystemMetrics } from "@/hooks/use-system-metrics";
import { ENTERPRISE_CONFIG, CONNECTED_SYSTEMS } from "@/constants/enterprise";
import { ConnectedSystemsPanel } from "@/components/dashboard/connected-systems-panel";

const EXECUTIVES = [
  { name: "CEO AI",        role: "Chief Executive", image: "/ceo_ai.png",        color: "white",  objective: "Maximize long-term enterprise value through autonomous orchestration." },
  { name: "CTO AI",        role: "Technical Ops",   image: "/cto_ai.png",        color: "cyan",   objective: "Scaling neural infrastructure across multi-cloud edge nodes." },
  { name: "Marketing AI",  role: "Growth & Brand",  image: "/marketing_ai.png",  color: "violet", objective: "Optimizing global sentiment through holographic engagement." },
  { name: "HR AI",         role: "Resource MGMT",   image: "/hr_ai.png",         color: "green",  objective: "Balancing agent performance and neural load distribution." },
  { name: "Operations AI", role: "Supply Chain",    image: "/operations_ai.png", color: "orange", objective: "Synchronizing autonomous logistics with real-time demand." },
  { name: "Security AI",   role: "Cyber Defense",   image: "/security_ai.png",   color: "red",    objective: "Maintaining absolute zero-trust integrity across all sectors." },
];

export default function CommandCenter() {
  const { data: metrics, source } = useSystemMetrics();

  // Derive display values from API data (fallback to safe defaults while loading)
  const systemLoad      = metrics?.systemLoad      ?? 28.4;
  const netLatency      = metrics?.netLatency      ?? 14;
  const secIntegrity    = metrics?.secIntegrity    ?? 99.9;
  const activeWorkflows = metrics?.activeWorkflows ?? 1248;
  const aiProcLoad      = metrics?.aiProcLoad      ?? 82.1;
  const globalSync      = metrics?.globalSync      ?? 99.8;
  const dataThru        = metrics?.dataThroughput  ?? 1.2;
  const latestEvent     = metrics?.latestSystemEvent ?? "NEURAL_SYNC_COMPLETE";
  const uptimeSecs      = metrics?.uptimeSeconds   ?? (1482 * 3600 + 12 * 60 + 4);

  const uptimeH = Math.floor(uptimeSecs / 3600);
  const uptimeM = Math.floor((uptimeSecs % 3600) / 60);
  const uptimeS = uptimeSecs % 60;
  const uptimeStr = `${String(uptimeH).padStart(4,'0')}:${String(uptimeM).padStart(2,'0')}:${String(uptimeS).padStart(2,'0')}`;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-10 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)]">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-xl font-black tracking-tighter text-white">{ENTERPRISE_CONFIG.companyName.toUpperCase()}</h1>
                <span className="hidden sm:inline text-[8px] font-black px-1.5 py-0.5 bg-primary/10 border border-primary/30 text-primary rounded tracking-widest">ENTERPRISE</span>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <Globe2 className="w-2.5 h-2.5" /> {ENTERPRISE_CONFIG.industry} // {ENTERPRISE_CONFIG.headquarters}
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block h-8 w-px bg-white/10 mx-2" />

          <div className="hidden xl:flex flex-col">
            <h1 className="text-[10px] font-black tracking-[0.2em] text-gray-400">GHOST_BOARD // OS</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[9px] font-mono text-primary/60 tracking-widest uppercase">System v4.0.2</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={latestEvent}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[8px] font-mono text-emerald-500 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded"
                >
                  › {latestEvent}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-8">
          <div className="hidden sm:flex gap-4 sm:gap-6 items-center">
            <LiveStatItem label="SYSTEM_LOAD" value={`${systemLoad.toFixed(1)}%`}
              color={systemLoad > 70 ? "text-destructive" : "text-gray-300"} />
            <LiveStatItem label="NET_LATENCY" value={`${netLatency.toFixed(0)}ms`}
              color={netLatency > 50 ? "text-orange-500" : "text-gray-300"} />
            <LiveStatItem label="SEC_INTEGRITY" value={`${secIntegrity.toFixed(1)}%`}
              color="text-emerald-500" className="hidden md:flex" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4 border-l border-white/10 pl-3 sm:pl-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold">LINK</span>
              <span className="text-[8px] font-mono text-emerald-500 animate-pulse uppercase">ENCRYPTED</span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary/50 p-1 relative">
              <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-primary/30"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (70% - col-span-8) */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
            
            {/* SECTION 1: Crisis Controls & Main Output */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <CrisisOrchestrationPanel />
            </motion.div>

            {/* SECTION 2: AI Executive Board (3-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {EXECUTIVES.map((exec, i) => (
                <motion.div
                  key={exec.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ExecutiveCard {...exec as any} />
                </motion.div>
              ))}
            </div>

            {/* SECTION 3: Connected Systems (Dense Horizontal Strip) */}
            <ConnectedSystemsPanel />
          </div>

          {/* RIGHT COLUMN (30% - col-span-4) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 order-1 lg:order-2">
            {/* 1. Live Executive Feed */}
            <div className="min-h-[420px] lg:h-[calc(100vh-16rem)] sticky top-24">
              <CollabPanel />
            </div>

            {/* 2. System Overview & Metrics */}
            <CrisisMonitor />

            {/* 3. Workflow Engine */}
            <WorkflowVisualizer />

            {/* 4. Intelligence Report */}
            <IntelligenceReport />
          </div>
        </div>
      </main>

      {/* Live Footer */}
      <footer className="p-6 sm:p-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-gray-600 font-mono text-[10px] gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-10">
          <span className="hidden sm:inline">COORD_LAT: 35.6895° N, 139.6917° E</span>
          <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1, repeat: Infinity }}>
            SYSTEM_UPTIME: {uptimeStr}
          </motion.span>
          <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} className="hidden sm:inline">
            DATA_THROUGHPUT: {dataThru.toFixed(1)} PB/S
          </motion.span>
        </div>
        <div className="flex items-center gap-3">
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <Radio className="w-3 h-3 text-emerald-500" />
          </motion.div>
          <span className="text-emerald-600 text-center md:text-right uppercase tracking-widest">GHOST_CORE_NEURAL_PROCESSING_ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}

function LiveStatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[9px] font-bold text-gray-500 tracking-tighter uppercase">{label}</span>
      <motion.span
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`text-sm font-black ${color}`}
      >
        {value}
      </motion.span>
    </div>
  );
}

function LiveInfraMetric({ label, value, unit, sub, subColor, color, icon }: {
  label: string; value: string; unit?: string; sub: string; subColor: string; color: string; icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`flex items-center gap-1.5 ${color} opacity-60`}>{icon}</div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">{label}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className={`text-3xl font-black ${color} glow-text`}
        >
          {value}{unit && <span className="text-lg ml-1 opacity-70">{unit}</span>}
        </motion.div>
      </AnimatePresence>
      <div className={`text-[9px] font-mono ${subColor}`}>{sub}</div>
    </div>
  );
}
