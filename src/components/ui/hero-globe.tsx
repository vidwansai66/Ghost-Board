"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Business metrics that float around the globe
const METRICS = [
  { label: "Revenue",   value: "$4.8B",   color: "#00f2ff",  x: -220, y: -80  },
  { label: "AI Ops",    value: "1,248",   color: "#7000ff",  x: 200,  y: -60  },
  { label: "Uptime",    value: "99.98%",  color: "#10b981",  x: -200, y: 60   },
  { label: "Decisions", value: "48k/s",   color: "#00f2ff",  x: 210,  y: 80   },
  { label: "Trust",     value: "94.2%",   color: "#f59e0b",  x: 0,    y: -200 },
];

// SVG-based globe latitude/longitude grid lines
const LAT_LINES = [-60, -30, 0, 30, 60];
const LON_LINES = [0, 30, 60, 90, 120, 150];

// Animated data nodes on the globe surface
const DATA_NODES = [
  { angle: 30,  lat: 20,  color: "#00f2ff" },
  { angle: 110, lat: -10, color: "#7000ff" },
  { angle: 200, lat: 40,  color: "#10b981" },
  { angle: 280, lat: -30, color: "#00f2ff" },
  { angle: 330, lat: 10,  color: "#f59e0b" },
  { angle: 60,  lat: -50, color: "#7000ff" },
];

// Connection arcs between nodes (pairs of node indices)
const ARCS = [
  [0, 2], [1, 3], [2, 4], [0, 5], [3, 5],
];

function nodeToXY(angle: number, lat: number, r: number) {
  const rLatScale = Math.cos((lat * Math.PI) / 180);
  const x = r * rLatScale * Math.cos(((angle - 90) * Math.PI) / 180);
  const y = r * Math.sin((lat * Math.PI) / 180);
  return { x, y };
}

