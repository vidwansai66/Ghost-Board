import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Cpu, MessageSquare, Wifi, Zap, BarChart3, Radio, X, LineChart, Gauge, Database, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ExecutiveProps {
  name: string;
  role: string;
  image: string;
  color: "cyan" | "violet" | "blue" | "red" | "orange" | "green" | "white";
  objective: string;
}

// Per-executive reasoning logs — specialized per role
const EXEC_REASONING: Record<string, string[]> = {
  "CEO AI": [
    "EVALUATING_STRATEGIC_POSTURE",
    "AUTHORIZING_EXPANSION_PROTOCOL",
    "RISK_REWARD_CALIBRATION",
    "SYNTHESIZING_BOARD_DIRECTIVES",
    "PROJECTING_Q3_FISCAL_TRAJECTORY",
    "CRISIS_PROTOCOL_ASSESSMENT",
  ],
  "CTO AI": [
    "PROFILING_CLUSTER_LATENCY",
    "NEURAL_FABRIC_DIAGNOSTICS",
    "SCALING_EDGE_NODES",
    "OPTIMIZING_MESH_TOPOLOGY",
    "REROUTING_TRAFFIC_FLOWS",
    "HARDENING_EMEA_INFRASTRUCTURE",
  ],
  "Marketing AI": [
    "ANALYZING_SENTIMENT_VECTORS",
    "DEPLOYING_HOLOGRAPHIC_ASSETS",
    "CALIBRATING_ENGAGEMENT_MODEL",
    "RUNNING_A/B_NEURAL_TEST",
    "APAC_RECOVERY_CAMPAIGN_LIVE",
    "MEASURING_BRAND_RESONANCE",
  ],
  "HR AI": [
    "REBALANCING_COMPUTE_AGENTS",
    "NEURAL_CALIBRATION_IN_PROGRESS",
    "ONBOARDING_SUB_AGENTS",
    "WORKLOAD_DISTRIBUTION_ANALYSIS",
    "AGENT_PERFORMANCE_SCORING",
    "OPTIMIZING_CYCLE_EFFICIENCY",
  ],
  "Operations AI": [
    "REROUTING_SUPPLY_CHAINS",
    "DRONE_LOGISTICS_SYNC",
    "VENDOR_CONTRACT_RENEGOTIATION",
    "EXECUTING_RECOVERY_WORKFLOW",
    "DEMAND_FORECAST_CALIBRATION",
    "AUTONOMOUS_LOGISTICS_ACTIVE",
  ],
  "Security AI": [
    "ZERO_TRUST_SWEEP_ACTIVE",
    "QUANTUM_KEY_ROTATION",
    "THREAT_SIGNATURE_INTEGRATION",
    "BEHAVIORAL_ANALYTICS_RUNNING",
    "PERIMETER_DEFENSE_UPGRADED",
    "ANOMALY_DETECTION_TIER_2",
  ],
};

// Per-executive dynamic objectives
const EXEC_OBJECTIVES: Record<string, string[]> = {
  "CEO AI": [
    "Maximize long-term enterprise value through autonomous orchestration.",
    "Authorize crisis Alpha-7 containment — all divisions on standby.",
    "Projecting record Q3 throughput — expansion protocol active.",
    "Synthesizing board directives with real-time operational data.",
  ],
  "CTO AI": [
    "Scaling neural infrastructure across multi-cloud edge nodes.",
    "Tokyo cluster recovery at 82% — full SLA restoration imminent.",
    "Rerouting APAC traffic to Singapore. Latency trending down.",
    "Pre-emptive EMEA scaling — 200 new nodes provisioned.",
  ],
  "Marketing AI": [
    "Optimizing global sentiment through holographic engagement.",
    "APAC recovery campaign live — trust score climbing +11pts.",
    "Q3 neural campaign assets deploying — 34% conversion uplift.",
    "Behavioral targeting model retrained on 3.2B interactions.",
  ],
  "HR AI": [
    "Balancing agent performance and neural load distribution.",
    "Reallocating 38% compute to crisis cluster — efficiency peak.",
    "Onboarding 3 sub-agents to Ops division — calibration active.",
    "Crisis efficiency delta: +14.2% — logging to neural memory.",
  ],
  "Operations AI": [
    "Synchronizing autonomous logistics with real-time demand.",
    "Recovery workflows deployed — Singapore overflow managed.",
    "Vendor renegotiation complete — $2.4M savings projected.",
    "Supply chain fully autonomous — 9 distribution hubs live.",
  ],
  "Security AI": [
    "Maintaining absolute zero-trust integrity across all sectors.",
    "Zero-trust sweep complete — no breach indicators detected.",
    "47 new threat signatures integrated — perimeter hardened.",
    "Quantum key rotation complete — all channels re-encrypted.",
  ],
};

