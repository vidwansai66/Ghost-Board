"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const REPORT_SUMMARIES = [
  "Neural node clusters in EMEA region exhibiting +14% efficiency after autonomous rerouting protocol. Sentiment recovery confirmed in APAC.",
  "Tokyo cluster fully restored. Crisis Alpha-7 archived. Cross-division coordination logged as record-breaking. Neural memory updated.",
  "Treasury volatility stabilized. Mitigation workflow X-9 deactivated. Fiscal efficiency index: 94.2%. Q3 on track.",
  "Global sentiment index: 89.4 and climbing. APAC trust score recovered +11pts. Q3 campaign neural assets deployed.",
  "EMEA scaling complete — 200 nodes live. Pre-emptive surge capacity allocated. Mesh latency reduced 12ms across all zones.",
];

const CRISIS_INSIGHTS = [
  { label: "Primary Threat", value: "APAC Sentiment Erosion", color: "text-destructive", border: "border-destructive" },
  { label: "Active Mitigation", value: "Recovery Campaign Alpha", color: "text-orange-500", border: "border-orange-500" },
  { label: "System Posture",   value: "Crisis Alpha-7 Engaged", color: "text-yellow-500", border: "border-yellow-500" },
  { label: "Primary Threat", value: "Unauthorized API Probe",   color: "text-destructive", border: "border-destructive" },
  { label: "Active Mitigation", value: "Zero-Trust Sweep Live",  color: "text-orange-500", border: "border-orange-500" },
];

const RECOMMENDATIONS = [
  ["Maintain crisis posture until stability exceeds 97.5%.", "Resume Q3 expansion on confirmed stabilization.", "Rotate quantum keys on 6-hour cycle post-incident."],
  ["Reallocate compute to Marketing and CTO divisions.", "Defer Cycle-8 HR optimization until nominal state.", "Log coordination performance to neural long-term memory."],
  ["Scale EMEA cluster by additional 100 nodes proactively.", "Re-run behavioral analytics on Frankfurt subnet.", "Upgrade APAC perimeter defense — Tier-3 escalation."],
];

type GenerationPhase = "idle" | "scanning" | "compiling" | "writing" | "complete";

