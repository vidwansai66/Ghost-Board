"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { HeroGlobe } from "@/components/ui/hero-globe";
import { CrisisOrchestrationPanel } from "@/components/dashboard/crisis-orchestration-panel";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Shield, Activity, Cpu, Network, TrendingUp, Users, Zap, Terminal, ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [decisionsCount, setDecisionsCount] = useState(48291);
  const simulationRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setDecisionsCount(v => v + Math.floor(Math.random() * 5 + 2)), 500);
    return () => clearInterval(t);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans scroll-smooth">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 hero-gradient" />
      <div className="scanline" />
      
      {/* Animated Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && [...Array(window.innerWidth < 640 ? 8 : 20)].map((_, i) => (
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
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-6 sm:py-8">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-primary/20 border border-primary rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tighter glow-text uppercase">GHOST BOARD</span>
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
          <Link href="/command-center/infrastructure" className="hover:text-primary transition-colors cursor-pointer">INFRASTRUCTURE</Link>
          <Link href="/command-center/executives" className="hover:text-primary transition-colors cursor-pointer">INTELLIGENCE</Link>
          <Link href="/command-center/security" className="hover:text-primary transition-colors cursor-pointer">SECURITY</Link>
          <button onClick={() => scrollToSection(simulationRef)} className="hover:text-primary transition-colors cursor-pointer text-left uppercase">SIMULATION</button>
        </div>
        <Link href="/command-center">
          <button className="px-4 sm:px-5 py-2 bg-primary/10 border border-primary/40 text-primary rounded-sm text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:bg-primary hover:text-black transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] active:scale-95">
            ESTABLISH CONNECTION
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-8 sm:pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-primary mb-6 animate-pulse uppercase">
            <Activity className="w-3 h-3" />
            SYSTEM_OPERATIONAL — {decisionsCount.toLocaleString()} DECISIONS EXECUTED
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 leading-tight sm:leading-none uppercase">
            GHOST <span className="text-primary glow-text">BOARD</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-3xl mx-auto mb-10 px-4">
            Autonomous Executive Coordination System.<br className="hidden sm:block"/>
            <span className="text-white font-medium italic block mt-2 sm:mt-1">Where AI Executives Run Enterprise Operations Autonomously.</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 px-4 w-full sm:w-auto">
            <Link href="/command-center" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-primary text-black font-black text-base sm:text-lg rounded-sm hover:bg-white hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-500 group flex items-center justify-center gap-2 active:scale-95 uppercase">
                ENTER COMMAND CENTER
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button 
              onClick={() => scrollToSection(simulationRef)}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold text-base sm:text-lg rounded-sm hover:bg-white/10 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] active:scale-95 group flex items-center justify-center gap-2 uppercase"
            >
              VIEW SIMULATION
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-primary" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-mono text-gray-600 mt-4 uppercase"
          >
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-emerald-500" /> 99.98% Uptime</span>
            <span className="flex items-center gap-1.5"><Users className="w-3 h-3 text-primary" /> 6 AI Executives</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-secondary" /> 48k Decisions/sec</span>
          </motion.div>
        </motion.div>

        {/* === ANIMATED GLOBE === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-8 scale-75 sm:scale-100"
        >
          <HeroGlobe />
        </motion.div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-24 max-w-6xl w-full px-6 sm:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <GlassCard className="flex flex-col gap-4 p-6 sm:p-8 hover:bg-white/5 transition-colors cursor-default h-full">
              <Cpu className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Autonomous Execution</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Decentralized AI agents coordinating enterprise-scale operations with zero human latency.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <GlassCard className="flex flex-col gap-4 p-6 sm:p-8 hover:bg-white/5 transition-colors cursor-default h-full" glowColor="violet">
              <Network className="w-10 h-10 text-secondary" />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Neural Workflow</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time synchronization between Marketing, Ops, and Security layers via encrypted data streams.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <GlassCard className="flex flex-col gap-4 p-6 sm:p-8 hover:bg-white/5 transition-colors cursor-default h-full" glowColor="blue">
              <Shield className="w-10 h-10 text-accent" />
              <h3 className="text-xl font-bold uppercase tracking-tighter">Crisis Mitigation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Proactive incident response systems that detect and resolve bottlenecks before they impact growth.
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* ── CRISIS SIMULATION PREVIEW ── */}
        <div ref={simulationRef} className="w-full max-w-6xl mt-24 sm:mt-40 px-4 sm:px-10 pb-24 sm:pb-40 scroll-mt-20 overflow-x-hidden">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-primary mb-4 uppercase">
              <Terminal className="w-3 h-3" />
              ORCHESTRATION_PREVIEW
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-tight">
              Autonomous <span className="text-primary glow-text">Response</span> Engine
            </h2>
            <p className="text-gray-500 max-w-2xl font-mono text-[10px] sm:text-xs uppercase tracking-widest leading-relaxed px-4">
              Experience the GHOST BOARD AI executives in action. This live preview connects directly to our neural orchestration engine to simulate high-stakes enterprise decision-making.
            </p>
          </div>
          
          <div className="relative group p-1 sm:p-0">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[1rem] sm:rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-1000" />
            
            <div className="relative">
              <CrisisOrchestrationPanel />
            </div>

            {/* Floating Info (Desktop Only) */}
            <div className="absolute -right-4 -bottom-4 hidden lg:block">
              <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-4 rounded-xl shadow-2xl space-y-2 max-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Integration</span>
                </div>
                <p className="text-[9px] text-gray-500 font-mono leading-relaxed">
                  DIRECT_HOOK_N8N_ENABLED: TRUE<br/>
                  LATENCY_TARGET: &lt;200MS<br/>
                  ENCRYPTION: AES-256
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-black">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-[9px] sm:text-[10px] font-black tracking-widest text-gray-600 uppercase text-center sm:text-left">
          <span className="text-gray-400">© 2026 NOVAPAY GHOST BOARD</span>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-2 text-[9px] font-mono text-gray-700">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            SYSTEM_NOMINAL
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary transition-colors cursor-pointer group">
              <Shield className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Logs (Desktop Only) */}
      <div className="fixed bottom-10 left-10 hidden lg:block z-50">
        <div className="text-[10px] font-mono text-primary opacity-40 space-y-1">
          <div>[INIT] GHOST_PROTOCOL_V4.0</div>
          <div>[AUTH] SECURITY_ACCEPTED</div>
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
