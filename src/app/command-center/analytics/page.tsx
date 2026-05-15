"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { BarChart3, Brain, MessageCircle, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const AI_INSIGHTS = [
  { id: 1, priority: "HIGH", text: "Customer trust erosion will reach critical threshold in 72h without intervention.", agent: "CEO AI", trend: "down" },
  { id: 2, priority: "MEDIUM", text: "APAC market recovery probability: 84% if sentiment campaign launches within 24h.", agent: "Marketing AI", trend: "up" },
  { id: 3, priority: "HIGH", text: "Infrastructure instability correlates 0.91 with outrage spikes — stabilize first.", agent: "CTO AI", trend: "down" },
  { id: 4, priority: "LOW", text: "Competitor sentiment score dropped 12% — potential opportunity to recapture share.", agent: "Marketing AI", trend: "up" },
  { id: 5, priority: "MEDIUM", text: "Recovery workflows showing 3.2x faster resolution than manual baseline.", agent: "Operations AI", trend: "up" },
];

const SENTIMENT_DATA = [42, 38, 35, 40, 44, 39, 36, 33, 38, 41, 45, 50, 48, 52, 58, 62, 60, 65];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = 60;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - ((v - min) / range) * h} r="2" fill={color} />
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [sentiment, setSentiment] = useState(62);
  const [trustScore, setTrustScore] = useState(71);
  const [escalationProb, setEscalationProb] = useState(28);
  const [forecastData, setForecastData] = useState(SENTIMENT_DATA);

  useEffect(() => {
    const t = setInterval(() => {
      setSentiment(v => Math.max(30, Math.min(90, v + (Math.random() * 4 - 2))));
      setTrustScore(v => Math.max(50, Math.min(95, v + (Math.random() * 2 - 1))));
      setEscalationProb(v => Math.max(5, Math.min(60, v + (Math.random() * 3 - 1.5))));
      setForecastData(prev => [...prev.slice(1), sentiment + Math.random() * 6 - 3]);
    }, 3000);
    return () => clearInterval(t);
  }, [sentiment]);

  return (
    <div className="min-h-screen">
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter">
            GHOST_BOARD // <span className="text-yellow-400">ANALYTICS_INTEL</span>
          </h1>
          <span className="text-[10px] font-mono text-yellow-400/60 tracking-widest uppercase">AI-Powered Predictive Intelligence Engine</span>
        </div>
        <div className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded text-[10px] font-mono text-yellow-400">
          ANALYSIS_MODE: LIVE_PREDICTIVE
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-[1800px] mx-auto">

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              label: "Customer Sentiment Score",
              value: sentiment,
              suffix: "%",
              color: sentiment > 60 ? "text-emerald-500" : "text-orange-500",
              trend: sentiment > 60,
              desc: sentiment > 60 ? "Recovering" : "Declining",
            },
            {
              label: "Customer Trust Index",
              value: trustScore,
              suffix: "%",
              color: trustScore > 70 ? "text-primary" : "text-orange-500",
              trend: trustScore > 70,
              desc: trustScore > 70 ? "Stable" : "Erosion Detected",
            },
            {
              label: "Escalation Probability",
              value: escalationProb,
              suffix: "%",
              color: escalationProb > 40 ? "text-destructive" : "text-emerald-500",
              trend: escalationProb < 40,
              desc: escalationProb > 40 ? "Elevated Risk" : "Under Control",
            },
          ].map((kpi) => (
            <GlassCard key={kpi.label} className="bg-black/60 border-white/10">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">{kpi.label}</div>
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-5xl font-black ${kpi.color}`}>
                    {kpi.value.toFixed(0)}<span className="text-2xl">{kpi.suffix}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.trend
                      ? <TrendingUp className="w-4 h-4 text-emerald-500" />
                      : <TrendingDown className="w-4 h-4 text-destructive" />}
                    <span className={`text-[10px] font-mono ${kpi.trend ? 'text-emerald-500' : 'text-destructive'}`}>{kpi.desc}</span>
                  </div>
                </div>
                <div className="opacity-80">
                  <Sparkline data={forecastData.slice(-10)} color={kpi.trend ? "#10b981" : "#ef4444"} />
                </div>
              </div>
              <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${kpi.value}%` }}
                  className={`h-full ${kpi.trend ? 'bg-emerald-500' : 'bg-destructive'}`}
                />
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Sentiment Trend Chart */}
        <GlassCard className="bg-black/60 border-yellow-400/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-yellow-400" />
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sentiment Recovery Forecast (72h)</h3>
            </div>
            <div className="text-[9px] font-mono text-gray-600">AI-GENERATED PROJECTION</div>
          </div>
          <div className="h-40 flex items-end gap-2 relative px-4">
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              {[100, 75, 50, 25].map(v => (
                <div key={v} className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-gray-700 w-6 text-right">{v}</span>
                  <div className="flex-1 border-t border-white/5" />
                </div>
              ))}
            </div>
            {forecastData.map((v, i) => {
              const isProjection = i >= forecastData.length - 5;
              return (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t relative"
                  style={{ height: `${v}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${v}%` }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                >
                  <div className={`absolute inset-0 rounded-t ${
                    isProjection
                      ? 'bg-yellow-400/20 border-t border-yellow-400/40 border-x border-x-yellow-400/20'
                      : 'bg-primary/30'
                  }`} />
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-end gap-4 mt-2">
            <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
              <div className="w-3 h-1 bg-primary/50 rounded" /> Historical
            </div>
            <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
              <div className="w-3 h-1 bg-yellow-400/40 rounded" /> AI Forecast
            </div>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="bg-black/60 border-yellow-400/10">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-4 h-4 text-yellow-400" />
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI-Generated Executive Intelligence Reports</h3>
          </div>
          <div className="space-y-4">
            {AI_INSIGHTS.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white/3 border border-white/5 rounded-lg hover:border-yellow-400/20 transition-colors"
              >
                <div className={`px-2 py-0.5 rounded text-[8px] font-black flex-shrink-0 ${
                  insight.priority === 'HIGH' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                  insight.priority === 'MEDIUM' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                  'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>{insight.priority}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-200">{insight.text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MessageCircle className="w-3 h-3 text-gray-600" />
                    <span className="text-[9px] font-mono text-gray-600">{insight.agent}</span>
                    {insight.trend === 'up'
                      ? <TrendingUp className="w-3 h-3 text-emerald-500 ml-2" />
                      : <TrendingDown className="w-3 h-3 text-destructive ml-2" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
