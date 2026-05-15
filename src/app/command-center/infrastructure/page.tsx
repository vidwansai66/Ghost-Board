"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Activity, Cpu, Database, Globe, HardDrive, Network, Server, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const REGIONS = [
  { name: "US_EAST_01", location: "New York", load: 62, latency: 8, status: "NOMINAL" },
  { name: "EU_WEST_02", location: "Frankfurt", load: 78, latency: 12, status: "NOMINAL" },
  { name: "APAC_01", location: "Tokyo", load: 45, latency: 22, status: "NOMINAL" },
  { name: "US_WEST_03", location: "San Jose", load: 33, latency: 6, status: "NOMINAL" },
  { name: "SA_01", location: "São Paulo", load: 19, latency: 41, status: "STANDBY" },
  { name: "AU_01", location: "Sydney", load: 55, latency: 28, status: "NOMINAL" },
];

function useAnimatedValue(base: number, variance: number, ms: number) {
  const [val, setVal] = useState(base);
  useEffect(() => {
    const t = setInterval(() => setVal(Math.min(100, Math.max(0, base + (Math.random() * variance * 2 - variance)))), ms);
    return () => clearInterval(t);
  }, [base, variance, ms]);
  return val;
}

export default function InfrastructurePage() {
  const cpuLoad = useAnimatedValue(42, 8, 2000);
  const memLoad = useAnimatedValue(67, 5, 2500);
  const netBw = useAnimatedValue(74, 10, 1800);
  const diskIo = useAnimatedValue(31, 12, 3000);
  const [throughput, setThroughput] = useState(1.24);
  const [activeConns, setActiveConns] = useState(8_421);

  useEffect(() => {
    const t = setInterval(() => {
      setThroughput(v => Math.max(0.8, Math.min(2.0, v + (Math.random() * 0.1 - 0.05))));
      setActiveConns(v => Math.max(8000, Math.min(9000, v + Math.floor(Math.random() * 40 - 20))));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen">
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 sm:px-10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-xl font-black tracking-tighter">
            GHOST_BOARD // <span className="text-accent">LIVE_INFRA</span>
          </h1>
          <span className="text-[10px] font-mono text-accent/60 tracking-widest uppercase">Neural Infrastructure Monitoring System</span>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded hidden sm:flex"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">NOMINAL</span>
          </motion.div>
        </div>
      </header>

      <div className="p-4 sm:p-8 space-y-8 max-w-[1800px] mx-auto overflow-x-hidden">

        {/* Core Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "CPU LOAD", value: cpuLoad, icon: Cpu, color: "primary" },
            { label: "MEMORY", value: memLoad, icon: Database, color: "secondary" },
            { label: "NETWORK", value: netBw, icon: Network, color: "accent" },
            { label: "DISK I/O", value: diskIo, icon: HardDrive, color: "emerald" },
          ].map(({ label, value, icon: Icon, color }) => (
            <GlassCard key={label} className="bg-black/60 border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
                <Icon className={`w-4 h-4 text-${color === 'emerald' ? 'emerald-500' : color}`} />
              </div>
              {/* Radial display */}
              <div className="relative flex items-center justify-center h-20 sm:h-24">
                <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90 absolute">
                  <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-white/5 sm:cx-48 sm:cy-48 sm:r-40 sm:stroke-width-3" />
                  <motion.circle
                    cx="40" cy="40" r="35"
                    stroke="currentColor" strokeWidth="2.5" fill="transparent"
                    strokeDasharray={220}
                    initial={{ strokeDashoffset: 220 }}
                    animate={{ strokeDashoffset: 220 - (220 * value) / 100 }}
                    strokeLinecap="round"
                    className={`text-${color === 'emerald' ? 'emerald-500' : color} transition-all duration-1000 sm:cx-48 sm:cy-48 sm:r-40 sm:stroke-width-3`}
                  />
                </svg>
                <div className="text-center z-10">
                  <div className="text-xl sm:text-2xl font-black">{value.toFixed(0)}<span className="text-xs sm:text-sm ml-0.5 opacity-60">%</span></div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Live Activity Graph */}
        <GlassCard className="bg-black/60 border-accent/20 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neural Processing Activity</h3>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono">
              <span className="text-gray-500">THROUGHPUT: <span className="text-accent font-black uppercase">{throughput.toFixed(2)} PB/s</span></span>
              <span className="text-gray-500 hidden sm:inline">CONNS: <span className="text-primary font-black uppercase">{activeConns.toLocaleString()}</span></span>
            </div>
          </div>
          <div className="h-32 flex items-end gap-0.5 sm:gap-1 relative">
            <div className="absolute inset-0 flex items-center">
              {[25, 50, 75].map(v => (
                <div key={v} className="absolute w-full border-t border-white/5" style={{ bottom: `${v}%` }} />
              ))}
            </div>
            {[...Array(window.innerWidth < 640 ? 24 : 48)].map((_, i) => {
              const h = 20 + Math.sin(i / 3) * 20 + Math.random() * 40;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.01, duration: 0.5 }}
                  className="flex-1 bg-accent/40 rounded-t relative group"
                  style={{ minWidth: 2 }}
                >
                  <div className="absolute inset-0 bg-accent/20 rounded-t group-hover:bg-accent/60 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        {/* Server Regions Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-accent" />
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Server Regions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGIONS.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="bg-black/60 border-white/10 hover:border-accent/30 transition-colors p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-black text-sm tracking-tighter uppercase">{region.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{region.location}</div>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                      region.status === 'NOMINAL'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                    }`}>
                      {region.status}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1 uppercase">
                        <span>LOAD</span><span className="text-white font-black">{region.load}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${region.load}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, duration: 1 }}
                          className={`h-full ${region.load > 70 ? 'bg-orange-500' : 'bg-accent'}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500 uppercase">
                      <Zap className="w-3 h-3" />
                      <span>Latency: <span className="text-white font-black">{region.latency}ms</span></span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Workflow Activity */}
        <GlassCard className="bg-black/60 border-primary/10 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workflow Execution</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "QUEUED", value: "4,821", color: "text-gray-400" },
              { label: "RUNNING", value: "1,248", color: "text-primary" },
              { label: "COMPLETED", value: "18.3K", color: "text-emerald-500" },
              { label: "FAILED", value: "3", color: "text-destructive" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/3 border border-white/5 rounded-lg p-3 sm:p-4 text-center">
                <div className={`text-xl sm:text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</div>
                <div className="text-[8px] sm:text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
