"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { HeroGlobe } from "@/components/ui/hero-globe";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Activity, Cpu, Network, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [decisionsCount, setDecisionsCount] = useState(48291);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDecisionsCount(v => v + Math.floor(Math.random() * 5 + 2)), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 hero-gradient" />
      <div className="scanline" />
      
      {/* Animated Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: (i * 7.7) % 100 + "%", y: (i * 13.3) % 100 + "%" }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0, 1.5, 0],
              x: [(i * 7.7) % 100 + "%", (100 - (i * 7.7) % 100) + "%"],
              y: [(i * 13.3) % 100 + "%", (100 - (i * 13.3) % 100) + "%"]
            }}
            transition={{ duration: 15 + (i % 10), repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-primary rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 border border-primary rounded flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tighter glow-text">GHOST BOARD</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-primary transition-colors">INFRASTRUCTURE</a>
          <a href="#" className="hover:text-primary transition-colors">INTELLIGENCE</a>
          <a href="#" className="hover:text-primary transition-colors">SECURITY</a>
          <a href="#" className="hover:text-primary transition-colors">DOCS</a>
        </div>
        <Link href="/command-center">
          <button className="px-6 py-2 bg-primary/10 border border-primary/50 text-primary rounded-md text-sm font-bold hover:bg-primary hover:text-black transition-all duration-300 glow-border">
            ESTABLISH CONNECTION
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold tracking-[0.2em] text-primary mb-6 animate-pulse">
            <Activity className="w-3 h-3" />
            SYSTEM STATUS: OPERATIONAL — {decisionsCount.toLocaleString()} DECISIONS EXECUTED
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 leading-none">
            GHOST <span className="text-primary glow-text">BOARD</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto mb-10">
            Autonomous Executive Coordination System.<br/>
            <span className="text-white font-medium italic">Where AI Executives Run Enterprise Operations Autonomously.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/command-center">
              <button className="px-10 py-4 bg-primary text-black font-black text-lg rounded-sm hover:bg-white hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-500 group flex items-center gap-2">
                ENTER COMMAND CENTER
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="px-10 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-lg rounded-sm hover:bg-white/10 transition-all duration-300">
              VIEW CRISIS SIMULATION
            </button>
          </div>

          {/* Trust metrics strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center gap-8 text-[10px] font-mono text-gray-600 mt-4"
          >
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500" /> 99.98% Uptime</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3 text-primary" /> 6 AI Executives</span>
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-secondary" /> 48k Decisions/sec</span>
          </motion.div>
        </motion.div>

        {/* ===  ANIMATED GLOBE === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <HeroGlobe />
        </motion.div>

        {/* Stats / Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl w-full px-10 pb-40">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
            <GlassCard className="flex flex-col gap-4 hover:scale-105 transition-transform duration-300">
              <Cpu className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Autonomous Execution</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Decentralized AI agents coordinating enterprise-scale operations with zero human latency.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }}>
            <GlassCard className="flex flex-col gap-4 hover:scale-105 transition-transform duration-300" glowColor="violet">
              <Network className="w-10 h-10 text-secondary" />
              <h3 className="text-xl font-bold">Neural Workflow</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time synchronization between Marketing, Ops, and Security layers via encrypted data streams.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
            <GlassCard className="flex flex-col gap-4 hover:scale-105 transition-transform duration-300" glowColor="blue">
              <Shield className="w-10 h-10 text-accent" />
              <h3 className="text-xl font-bold">Crisis Mitigation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Proactive incident response systems that detect and resolve bottlenecks before they impact growth.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </main>

      {/* Floating Logs */}
      <div className="fixed bottom-10 left-10 hidden lg:block z-50">
        <div className="text-[10px] font-mono text-primary opacity-50 space-y-1">
          <div>[INIT] GHOST_PROTOCOL_V4.0</div>
          <div>[AUTH] SECURITY_CLEARANCE_ACCEPTED</div>
          <div>[SYNC] NEURAL_LINK_STABLE</div>
          <motion.div 
            animate={{ opacity: [0, 1] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-primary inline-block ml-1 align-middle"
          />
        </div>
      </div>
    </div>
  );
}