export function HeroGlobe() {
  const [mounted, setMounted] = useState(false);
  const [globeRotation, setGlobeRotation] = useState(0);
  const [pulseNodes, setPulseNodes] = useState<Set<number>>(new Set());
  const [metrics, setMetrics] = useState(METRICS);
  const [activeArc, setActiveArc] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    // Smooth globe rotation via RAF
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      setGlobeRotation((elapsed / 60000) * 360); // full rotation every 60s
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Pulse random nodes
    const pulseInterval = setInterval(() => {
      const n = Math.floor(Math.random() * DATA_NODES.length);
      setPulseNodes(prev => { const s = new Set(prev); s.add(n); return s; });
      setTimeout(() => setPulseNodes(prev => { const s = new Set(prev); s.delete(n); return s; }), 800);
    }, 800);

    // Cycle active arc
    const arcInterval = setInterval(() => {
      setActiveArc(a => (a + 1) % ARCS.length);
    }, 1200);

    // Animate metric counters slightly
    const metricInterval = setInterval(() => {
      setMetrics(prev => prev.map((m, i) => {
        if (i === 0) return { ...m, value: `$${(4.8 + Math.random() * 0.1 - 0.05).toFixed(1)}B` };
        if (i === 1) return { ...m, value: `${1248 + Math.floor(Math.random() * 10 - 5)}` };
        return m;
      }));
    }, 2000);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(pulseInterval);
      clearInterval(arcInterval);
      clearInterval(metricInterval);
    };
  }, []);

  const R = 180; // globe radius in SVG units

  // Get node screen positions based on current rotation
  const nodePositions = DATA_NODES.map(n => nodeToXY(n.angle + globeRotation, n.lat, R));

  if (!mounted) return <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px]" />;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 600, height: 600 }}>
      {/* Glow backdrop */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-primary/20 blur-[80px]"
      />

      {/* === MAIN GLOBE SVG === */}
      <svg
        width={600}
        height={600}
        viewBox="-300 -300 600 600"
        className="relative z-10"
      >
        <defs>
          <radialGradient id="globeGrad" cx="35%" cy="35%">
            <stop offset="0%"  stopColor="#0a1628" stopOpacity="1" />
            <stop offset="70%" stopColor="#050d1a" stopOpacity="1" />
            <stop offset="100%" stopColor="#000508" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="glowGrad" cx="35%" cy="35%">
            <stop offset="0%"  stopColor="#00f2ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx="0" cy="0" r={R} />
          </clipPath>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Globe base sphere */}
        <circle cx="0" cy="0" r={R} fill="url(#globeGrad)" />
        <circle cx="0" cy="0" r={R} fill="url(#glowGrad)" />

        {/* Latitude grid lines (clipped) */}
        <g clipPath="url(#globeClip)" opacity="0.25">
          {LAT_LINES.map(lat => {
            const ry = R * Math.sin((lat * Math.PI) / 180);
            const rx = R * Math.cos((lat * Math.PI) / 180);
            return (
              <ellipse key={lat} cx="0" cy={-ry} rx={rx} ry={rx * 0.15}
                fill="none" stroke="#00f2ff" strokeWidth="0.5" />
            );
          })}
          {/* Longitude grid lines rotating */}
          {LON_LINES.map(lon => {
            const angle = lon + globeRotation;
            const rad = (angle * Math.PI) / 180;
            return (
              <ellipse
                key={lon}
                cx="0" cy="0"
                rx={Math.abs(Math.cos(rad)) * R * 0.15 + 0.5}
                ry={R}
                fill="none"
                stroke="#00f2ff"
                strokeWidth="0.4"
                transform={`rotate(${angle})`}
              />
            );
          })}
        </g>

        {/* Globe rim glow */}
        <circle cx="0" cy="0" r={R} fill="none" stroke="#00f2ff" strokeWidth="1.5" opacity="0.4" />
        <circle cx="0" cy="0" r={R - 4} fill="none" stroke="#00f2ff" strokeWidth="0.5" opacity="0.15" />

        {/* Highlight sheen */}
        <ellipse cx="-50" cy="-60" rx="60" ry="40" fill="white" opacity="0.04" />

        {/* Connection arcs between data nodes */}
        {ARCS.map(([a, b], i) => {
          const pa = nodePositions[a];
          const pb = nodePositions[b];
          const mx = (pa.x + pb.x) / 2;
          const my = (pa.y + pb.y) / 2 - 40;
          const isActive = activeArc === i;
          return (
            <g key={i} clipPath="url(#globeClip)">
              <path
                d={`M${pa.x},${pa.y} Q${mx},${my} ${pb.x},${pb.y}`}
                fill="none"
                stroke={isActive ? "#00f2ff" : "#7000ff"}
                strokeWidth={isActive ? "1.5" : "0.7"}
                strokeDasharray={isActive ? "none" : "4 4"}
                opacity={isActive ? 0.9 : 0.3}
              />
              {/* Animated particle along arc */}
              {isActive && (
                <motion.circle
                  r="3"
                  fill="#00f2ff"
                  filter="url(#nodeGlow)"
                  initial={{ offsetDistance: "0%" } as any}
                >
                  <animateMotion
                    dur="1.2s"
                    repeatCount="indefinite"
                    path={`M${pa.x},${pa.y} Q${mx},${my} ${pb.x},${pb.y}`}
                  />
                </motion.circle>
              )}
            </g>
          );
        })}

        {/* Data nodes on globe surface */}
        {DATA_NODES.map((node, i) => {
          const { x, y } = nodePositions[i];
          const isPulsing = pulseNodes.has(i);
          return (
            <g key={i} clipPath="url(#globeClip)">
              {/* Pulse ring */}
              {isPulsing && (
                <motion.circle
                  cx={x} cy={y} fill="none"
                  stroke={node.color}
                  strokeWidth="1"
                  initial={{ r: 4, opacity: 0.8 }}
                  animate={{ r: 18, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}
              {/* Node core */}
              <circle cx={x} cy={y} r="4" fill={node.color} opacity="0.9" filter="url(#nodeGlow)" />
              <circle cx={x} cy={y} r="2" fill="white" opacity="0.8" />
            </g>
          );
        })}
      </svg>

      {/* === ORBITING RINGS (outside globe) === */}
      {/* Ring 1: equatorial */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-primary/30"
        style={{ margin: -20 }}
      >
        {/* Ring dot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#00f2ff]" />
      </motion.div>

      {/* Ring 2: tilted */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border border-secondary/20"
        style={{ 
          width: "calc(100% + 60px)", height: "calc(100% + 60px)",
          top: "-30px", left: "-30px",
          transform: "rotateX(65deg)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 rounded-full bg-secondary shadow-[0_0_12px_#7000ff]" />
      </motion.div>

      {/* Ring 3: perpendicular */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border border-primary/15"
        style={{
          width: "calc(100% + 100px)", height: "calc(100% + 100px)",
          top: "-50px", left: "-50px",
          transform: "rotateY(60deg)",
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#3b82f6]" />
      </motion.div>

      {/* === FLOATING BUSINESS METRIC CARDS === */}
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: i * 0.2 + 0.5, duration: 0.6 },
            scale:   { delay: i * 0.2 + 0.5, duration: 0.6 },
            y: { delay: i * 0.3, duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute flex flex-col items-center backdrop-blur-md rounded-lg px-3 py-2 border"
          style={{
            left: `calc(50% + ${metric.x}px)`,
            top: `calc(50% + ${metric.y}px)`,
            transform: "translate(-50%, -50%)",
            borderColor: `${metric.color}30`,
            backgroundColor: `${metric.color}08`,
            boxShadow: `0 0 20px ${metric.color}15`,
          }}
        >
          <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: `${metric.color}99` }}>
            {metric.label}
          </span>
          <span className="text-sm font-black" style={{ color: metric.color }}>
            {metric.value}
          </span>
        </motion.div>
      ))}

      {/* === CENTER CORE PULSE === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-6 h-6 rounded-full bg-primary blur-sm"
        />
      </div>
    </div>
  );
}
