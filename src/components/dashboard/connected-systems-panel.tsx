"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { CONNECTED_SYSTEMS } from "@/constants/enterprise";
import { Link2, Network } from "lucide-react";

export function ConnectedSystemsPanel() {
  return (
    <GlassCard className="p-4 bg-black/60 border-primary/20 overflow-hidden" glowColor="cyan">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold tracking-widest uppercase text-white">Connected Systems</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] font-mono text-emerald-500">ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {CONNECTED_SYSTEMS.map((system, i) => (
          <motion.div
            key={system.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-2 rounded-lg border border-white/5 bg-white/3 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{system.icon}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-300 tracking-tight">{system.name}</span>
                <span className="text-[8px] font-mono text-gray-600 uppercase">{system.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-mono text-gray-700 uppercase">Latency</span>
                <span className="text-[9px] font-mono text-emerald-500/70">{system.latency}</span>
              </div>
              <Link2 className="w-3 h-3 text-gray-700 group-hover:text-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Infrastructure Metadata */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-gray-700 uppercase tracking-widest">
        <span>Region: SG-SOUTH-1</span>
        <span>Provider: AWS_K8S</span>
      </div>
    </GlassCard>
  );
}
