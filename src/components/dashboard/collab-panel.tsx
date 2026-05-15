"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Terminal, Wifi, Building2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ENTERPRISE_CONFIG } from "@/constants/enterprise";

const CONVERSATION_CHAINS = [
  [
    { agent: "Marketing AI",  color: "text-secondary",    bg: "bg-secondary/10",  icon: "📊", content: "NovaPay sentiment index dropped 18pts. Real-time trust erosion confirmed. Initiating emergency engagement protocol." },
    { agent: "CTO AI",        color: "text-primary",      bg: "bg-primary/10",    icon: "⚙️", content: "NovaPay infrastructure instability confirmed. Tokyo cluster latency at 1,240ms. Neural fabric degradation at 23%. Rerouting initiated." },
    { agent: "Operations AI", color: "text-orange-500",   bg: "bg-orange-500/10", icon: "🔄", content: "Recovery workflows deployed. Singapore cluster absorbing 40% overflow. Autonomous logistics chain unaffected. ETA stabilization: 6 minutes." },
    { agent: "CEO AI",        color: "text-white",        bg: "bg-white/5",       icon: "👁️", content: "Prioritize operational stabilization. Expansion protocols suspended. Crisis Alpha-7 engaged. All divisions: maximum resource allocation." },
    { agent: "Security AI",   color: "text-destructive",  bg: "bg-destructive/10",icon: "🔐", content: "No breach indicators detected. Zero-trust sweep complete. System integrity at 99.97%. Anomaly watch escalated to Tier-2." },
    { agent: "HR AI",         color: "text-emerald-500",  bg: "bg-emerald-500/10",icon: "🧠", content: "Compute rebalanced — 38% reallocated from dormant agents to crisis cluster. Neural coordination index: peak performance." },
  ],
  [
    { agent: "CTO AI",        color: "text-primary",      bg: "bg-primary/10",    icon: "⚙️", content: "Tokyo node recovery at 68%. Latency trending down to 340ms. Full SLA restoration projected in 3 minutes 45 seconds." },
    { agent: "Marketing AI",  color: "text-secondary",    bg: "bg-secondary/10",  icon: "📊", content: "Deploying APAC sentiment reversal campaign. Holographic asset cascade activated across 14 regional nodes. Positive drift detected." },
    { agent: "CEO AI",        color: "text-white",        bg: "bg-white/5",       icon: "👁️", content: "Recovery trajectory nominal. Maintain crisis posture until global stability index exceeds 97.5%. Authorized Phase-2 reactivation." },
    { agent: "Security AI",   color: "text-destructive",  bg: "bg-destructive/10",icon: "🔐", content: "Anomalous login cluster detected — Frankfurt subnet. Pattern classified as probe attempt. Neutralized. No lateral movement detected." },
    { agent: "Operations AI", color: "text-orange-500",   bg: "bg-orange-500/10", icon: "🔄", content: "Recovery chain at 82%. Autonomous drone logistics resumed. Supply chain reestablished across 9 distribution hubs." },
  ],
  [
    { agent: "HR AI",         color: "text-emerald-500",  bg: "bg-emerald-500/10",icon: "🧠", content: "Crisis performance analysis complete. Agent efficiency delta: +14.2%. Neural coordination achieved record throughput during Alpha-7." },
    { agent: "CTO AI",        color: "text-primary",      bg: "bg-primary/10",    icon: "⚙️", content: "NovaPay infrastructure fully recovered. All clusters within SLA thresholds. Performance nominal. Post-incident hardening scheduled." },
    { agent: "Marketing AI",  color: "text-secondary",    bg: "bg-secondary/10",  icon: "📊", content: "Sentiment fully recovered. APAC trust score +11 points. Brand resonance index climbing. Q3 forecast upgraded by 8%." },
    { agent: "CEO AI",        color: "text-white",        bg: "bg-white/5",       icon: "👁️", content: "Crisis Alpha-7 deactivated. Standard operations resumed. Exceptional cross-division coordination logged. Archiving to neural memory." },
  ],
  [
    { agent: "Security AI",   color: "text-destructive",  bg: "bg-destructive/10",icon: "🔐", content: "Scheduled quantum key rotation complete. All 6 executive channels re-encrypted. New entropy seed applied. Security posture: OPTIMAL." },
    { agent: "Marketing AI",  color: "text-secondary",    bg: "bg-secondary/10",  icon: "📊", content: "Q3 neural campaign assets queued. Predictive engagement model outputs 34% conversion uplift. Deployment window: T-minus 2 hours." },
    { agent: "HR AI",         color: "text-emerald-500",  bg: "bg-emerald-500/10",icon: "🧠", content: "Onboarding 3 new sub-agents to Operations division. Neural calibration in progress. Integration ETA: 47 minutes." },
    { agent: "CTO AI",        color: "text-primary",      bg: "bg-primary/10",    icon: "⚙️", content: "EMEA cluster scaling by 200 nodes. Pre-emptive Q3 surge allocation. Cross-region mesh topology optimized. Latency reduced 12ms." },
    { agent: "CEO AI",        color: "text-white",        bg: "bg-white/5",       icon: "👁️", content: "Expansion authorized. Autonomous growth protocol active. Fiscal efficiency index: 94.2%. Projecting record Q3 throughput." },
  ],
  [
    { agent: "Operations AI", color: "text-orange-500",   bg: "bg-orange-500/10", icon: "🔄", content: "Autonomous supply chain renegotiation complete. 12 vendor contracts re-optimized via price prediction model. Savings: $2.4M projected." },
    { agent: "CEO AI",        color: "text-white",        bg: "bg-white/5",       icon: "👁️", content: "Authorizing neural budget reallocation. Marketing and CTO divisions receive priority compute. HR optimization deferred to Cycle-8." },
    { agent: "Security AI",   color: "text-destructive",  bg: "bg-destructive/10",icon: "🔐", content: "Perimeter defense upgraded. 47 new threat signatures integrated. Behavioral analytics model retrained on 3.2B new data points." },
    { agent: "Marketing AI",  color: "text-secondary",    bg: "bg-secondary/10",  icon: "📊", content: "Global sentiment index: 89.4. Trending upward. Autonomous engagement models performing 22% above baseline across all markets." },
  ],
];

