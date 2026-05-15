"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Layers, Share2, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WORKFLOW_NODES = [
  { id: 1, label: 'DATA_INGEST',   x: 15, y: 50, color: '#00f2ff' },
  { id: 2, label: 'NEURAL_PROC',   x: 42, y: 22, color: '#7000ff' },
  { id: 3, label: 'RISK_ANALYSIS', x: 42, y: 78, color: '#ff6b35' },
  { id: 4, label: 'EXEC_DECISION', x: 70, y: 50, color: '#00f2ff' },
  { id: 5, label: 'RECOVERY_OPS',  x: 90, y: 30, color: '#10b981' },
  { id: 6, label: 'DEPLOY_CHAIN',  x: 90, y: 70, color: '#f59e0b' },
];

const CONNECTIONS = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 4, to: 6 },
];

const CHAIN_LABELS = [
  "CRISIS_RECOVERY_CHAIN",
  "SENTIMENT_ROUTING",
  "SECURITY_SWEEP",
  "SUPPLY_CHAIN_SYNC",
  "EXPANSION_PROTOCOL",
];

const LAYER_STATUSES = [
  { label: "LAYER_01", status: "NOMINAL", color: "text-secondary" },
  { label: "LAYER_02", status: "SYNCING", color: "text-primary" },
  { label: "LAYER_03", status: "ACTIVE",  color: "text-emerald-500" },
  { label: "LAYER_04", status: "LOADING", color: "text-orange-500" },
];