export function IntelligenceReport() {
  const [phase, setPhase]             = useState<GenerationPhase>("complete");
  const [summaryIdx, setSummaryIdx]   = useState(0);
  const [crisisIdx, setCrisisIdx]     = useState(0);
  const [recIdx, setRecIdx]           = useState(0);
  const [displayedText, setDisplayedText] = useState(REPORT_SUMMARIES[0]);
  const [progress, setProgress]       = useState(100);
  const [metricA, setMetricA]         = useState<"Low" | "Elevated" | "High">("Low");
  const [metricB, setMetricB]         = useState<"Stable" | "Degraded" | "Critical">("Stable");
  const [generationCount, setGenerationCount] = useState(1);
  const [autoGenTimer, setAutoGenTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGeneration = () => {
    const nextSummary = (summaryIdx + 1) % REPORT_SUMMARIES.length;
    const nextCrisis  = (crisisIdx + 1) % CRISIS_INSIGHTS.length;
    const nextRec     = (recIdx + 1) % RECOMMENDATIONS.length;

    setPhase("scanning");
    setProgress(0);
    setAutoGenTimer(0);

    // Phase progression
    setTimeout(() => { setPhase("compiling"); setProgress(30); }, 900);
    setTimeout(() => { setPhase("writing");   setProgress(65); }, 1900);
    setTimeout(() => {
      setPhase("complete");
      setProgress(100);
      setSummaryIdx(nextSummary);
      setCrisisIdx(nextCrisis);
      setRecIdx(nextRec);
      setDisplayedText(REPORT_SUMMARIES[nextSummary]);
      setMetricA(["Low","Elevated","High"][Math.floor(Math.random()*3)] as any);
      setMetricB(["Stable","Degraded","Critical"][Math.floor(Math.random()*3)] as any);
      setGenerationCount(c => c + 1);
    }, 3200);
  };

  // Auto-generate every 25 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAutoGenTimer(t => {
        if (t >= 24) {
          startGeneration();
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [summaryIdx, crisisIdx, recIdx]);

  const phaseLabel = { idle: "STANDBY", scanning: "SCANNING...", compiling: "COMPILING...", writing: "WRITING...", complete: "COMPLETE" }[phase];
  const crisis = CRISIS_INSIGHTS[crisisIdx];
  const recs   = RECOMMENDATIONS[recIdx];

  const metricAColor = { Low: "text-emerald-500", Elevated: "text-yellow-500", High: "text-destructive" }[metricA];
  const metricBColor = { Stable: "text-primary", Degraded: "text-orange-500", Critical: "text-destructive" }[metricB];

  return (
    <GlassCard className="h-full bg-black/60 border-primary/20 overflow-hidden" glowColor="blue">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <h3 className="text-xs font-bold tracking-widest uppercase">Intelligence Report</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-gray-600">#{String(generationCount).padStart(3, '0')}</span>
          <AnimatePresence mode="wait">
            {phase !== "complete" ? (
              <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader2 className="w-3 h-3 text-primary animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Sparkles className="w-3 h-3 text-accent" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className={`text-[8px] font-mono ${phase === 'complete' ? 'text-emerald-500' : 'text-primary'}`}>{phaseLabel}</span>
        </div>
      </div>

      {/* Generation progress bar */}
      <div className="mb-4 space-y-1">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent to-primary shadow-[0_0_8px_rgba(0,242,255,0.4)] rounded-full"
          />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-gray-700">
          <span>NEURAL SYNTHESIS ENGINE v3.1</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Executive Summary */}
        <div className="p-3 bg-white/3 border-l-2 border-primary rounded-r-lg">
          <div className="text-[9px] font-bold text-primary uppercase mb-1.5">Executive Summary</div>
          <AnimatePresence mode="wait">
            <motion.p
              key={summaryIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              className="text-[10px] text-gray-400 leading-relaxed"
            >
              {phase !== "complete" ? (
                <span className="flex items-center gap-2">
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.4, repeat: Infinity }}>█</motion.span>
                  <span className="text-gray-600 italic">Synthesizing intelligence streams...</span>
                </span>
              ) : displayedText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Crisis Analysis */}
        <AnimatePresence mode="wait">
          <motion.div
            key={crisisIdx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
            className={`p-3 bg-destructive/5 border-l-2 ${crisis.border} rounded-r-lg`}
          >
            <div className={`text-[9px] font-bold uppercase mb-1 ${crisis.color}`}>{crisis.label}</div>
            <p className={`text-[10px] font-mono ${crisis.color} opacity-80`}>{crisis.value}</p>
          </motion.div>
        </AnimatePresence>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence mode="wait">
            <motion.div key={metricA} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <div className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter mb-1">Operational Risk</div>
              <div className={`text-sm font-black ${metricAColor}`}>{metricA}</div>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div key={metricB} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white/5 p-2.5 rounded-lg border border-white/5">
              <div className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter mb-1">Infrastructure</div>
              <div className={`text-sm font-black ${metricBColor}`}>{metricB}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Recommendations */}
        <div className="space-y-1.5">
          <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Recommendations</div>
          <AnimatePresence mode="wait">
            <motion.div key={recIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
              {recs.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-primary text-[8px] mt-0.5 flex-shrink-0">▸</span>
                  <p className="text-[9px] text-gray-500 leading-relaxed">{r}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Auto-gen progress + manual trigger */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[8px] font-mono text-gray-700">
            <span>NEXT AUTO-GENERATION</span>
            <span>{25 - autoGenTimer}s</span>
          </div>
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(autoGenTimer / 25) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-accent/40 rounded-full"
            />
          </div>
          <button
            onClick={startGeneration}
            disabled={phase !== "complete"}
            className="w-full py-2 bg-primary/5 border border-primary/30 text-primary text-[9px] font-bold uppercase tracking-widest hover:bg-primary/15 hover:border-primary/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded"
          >
            <RefreshCw className={`w-3 h-3 ${phase !== 'complete' ? 'animate-spin' : ''}`} />
            {phase === "complete" ? "GENERATE FULL ASSESSMENT" : phaseLabel}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