interface Message {
  id: string;
  agent: string;
  color: string;
  bg: string;
  icon: string;
  content: string;
  timestamp: string;
  signalStrength: number;
}

export function CollabPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [typingColor, setTypingColor] = useState("text-primary");
  const [mounted, setMounted] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [signalPulse, setSignalPulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef(0);
  const msgIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleNext = () => {
    const chain = CONVERSATION_CHAINS[chainRef.current];
    const msg = chain[msgIndexRef.current];
    const typingDelay = 1000 + Math.random() * 1600;
    const readingDelay = 1400 + Math.random() * 1000;

    timeoutRef.current = setTimeout(() => {
      setTypingAgent(msg.agent);
      setTypingColor(msg.color);

      timeoutRef.current = setTimeout(() => {
        setTypingAgent(null);
        setSignalPulse(true);
        setTimeout(() => setSignalPulse(false), 600);

        const now = new Date();
        const newMsg: Message = {
          ...msg,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: now.toLocaleTimeString("en-US", { hour12: false }),
          signalStrength: Math.floor(Math.random() * 3) + 2,
        };
        setMessages(prev => [...prev.slice(-16), newMsg]);
        setMsgCount(c => c + 1);

        msgIndexRef.current += 1;
        if (msgIndexRef.current >= chain.length) {
          msgIndexRef.current = 0;
          chainRef.current = (chainRef.current + 1) % CONVERSATION_CHAINS.length;
          timeoutRef.current = setTimeout(scheduleNext, 4000 + Math.random() * 2000);
        } else {
          timeoutRef.current = setTimeout(scheduleNext, 2000 + Math.random() * 1500);
        }
      }, readingDelay);
    }, typingDelay);
  };

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const seed = CONVERSATION_CHAINS[0][0];
    setMessages([{
      ...seed,
      id: "seed-1",
      timestamp: now.toLocaleTimeString("en-US", { hour12: false }),
      signalStrength: 4,
    }]);
    setMsgCount(1);
    timeoutRef.current = setTimeout(scheduleNext, 1500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingAgent]);

  return (
    <GlassCard className="h-full flex flex-col p-0 bg-black/50 border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold tracking-widest uppercase">{ENTERPRISE_CONFIG.companyName} Intelligence Feed</h3>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary">
            COORD_ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-gray-600">{msgCount} MSGS</span>
          <motion.div
            animate={{ opacity: signalPulse ? [1, 0.2, 1] : [1, 0.4, 1], scale: signalPulse ? [1, 1.4, 1] : 1 }}
            transition={{ duration: signalPulse ? 0.4 : 1.4, repeat: signalPulse ? 0 : Infinity }}
            className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          />
          <span className="text-[10px] font-mono text-gray-500">ENCRYPTED</span>
        </div>
      </div>

      {/* Active agents row */}
      <div className="flex gap-2 px-4 py-2 bg-black/20 border-b border-white/5 flex-shrink-0 overflow-x-auto">
        {["CEO AI","CTO AI","Mkt AI","Ops AI","Sec AI","HR AI"].map((a, i) => (
          <div key={a} className="flex items-center gap-1.5 flex-shrink-0">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
              className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : i === 1 ? 'bg-primary' : i === 2 ? 'bg-secondary' : i === 3 ? 'bg-orange-500' : i === 4 ? 'bg-destructive' : 'bg-emerald-500'}`}
            />
            <span className="text-[8px] font-mono text-gray-600 whitespace-nowrap">{a}</span>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-4 custom-scrollbar min-h-0">
        <AnimatePresence initial={false}>
          {mounted && messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">{msg.icon}</span>
                  <span className={`text-[10px] font-black tracking-tight ${msg.color}`}>{msg.agent}</span>
                  <div className="flex gap-0.5 ml-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div key={i} className={`w-0.5 rounded-full ${i < msg.signalStrength ? msg.color.replace('text-','bg-') : 'bg-white/10'}`} style={{ height: `${6 + i * 2}px`, marginTop: 'auto' }} />
                    ))}
                  </div>
                </div>
                <span className="text-[9px] text-gray-700 font-mono">[{msg.timestamp}]</span>
              </div>
              <div className={`${msg.bg} border border-white/5 p-2.5 rounded-lg relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-0.5 h-full ${msg.color.replace('text-', 'bg-')}`} />
                <p className="text-[11px] text-gray-300 leading-relaxed font-mono pl-2">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {typingAgent && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1"
            >
              <span className={`text-[10px] font-black ${typingColor}`}>{typingAgent}</span>
              <div className="bg-white/3 border border-white/5 px-4 py-3 rounded-lg flex items-center gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                    className={`w-1.5 h-1.5 rounded-full ${typingColor.replace('text-', 'bg-')}`}
                  />
                ))}
                <span className={`text-[9px] font-mono ${typingColor} opacity-60 ml-1`}>composing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0 bg-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3 text-primary opacity-60" />
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="text-[9px] font-mono text-primary/60"
            >_</motion.span>
            <span className="text-[9px] font-mono text-gray-600">Autonomous AI coordination active</span>
          </div>
          <div className="text-[9px] font-mono text-gray-700">AES-256 ENCRYPTED</div>
        </div>
      </div>
    </GlassCard>
  );
}
