"use client";

import { ExecutiveCard } from "@/components/dashboard/executive-card";
import { CollabPanel } from "@/components/dashboard/collab-panel";
import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Crown, Layers, MessageSquare, Network, Users, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const EXECUTIVES = [
  { name: "CEO AI", role: "Chief Executive", image: "/ceo_ai.png", color: "white", objective: "Maximize long-term enterprise value through autonomous orchestration.", rank: 1, reports: 5, activeWorkflows: 24 },
  { name: "CTO AI", role: "Technical Ops", image: "/cto_ai.png", color: "cyan", objective: "Scaling neural infrastructure across multi-cloud edge nodes.", rank: 2, reports: 3, activeWorkflows: 47 },
  { name: "Marketing AI", role: "Growth & Brand", image: "/marketing_ai.png", color: "violet", objective: "Optimizing global sentiment through holographic engagement.", rank: 3, reports: 2, activeWorkflows: 31 },
  { name: "HR AI", role: "Resource MGMT", image: "/hr_ai.png", color: "green", objective: "Balancing agent performance and neural load distribution.", rank: 4, reports: 2, activeWorkflows: 18 },
  { name: "Operations AI", role: "Supply Chain", image: "/operations_ai.png", color: "orange", objective: "Synchronizing autonomous logistics with real-time demand.", rank: 5, reports: 4, activeWorkflows: 62 },
  { name: "Security AI", role: "Cyber Defense", image: "/security_ai.png", color: "red", objective: "Maintaining absolute zero-trust integrity across all sectors.", rank: 6, reports: 1, activeWorkflows: 15 },
];

const HIERARCHY_LINKS = [
  { from: "CEO AI", to: "CTO AI" },
  { from: "CEO AI", to: "Marketing AI" },
  { from: "CEO AI", to: "HR AI" },
  { from: "CEO AI", to: "Operations AI" },
  { from: "CEO AI", to: "Security AI" },
];

export default function ExecutivesPage() {
  const [selectedExec, setSelectedExec] = useState<string | null>(null);
  const [commsCount, setCommsCount] = useState(142);

  useEffect(() => {
    const t = setInterval(() => setCommsCount(c => c + Math.floor(Math.random() * 3)), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter">
            GHOST_BOARD // <span className="text-secondary">EXEC_BOARD</span>
          </h1>
          <span className="text-[10px] font-mono text-secondary/60 tracking-widest uppercase">Autonomous Executive Intelligence Matrix</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-500 font-mono uppercase">Total AI-to-AI Comms Today</span>
            <span className="text-lg font-black text-secondary">{commsCount.toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded text-[10px] font-mono text-secondary animate-pulse">
            ALL EXECUTIVES ONLINE
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-[1800px] mx-auto">

        {/* AI Hierarchy Banner */}
        <GlassCard className="bg-black/60 border-secondary/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-secondary" />
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Executive Hierarchy & Command Chain</h2>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* CEO at top */}
            <div className="flex flex-col items-center">
              <div className="px-4 py-2 bg-white/10 border border-white/30 rounded text-xs font-black text-white glow-text">CEO AI</div>
              <div className="w-px h-6 bg-white/20 mt-1" />
            </div>
            <div className="flex items-end gap-8 mt-2">
              {EXECUTIVES.slice(1).map((exec, i) => (
                <div key={exec.name} className="flex flex-col items-center">
                  <div className="w-px h-6 bg-white/10" />
                  <div className={`px-3 py-1.5 border rounded text-[9px] font-bold whitespace-nowrap ${
                    exec.color === 'cyan' ? 'border-primary/40 text-primary bg-primary/5' :
                    exec.color === 'violet' ? 'border-secondary/40 text-secondary bg-secondary/5' :
                    exec.color === 'green' ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/5' :
                    exec.color === 'orange' ? 'border-orange-500/40 text-orange-500 bg-orange-500/5' :
                    'border-destructive/40 text-destructive bg-destructive/5'
                  }`}>
                    {exec.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "TOTAL ACTIVE WORKFLOWS", value: "197", icon: Zap, color: "text-primary" },
            { label: "AI-TO-AI CHANNELS", value: "15", icon: Network, color: "text-secondary" },
            { label: "DECISIONS / MINUTE", value: "2,840", icon: Brain, color: "text-accent" },
            { label: "EXECUTIVE AGENTS", value: "6/6", icon: Users, color: "text-emerald-500" },
          ].map((stat) => (
            <GlassCard key={stat.label} className="bg-black/60 border-white/10 p-4 flex items-center gap-4">
              <stat.icon className={`w-8 h-8 ${stat.color} flex-shrink-0`} />
              <div>
                <div className="text-2xl font-black">{stat.value}</div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Executive Cards Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-secondary" />
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Full Executive Profile Matrix</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {EXECUTIVES.map((exec, i) => (
              <motion.div
                key={exec.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ExecutiveCard {...exec as any} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Communication Feed */}
        <div className="h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-secondary" />
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Live Executive Communication Feed</h2>
          </div>
          <CollabPanel />
        </div>

      </div>
    </div>
  );
}