import { useOrchestration } from "@/context/orchestration-context";

type PanelType = "none" | "brain" | "analytics" | "waveform" | "comms" | "activity";

export function ExecutiveCard({ name, role, image, color, objective }: ExecutiveProps) {
  const { state: orchState } = useOrchestration();
  const phase = orchState.phase;

  // Fixed initial values to prevent SSR/client hydration mismatch
  const [confidence, setConfidence]     = useState(94);
  const [load, setLoad]                 = useState(42);
  const [commsActivity, setCommsActivity] = useState(2);
  const [isThinking, setIsThinking]     = useState(false);
  const [reasoning, setReasoning]       = useState((EXEC_REASONING[name] || EXEC_REASONING["CEO AI"])[0]);
  const [currentObjective, setCurrentObjective] = useState(objective);
  const [status, setStatus]             = useState<"ACTIVE" | "PROCESSING" | "SYNC">("ACTIVE");
  const [msgFlash, setMsgFlash]         = useState(false);
  const [tick, setTick]                 = useState(0);
  const [mounted, setMounted]           = useState(false);
  const [activePanel, setActivePanel]   = useState<PanelType>("none");

  const reasoningLogs = EXEC_REASONING[name] || EXEC_REASONING["CEO AI"];
  const objectives    = EXEC_OBJECTIVES[name]  || [objective];

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      // Logic based on orchestration phase
      let targetConfidence = 96, targetLoad = 25, targetStatus: any = "ACTIVE";
      let thinkingChance = 0.3;

      switch(phase) {
        case "connecting":
        case "waiting_n8n":
          targetConfidence = 94; targetLoad = 45; targetStatus = "PROCESSING"; thinkingChance = 0.6;
          break;
        case "streaming_responses":
          targetConfidence = 88; targetLoad = 85; targetStatus = "PROCESSING"; thinkingChance = 0.9;
          break;
        case "complete":
          targetConfidence = 99.4; targetLoad = 15; targetStatus = "SYNC"; thinkingChance = 0.2;
          break;
        case "error":
          targetConfidence = 12; targetLoad = 99; targetStatus = "PROCESSING"; thinkingChance = 1.0;
          break;
        default: // idle
          targetConfidence = 96.2; targetLoad = 28; targetStatus = "ACTIVE"; thinkingChance = 0.3;
      }

      setConfidence(prev => prev + (targetConfidence - prev) * 0.12 + (Math.random() * 2 - 1));
      setLoad(prev => prev + (targetLoad - prev) * 0.12 + (Math.random() * 4 - 2));
      setStatus(targetStatus);
      setIsThinking(Math.random() < thinkingChance);
      setReasoning(reasoningLogs[Math.floor(Math.random() * reasoningLogs.length)]);
      setCommsActivity(Math.floor(Math.random() * 6));

      // Occasional objective rotation
      if (Math.random() > 0.8) {
        setCurrentObjective(objectives[Math.floor(Math.random() * objectives.length)]);
      }

      // Occasional message flash
      if (Math.random() > 0.75) {
        setMsgFlash(true);
        setTimeout(() => setMsgFlash(false), 700);
      }
      setTick(t => t + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [phase]);

  const colorMap: Record<string, { text: string; border: string; glow: string; bar: string; accent: string }> = {
    cyan:   { text: "text-primary",      border: "border-primary",      glow: "shadow-[0_0_12px_rgba(0,242,255,0.3)]",    bar: "bg-primary", accent: "bg-primary/20" },
    violet: { text: "text-secondary",    border: "border-secondary",    glow: "shadow-[0_0_12px_rgba(112,0,255,0.3)]",    bar: "bg-secondary", accent: "bg-secondary/20" },
    blue:   { text: "text-accent",       border: "border-accent",       glow: "shadow-[0_0_12px_rgba(58,100,255,0.3)]",   bar: "bg-accent", accent: "bg-accent/20" },
    red:    { text: "text-destructive",  border: "border-destructive",  glow: "shadow-[0_0_12px_rgba(239,68,68,0.3)]",    bar: "bg-destructive", accent: "bg-destructive/20" },
    orange: { text: "text-orange-500",   border: "border-orange-500",   glow: "shadow-[0_0_12px_rgba(249,115,22,0.3)]",   bar: "bg-orange-500", accent: "bg-orange-500/20" },
    green:  { text: "text-emerald-500",  border: "border-emerald-500",  glow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]",   bar: "bg-emerald-500", accent: "bg-emerald-500/20" },
    white:  { text: "text-white",        border: "border-white",        glow: "shadow-[0_0_12px_rgba(255,255,255,0.2)]",  bar: "bg-white", accent: "bg-white/20" },
  };

  const c = colorMap[color] || colorMap.cyan;
  const statusColors = { ACTIVE: "text-emerald-500", PROCESSING: "text-primary", SYNC: "text-yellow-500" };

  const togglePanel = (panel: PanelType) => {
    setActivePanel(activePanel === panel ? "none" : panel);
  };

  return (
    <GlassCard className="relative overflow-hidden group min-h-0" glowColor={color === 'white' ? 'cyan' : color as any}>
      {/* Scanning line */}
      <motion.div
        animate={{ y: ['0%', '100%', '0%'] }}
        transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'linear' }}
        className={`absolute left-0 right-0 h-px ${c.bar} opacity-10 pointer-events-none z-0`}
      />

      {/* Control Panels Overlay */}
      <AnimatePresence>
        {activePanel !== "none" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-2xl p-4 sm:p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                {activePanel === "brain" && <Brain className={`w-3.5 h-3.5 sm:w-4 h-4 ${c.text}`} />}
                {activePanel === "analytics" && <BarChart3 className={`w-3.5 h-3.5 sm:w-4 h-4 ${c.text}`} />}
                {activePanel === "waveform" && <Radio className={`w-3.5 h-3.5 sm:w-4 h-4 ${c.text}`} />}
                {activePanel === "comms" && <MessageCircle className={`w-3.5 h-3.5 sm:w-4 h-4 ${c.text}`} />}
                {activePanel === "activity" && <Activity className={`w-3.5 h-3.5 sm:w-4 h-4 ${c.text}`} />}
                <h4 className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase text-white truncate max-w-[150px]">
                  {name} // {activePanel}
                </h4>
              </div>
              <button onClick={() => setActivePanel("none")} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
              {activePanel === "brain" && (
                <div className="space-y-4">
                  <PanelMetric label="NEURAL_COHESION" value={98.2} color={c.text} />
                  <PanelMetric label="COGNITIVE_LOAD" value={load} color={load > 80 ? 'text-destructive' : c.text} />
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[8px] font-mono text-gray-500 mb-2 uppercase">Reasoning_Loop</div>
                    <div className={`text-[9px] sm:text-[10px] font-mono ${c.text} leading-relaxed`}>
                      › {reasoning}<br/>
                      › STABILITY: {confidence.toFixed(1)}%<br/>
                      › PRIORITY: HIGH
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "analytics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg text-center">
                      <div className="text-[7px] text-gray-500 uppercase mb-1">Eff.</div>
                      <div className="text-xs sm:text-sm font-black text-white">+14.2%</div>
                    </div>
                    <div className="p-2 bg-white/5 border border-white/5 rounded-lg text-center">
                      <div className="text-[7px] text-gray-500 uppercase mb-1">Resp.</div>
                      <div className="text-xs sm:text-sm font-black text-white">14ms</div>
                    </div>
                  </div>
                  <div className="h-20 sm:h-24 w-full bg-white/5 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LineChart className="w-8 h-8 text-white/5" />
                    </div>
                    <div className="flex items-end h-full gap-1 px-2 pb-1">
                      {[...Array(12)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [Math.random() * 40 + 20 + '%', Math.random() * 60 + 30 + '%'] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                          className={`w-full ${c.bar} opacity-20 rounded-t-sm`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "waveform" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Telemetry</span>
                    <span className="text-[8px] font-mono text-emerald-500 animate-pulse uppercase">Live</span>
                  </div>
                  <div className="h-12 sm:h-16 flex items-end gap-1 px-1">
                    {Array.from({ length: 15 }, (_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [Math.random() * 100 + '%', Math.random() * 100 + '%'] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className={`w-full ${c.bar} opacity-50 rounded-t-xs`}
                      />
                    ))}
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-gray-600 uppercase font-mono">Throughput</span>
                      <span className="text-white font-mono">1.2GB/s</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-gray-600 uppercase font-mono">Latency</span>
                      <span className="text-emerald-500 font-mono">4ms</span>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "comms" && (
                <div className="space-y-2.5">
                  <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Encrypted Link</div>
                  {[
                    { from: "CTO", msg: "Node stable. Resuming sync." },
                    { from: "CEO", msg: "Awaiting Q3 delta." },
                    { from: "SEC", msg: "Sector 7 clear." }
                  ].map((m, i) => (
                    <div key={i} className="p-2 bg-white/5 border border-white/5 rounded text-[9px] font-mono leading-relaxed">
                      <span className={c.text + " mr-2 font-black"}>[{m.from}]</span>
                      <span className="text-gray-400">{m.msg}</span>
                    </div>
                  ))}
                </div>
              )}

              {activePanel === "activity" && (
                <div className="space-y-2.5">
                  <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Pipeline</div>
                  {[
                    { task: "Neural Cal.", status: "DONE" },
                    { task: "Infra Scale", status: "RUN" },
                    { task: "Sentiment", status: "WAIT" }
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/3 border border-white/5 rounded">
                      <span className="text-[9px] font-mono text-gray-300 uppercase">{t.task}</span>
                      <span className={`text-[8px] font-black font-mono ${t.status === 'RUN' ? 'text-primary' : t.status === 'DONE' ? 'text-emerald-500' : 'text-gray-600'}`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Encrypted_Session</span>
              <div className="flex gap-1">
                <div className={`w-1 h-1 rounded-full ${c.bar}`} />
                <div className={`w-1 h-1 rounded-full ${c.bar} opacity-30`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar + identity */}
      <div className="flex items-start gap-3 mb-3 relative z-10">
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ boxShadow: isThinking ? [`0 0 0px currentColor`, `0 0 16px currentColor`, `0 0 0px currentColor`] : 'none' }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 ${c.border} overflow-hidden bg-black/40 relative z-10 ${isThinking ? c.glow : ''}`}
          >
            <Image src={image} alt={name} fill sizes="(max-width: 640px) 48px, 56px" className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          {/* Status dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-black rounded-full flex items-center justify-center z-20">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full ${color === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`}
            />
          </div>
          {/* Comms activity rings */}
          {mounted && commsActivity > 2 && (
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`absolute inset-0 rounded-lg border ${c.border} z-0`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-black text-sm sm:text-base tracking-tight truncate uppercase">{name}</h3>
            <span className={`text-[7px] sm:text-[8px] font-mono ${statusColors[status]} border border-current px-1 py-0.5 rounded leading-none`}>
              {status}
            </span>
          </div>
          <div className="text-[8px] sm:text-[9px] text-gray-500 font-mono mt-0.5 uppercase tracking-widest">{role}</div>

          {/* Reasoning ticker */}
          <div className="mt-2 p-1.5 bg-black/60 border border-white/5 rounded text-[8px] sm:text-[9px] font-mono h-7 flex items-center overflow-hidden">
            <span className="text-gray-700 mr-1.5 flex-shrink-0">›</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${reasoning}-${tick}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className={isThinking ? c.text + " truncate" : "text-gray-700 truncate"}
              >
                {isThinking ? reasoning : "IDLE_SECURE"}
              </motion.span>
            </AnimatePresence>
            {isThinking && (
              <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} className={`ml-1 ${c.text}`}>█</motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Current objective */}
      <div className="mb-3 relative z-10">
        <div className={`text-[8px] text-gray-600 uppercase font-black tracking-[0.2em] mb-1.5 flex items-center gap-1.5`}>
          <Zap className={`w-2.5 h-2.5 ${c.text}`} /> Objective
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentObjective}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[9px] sm:text-[10px] text-gray-400 line-clamp-2 leading-relaxed font-medium italic"
          >
            "{currentObjective}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <MetricBar label="CONFIDENCE" value={confidence} barClass={`bg-primary shadow-[0_0_8px_rgba(0,242,255,0.3)]`}
          textClass={confidence > 95 ? "text-emerald-500" : "text-primary"} />
        <MetricBar label="LOAD" value={load} barClass={`${load > 80 ? 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'bg-secondary shadow-[0_0_8px_rgba(112,0,255,0.3)]'}`}
          textClass={load > 80 ? "text-destructive" : "text-gray-400"} />
      </div>

      {/* Footer Controls */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex gap-2 sm:gap-3">
          <button onClick={() => togglePanel("brain")} title="Cognition" 
            className={`p-1.5 rounded-lg transition-all hover:bg-white/5 ${activePanel === 'brain' ? c.text + ' bg-white/10' : 'text-gray-600'}`}>
            <Brain className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => togglePanel("analytics")} title="Analytics"
            className={`p-1.5 rounded-lg transition-all hover:bg-white/5 ${activePanel === 'analytics' ? c.text + ' bg-white/10' : 'text-gray-600'}`}>
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => togglePanel("waveform")} title="Telemetry"
            className={`p-1.5 rounded-lg transition-all hover:bg-white/5 ${activePanel === 'waveform' ? c.text + ' bg-white/10' : 'text-gray-600'}`}>
            <Radio className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => togglePanel("comms")} title="Comms"
            className={`p-1.5 rounded-lg transition-all hover:bg-white/5 ${activePanel === 'comms' ? c.text + ' bg-white/10' : 'text-gray-600'}`}>
            <motion.div animate={{ scale: msgFlash ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.4 }}>
              <MessageSquare className="w-3.5 h-3.5" />
            </motion.div>
          </button>
          <button onClick={() => togglePanel("activity")} title="Pipeline"
            className={`p-1.5 rounded-lg transition-all hover:bg-white/5 ${activePanel === 'activity' ? c.text + ' bg-white/10' : 'text-gray-600'}`}>
            <Activity className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-end gap-0.5 h-3">
            {Array.from({ length: 4 }, (_, i) => (
              <motion.div
                key={i}
                animate={{ height: commsActivity > i ? `${4 + i * 2}px` : '1.5px', opacity: commsActivity > i ? 1 : 0.2 }}
                transition={{ duration: 0.4 }}
                className={`w-0.5 rounded-full ${c.bar}`}
              />
            ))}
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text-', 'bg-')} animate-pulse opacity-50`} />
        </div>
      </div>
    </GlassCard>
  );
}

function PanelMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase">
        <span>{label}</span>
        <span className={color}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color.replace('text-', 'bg-')}`} 
        />
      </div>
    </div>
  );
}

function MetricBar({ label, value, barClass, textClass }: {
  label: string; value: number; barClass: string; textClass: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase">
        <span>{label}</span>
        <motion.span
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={textClass}
        >
          {value.toFixed(1)}%
        </motion.span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`h-full ${barClass} rounded-full`}
        />
      </div>
    </div>
  );
}
