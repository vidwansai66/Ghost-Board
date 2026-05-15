"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, ShieldCheck, TrendingDown, TrendingUp, Zap, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ENTERPRISE_CONFIG } from "@/constants/enterprise";
import { useOrchestration } from "@/context/orchestration-context";

const INCIDENT_EVENTS = [
  { severity: "CRITICAL", msg: "NovaPay sentiment collapse detected — 18pt drop in 4 minutes.", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
  { severity: "HIGH",     msg: "Tokyo cluster latency breach — 4x SLA threshold exceeded.",  color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { severity: "ELEVATED", msg: "Anomalous login probe — Frankfurt subnet quarantined.",        color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  { severity: "WARNING",  msg: "NovaPay neural fabric degradation at 23% — rerouting initiated.",     color: "text-primary",    bg: "bg-primary/10",    border: "border-primary/30" },
  { severity: "INFO",     msg: "Recovery chain at 82%. All systems trending stable.",          color: "text-emerald-500",bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
  { severity: "INFO",     msg: "Quantum key rotation complete. All channels re-encrypted.",    color: "text-emerald-500",bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
  { severity: "HIGH",     msg: "Treasury volatility spike — mitigation workflow X-9 active.", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { severity: "CRITICAL", msg: "Unauthorized API flood — 4,200 req/s from rogue node.",       color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
];

export function CrisisMonitor() {
  const { state } = useOrchestration();
  const phase = state.phase;

  const [outrage, setOutrage]       = useState(12);
  const [stability, setStability]   = useState(98);
  const [risk, setRisk]             = useState(8);
  const [escalation, setEscalation] = useState(5);
  const [recovery, setRecovery]     = useState(88);
  const [wfActivity, setWfActivity] = useState(72);
  const [activeIncident, setActiveIncident] = useState(4);
  const [alertPulse, setAlertPulse] = useState(false);

  useEffect(() => {
    const metricInterval = setInterval(() => {
      // Logic based on orchestration phase
      let targetOutrage = 10, targetStability = 99, targetRisk = 5, targetEscalation = 2, targetWf = 10, targetRecovery = 100;

      switch(phase) {
        case "connecting":
        case "waiting_n8n":
          targetOutrage = 45; targetStability = 92; targetRisk = 30; targetEscalation = 40; targetWf = 60; targetRecovery = 40;
          break;
        case "streaming_responses":
          targetOutrage = 85; targetStability = 82; targetRisk = 75; targetEscalation = 90; targetWf = 95; targetRecovery = 20;
          break;
        case "complete":
          targetOutrage = 15; targetStability = 98.5; targetRisk = 8; targetEscalation = 5; targetWf = 25; targetRecovery = 95;
          break;
        case "error":
          targetOutrage = 99; targetStability = 30; targetRisk = 99; targetEscalation = 100; targetWf = 15; targetRecovery = 0;
          break;
        default: // idle
          targetOutrage = 12; targetStability = 98.8; targetRisk = 4; targetEscalation = 2; targetWf = 8; targetRecovery = 99;
      }

      setOutrage(prev => prev + (targetOutrage - prev) * 0.15 + (Math.random() * 4 - 2));
      setStability(prev => prev + (targetStability - prev) * 0.15 + (Math.random() * 1 - 0.5));
      setRisk(prev => prev + (targetRisk - prev) * 0.15 + (Math.random() * 4 - 2));
      setEscalation(prev => prev + (targetEscalation - prev) * 0.15 + (Math.random() * 4 - 2));
      setRecovery(prev => prev + (targetRecovery - prev) * 0.15 + (Math.random() * 2 - 1));
      setWfActivity(prev => prev + (targetWf - prev) * 0.15 + (Math.random() * 6 - 3));
    }, 1500);

    const incidentInterval = setInterval(() => {
      // Pick incident relevant to phase
      let pool = [4, 5]; // neutral
      if (phase === "streaming_responses") pool = [0, 1, 7];
      if (phase === "complete") pool = [4, 5, 13];
      if (phase === "error") pool = [0, 1, 6, 7];
      
      const next = pool[Math.floor(Math.random() * pool.length)];
      if (next < INCIDENT_EVENTS.length) {
        setActiveIncident(next);
        setAlertPulse(true);
        setTimeout(() => setAlertPulse(false), 800);
      }
    }, 8000);

    return () => { clearInterval(metricInterval); clearInterval(incidentInterval); };
  }, [phase]);

  const incident = INCIDENT_EVENTS[activeIncident] || INCIDENT_EVENTS[4];
  const isCritical = incident.severity === "CRITICAL" || incident.severity === "HIGH";

  return (
    <GlassCard className="h-full bg-black/50 border-primary/20 overflow-hidden" glowColor={phase === "streaming_responses" ? "red" : phase === "error" ? "red" : "blue"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold tracking-widest uppercase">{ENTERPRISE_CONFIG.companyName} Monitor</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.2, 1], scale: alertPulse ? [1, 1.5, 1] : 1 }}
            transition={{ duration: alertPulse ? 0.5 : 1.2, repeat: alertPulse ? 0 : Infinity }}
            className={`w-2 h-2 rounded-full ${isCritical ? 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.9)]' : 'bg-emerald-500'}`}
          />
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{ENTERPRISE_CONFIG.region}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Stability Ring */}
        <div className="flex flex-col items-center justify-center py-2 relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle cx="72" cy="72" r="62" stroke="rgba(255,255,255,0.04)" strokeWidth="6" fill="transparent" />
            {/* Outer glow ring */}
            <motion.circle
              cx="72" cy="72" r="62"
              stroke="currentColor" strokeWidth="6" fill="transparent"
              strokeDasharray={390}
              initial={{ strokeDashoffset: 390 - (390 * 98) / 100 }}
              animate={{ strokeDashoffset: 390 - (390 * stability) / 100 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className={stability > 95 ? "text-emerald-500" : stability > 80 ? "text-primary" : "text-destructive"}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl font-black glow-text"
            >
              {stability.toFixed(0)}%
            </motion.span>
            <span className="text-[9px] text-gray-500 font-mono">STABILITY</span>
            <div className={`mt-1 text-[8px] font-bold px-2 py-0.5 rounded ${stability > 95 ? 'bg-emerald-500/20 text-emerald-500' : stability > 80 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
              {stability > 95 ? 'NOMINAL' : stability > 80 ? 'DEGRADED' : 'CRITICAL'}
            </div>
          </div>
        </div>

        {/* Metric grid */}
        <div className="grid grid-cols-2 gap-3">
          <LiveMetricBar label="Customer Outrage" value={outrage}   colorClass="bg-destructive"  textClass="text-destructive" icon={<TrendingUp className="w-3 h-3"/>} />
          <LiveMetricBar label="Operational Risk" value={risk}      colorClass="bg-orange-500"   textClass="text-orange-500"  icon={<ShieldAlert className="w-3 h-3"/>} />
          <LiveMetricBar label="Escalation Level" value={escalation} colorClass="bg-yellow-500" textClass="text-yellow-500"  icon={<AlertTriangle className="w-3 h-3"/>} />
          <LiveMetricBar label="Recovery Progress" value={recovery} colorClass="bg-emerald-500" textClass="text-emerald-500" icon={<TrendingDown className="w-3 h-3"/>} />
        </div>

        {/* Workflow Activity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-gray-500 uppercase tracking-widest">Workflow Activity</span>
            <span className="text-primary font-bold">{wfActivity.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              animate={{ width: `${wfActivity}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_12px_rgba(0,242,255,0.4)] rounded-full"
            />
            {/* Pulse scanner */}
            <motion.div
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </div>
        </div>

        {/* Live incident banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIncident}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.35 }}
            className={`p-3 ${incident.bg} border ${incident.border} rounded-lg relative overflow-hidden`}
          >
            <div className="flex items-start gap-2">
              <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${incident.border} ${incident.color} shrink-0 mt-0.5`}>
                {incident.severity}
              </div>
              <p className={`text-[10px] font-mono leading-relaxed ${incident.color}`}>{incident.msg}</p>
            </div>
            {isCritical && (
              <motion.div
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-destructive/20 pointer-events-none"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Status row */}
        <div className="flex items-center justify-center gap-6 pt-1">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-[8px] text-gray-600 font-mono">SECURE</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-[8px] text-gray-600 font-mono">ACTIVE</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <span className="text-[8px] text-gray-600 font-mono">SCANNING</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function LiveMetricBar({ label, value, colorClass, textClass, icon }: {
  label: string; value: number; colorClass: string; textClass: string; icon: React.ReactNode;
}) {
  return (
    <div className="space-y-1 bg-black/30 rounded-lg p-2 border border-white/5">
      <div className="flex items-center justify-between">
        <div className={`${textClass} opacity-70`}>{icon}</div>
        <span className={`text-[10px] font-black font-mono ${textClass}`}>{value.toFixed(0)}</span>
      </div>
      <div className="text-[8px] text-gray-600 uppercase tracking-widest truncate">{label}</div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className={`h-full ${colorClass} rounded-full`}
          style={{ boxShadow: `0 0 8px currentColor` }}
        />
      </div>
    </div>
  );
}