export function WorkflowVisualizer() {
  const [activePaths, setActivePaths] = useState<Set<number>>(new Set([0]));
  const [nodeActivity, setNodeActivity] = useState<Record<number, boolean>>({});
  const [chainLabel, setChainLabel]     = useState(CHAIN_LABELS[0]);
  const [tflops, setTflops]             = useState(24.8);
  const [syncMs, setSyncMs]             = useState(12);
  const [nodeCount, setNodeCount]       = useState(6);
  const [processingLoad, setProcessingLoad] = useState(45);
  const [layerIdx, setLayerIdx]         = useState(0);
  const [pulseNodeId, setPulseNodeId]   = useState<number | null>(null);

  useEffect(() => {
    // Multi-path activation — fire 2-3 paths simultaneously
    const pathInterval = setInterval(() => {
      const pathCount = 2 + Math.floor(Math.random() * 2);
      const indices = new Set<number>();
      while (indices.size < pathCount) {
        indices.add(Math.floor(Math.random() * CONNECTIONS.length));
      }
      setActivePaths(indices);
      setChainLabel(CHAIN_LABELS[Math.floor(Math.random() * CHAIN_LABELS.length)]);
    }, 2200);

    // Node activity flicker
    const nodeInterval = setInterval(() => {
      const activity: Record<number, boolean> = {};
      WORKFLOW_NODES.forEach(n => { activity[n.id] = Math.random() > 0.35; });
      setNodeActivity(activity);
      const rnd = Math.floor(Math.random() * WORKFLOW_NODES.length) + 1;
      setPulseNodeId(rnd);
      setTimeout(() => setPulseNodeId(null), 500);
    }, 1200);

    // Metric fluctuation
    const metricInterval = setInterval(() => {
      setTflops(prev  => Math.max(10, Math.min(90, prev + (Math.random() * 8 - 4))));
      setSyncMs(prev   => Math.max(4, Math.min(40, prev + (Math.random() * 6 - 3))));
      setProcessingLoad(prev => Math.max(20, Math.min(95, prev + (Math.random() * 12 - 6))));
      setLayerIdx(prev => (prev + 1) % LAYER_STATUSES.length);
    }, 3000);

    return () => { clearInterval(pathInterval); clearInterval(nodeInterval); clearInterval(metricInterval); };
  }, []);

  return (
    <GlassCard className="h-full bg-black/50 border-primary/20 overflow-hidden" glowColor="violet">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-secondary" />
          <h3 className="text-xs font-bold tracking-widest uppercase">Workflow Engine</h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-secondary rounded-full shadow-[0_0_6px_rgba(112,0,255,0.8)]" />
          <span className="text-[9px] font-mono text-gray-500">EXEC ACTIVE</span>
        </div>
      </div>

      {/* SVG Workflow Graph */}
      <div className="relative w-full h-[220px] bg-black/60 rounded-xl border border-white/5 cyber-grid overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Static connection lines */}
          {CONNECTIONS.map((conn, i) => {
            const from = WORKFLOW_NODES.find(n => n.id === conn.from)!;
            const to   = WORKFLOW_NODES.find(n => n.id === conn.to)!;
            return (
              <line key={`line-${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={activePaths.has(i) ? "rgba(112,0,255,0.5)" : "rgba(255,255,255,0.06)"}
                strokeWidth={activePaths.has(i) ? "0.8" : "0.4"}
              />
            );
          })}

          {/* Animated data pulses on active paths */}
          {CONNECTIONS.map((conn, i) => {
            if (!activePaths.has(i)) return null;
            const from = WORKFLOW_NODES.find(n => n.id === conn.from)!;
            const to   = WORKFLOW_NODES.find(n => n.id === conn.to)!;
            return (
              <motion.circle key={`pulse-${i}`}
                r="1.2"
                fill={from.color}
                initial={{ cx: from.x, cy: from.y }}
                animate={{ cx: [from.x, to.x], cy: [from.y, to.y] }}
                transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: `drop-shadow(0 0 3px ${from.color})` }}
              />
            );
          })}

          {/* Nodes */}
          {WORKFLOW_NODES.map((node) => (
            <g key={node.id}>
              {/* Pulse ring on active node */}
              {nodeActivity[node.id] && (
                <motion.circle
                  cx={node.x} cy={node.y}
                  initial={{ r: 4, opacity: 0.6 }}
                  animate={{ r: [4, 7, 4], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  fill="none" stroke={node.color} strokeWidth="0.5"
                />
              )}
              {/* Node core */}
              <motion.circle
                cx={node.x} cy={node.y}
                initial={{ r: 3 }}
                animate={{ r: pulseNodeId === node.id ? [3, 4.5, 3] : [3, 3, 3] }}
                transition={{ duration: 0.4 }}
                fill="#000"
                stroke={nodeActivity[node.id] ? node.color : "rgba(255,255,255,0.15)"}
                strokeWidth={nodeActivity[node.id] ? "1.2" : "0.5"}
                style={{ filter: nodeActivity[node.id] ? `drop-shadow(0 0 4px ${node.color})` : 'none' }}
              />
              {/* Label */}
              <text x={node.x} y={node.y + 9} fill={node.color} fontSize="3.2"
                textAnchor="middle" className="font-mono" opacity={nodeActivity[node.id] ? 0.9 : 0.3}>
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* HUD Overlays */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <AnimatePresence mode="wait">
            <motion.div key={chainLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-1.5 py-0.5 bg-secondary/10 border border-secondary/30 rounded text-[7px] font-mono text-secondary">
              {chainLabel}
            </motion.div>
          </AnimatePresence>
          <div className="px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[7px] font-mono text-primary">
            NODES: {nodeCount}/6
          </div>
        </div>

        {/* Processing load indicator */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${processingLoad}%` }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="h-full bg-secondary shadow-[0_0_8px_rgba(112,0,255,0.5)] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-black/30 border border-white/5 rounded p-2 text-center">
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm font-black text-secondary"
          >
            {tflops.toFixed(1)}
          </motion.div>
          <div className="text-[7px] text-gray-600 uppercase font-mono">Tflops</div>
        </div>
        <div className="bg-black/30 border border-white/5 rounded p-2 text-center">
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-sm font-black text-primary"
          >
            {syncMs.toFixed(0)}ms
          </motion.div>
          <div className="text-[7px] text-gray-600 uppercase font-mono">Sync</div>
        </div>
        <div className="bg-black/30 border border-white/5 rounded p-2 text-center">
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="text-sm font-black text-emerald-500"
          >
            {activePaths.size}/6
          </motion.div>
          <div className="text-[7px] text-gray-600 uppercase font-mono">Active</div>
        </div>
      </div>

      {/* Layer status */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {LAYER_STATUSES.map((layer, i) => (
          <AnimatePresence key={layer.label} mode="wait">
            <motion.div
              className="p-1.5 bg-white/3 border border-white/5 rounded flex items-center gap-1.5"
              animate={{ borderColor: layerIdx === i ? 'rgba(112,0,255,0.3)' : 'rgba(255,255,255,0.05)' }}
              transition={{ duration: 0.4 }}
            >
              <Layers className={`w-2.5 h-2.5 ${layer.color}`} />
              <span className="text-[8px] font-mono text-gray-500">{layer.label}:</span>
              <motion.span
                animate={{ opacity: layerIdx === i ? [0.7, 1, 0.7] : 0.5 }}
                transition={{ duration: 1, repeat: Infinity }}
                className={`text-[8px] font-bold font-mono ${layer.color}`}
              >
                {layer.status}
              </motion.span>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </GlassCard>
  );
}
