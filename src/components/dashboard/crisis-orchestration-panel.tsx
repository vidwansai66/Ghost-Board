"use client";

/**
 * GHOST BOARD — Crisis Orchestration Panel
 * Live n8n integration surface with elapsed timer and step progress for slow agentic workflows.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CheckCircle2, Loader2, Play, RefreshCcw,
  Send, Siren, Shield, Zap, RotateCcw, XCircle, Clock, Cpu,
  Terminal, Activity, ListChecks, History, Info, ChevronRight, Gauge,
  ShieldAlert, Target, Workflow, Server, BarChart3, Binary, ZapOff,
  Database, Globe
} from "lucide-react";
import { useOrchestration } from "@/context/orchestration-context";
import { CrisisPayload } from "@/hooks/use-crisis-orchestration";
import { ENTERPRISE_CONFIG } from "@/constants/enterprise";
import { GlassCard } from "@/components/ui/glass-card";

// ─── Configuration Options ────────────────────────────────────────────────────

const CRISIS_TYPES = [
  { value: "payment failure", label: "Payment Failure", icon: "💳" },
  { value: "security breach", label: "Security Breach", icon: "🔓" },
  { value: "infrastructure outage", label: "Infrastructure Outage", icon: "🖥️" },
  { value: "supply chain disruption", label: "Supply Chain Disruption", icon: "📦" },
  { value: "data breach", label: "Data Breach", icon: "🗄️" },
  { value: "market crash", label: "Market Crash", icon: "📉" },
];

const SEVERITIES = [
  { value: "low", label: "LOW", color: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10" },
  { value: "medium", label: "MEDIUM", color: "border-yellow-500/50  text-yellow-500  bg-yellow-500/10" },
  { value: "high", label: "HIGH", color: "border-orange-500/50  text-orange-500  bg-orange-500/10" },
  { value: "critical", label: "CRITICAL", color: "border-destructive/50 text-destructive bg-destructive/10" },
];

const SENTIMENTS = [
  { value: "positive", label: "POSITIVE" },
  { value: "neutral", label: "NEUTRAL" },
  { value: "negative", label: "NEGATIVE" },
  { value: "extremely negative", label: "EXTREME NEG." },
];

const SYSTEM_STATUSES = [
  { value: "stable", label: "STABLE" },
  { value: "degraded", label: "DEGRADED" },
  { value: "unstable", label: "UNSTABLE" },
  { value: "critical", label: "CRITICAL" },
];

const ACTION_BUTTONS = [
  { mode: "simulate", label: "SIMULATE CRISIS", icon: <Siren className="w-4 h-4" />, color: "border-orange-500/50 text-orange-500   hover:bg-orange-500/10" },
  { mode: "execute", label: "EXECUTE SCENARIO", icon: <Play className="w-4 h-4" />, color: "border-primary/50   text-primary      hover:bg-primary/10" },
  { mode: "coordinate", label: "RUN COORDINATION", icon: <Zap className="w-4 h-4" />, color: "border-secondary/50 text-secondary    hover:bg-secondary/10" },
  { mode: "recover", label: "LAUNCH RECOVERY", icon: <Shield className="w-4 h-4" />, color: "border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10" },
];

// n8n agentic pipeline steps shown during waiting
const N8N_STEPS = [
  { label: "Webhook received", ms: 0 },
  { label: "Parsing crisis context", ms: 1500 },
  { label: "Routing to AI executives", ms: 4000 },
  { label: "LLM reasoning in progress", ms: 8000 },
  { label: "Synthesizing executive outputs", ms: 20000 },
  { label: "Compiling final report", ms: 40000 },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function OptionButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-widest uppercase transition-all duration-200 cursor-pointer ${active
        ? "border-primary/70 bg-primary/20 text-primary shadow-[0_0_12px_rgba(0,242,255,0.2)]"
        : "border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300"
        }`}
    >
      {children}
    </button>
  );
}

function StructuredMarkdown({ text }: { text: string }) {
  // Simple markdown-to-JSX parser
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let inTable = false;
  let tableRows: string[][] = [];

  const flushList = () => {
    if (listType === "ul") {
      elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-2 text-gray-400">{currentList}</ul>);
    } else if (listType === "ol") {
      elements.push(<ol key={`ol-${elements.length}`} className="list-decimal pl-5 space-y-1 my-2 text-gray-400">{currentList}</ol>);
    }
    currentList = [];
    listType = null;
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="my-3 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-[10px] text-left border-collapse">
            <thead className="bg-white/5 font-black uppercase tracking-widest text-gray-500">
              <tr>
                {tableRows[0].map((cell, i) => (
                  <th key={i} className="px-3 py-2 border-b border-white/10">{cell.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tableRows.slice(1).filter(row => !row.every(c => c.includes('---'))).map((row, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-gray-300">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableRows = [];
    inTable = false;
  };

  const parseInline = (line: string) => {
    // Basic bold and italic
    let processed = line
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-primary/80">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-primary font-mono">$1</code>');
    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***") {
      flushList(); flushTable();
      elements.push(<hr key={idx} className="my-4 border-white/10" />);
      return;
    }

    // Table Detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      inTable = true;
      tableRows.push(trimmed.split("|").filter((_, i, arr) => i > 0 && i < arr.length - 1));
      return;
    } else if (inTable) {
      flushTable();
    }

    // List Detection
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      currentList.push(<li key={idx} className="text-[11px]">{parseInline(trimmed.substring(2))}</li>);
      return;
    } else if (trimmed.match(/^\d+\.\s/)) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      currentList.push(<li key={idx} className="text-[11px]">{parseInline(trimmed.replace(/^\d+\.\s/, ""))}</li>);
      return;
    } else if (listType) {
      flushList();
    }

    // Empty lines
    if (!trimmed) {
      elements.push(<div key={idx} className="h-1" />);
      return;
    }

    // Default Paragraph
    elements.push(<p key={idx} className="text-[11px] leading-snug text-gray-400">{parseInline(trimmed)}</p>);
  });

  flushList(); flushTable();
  return <div className="space-y-0.5">{elements}</div>;
}

function RiskBadge({ level }: { level: string }) {
  const normalized = level.toUpperCase().trim();
  const colors: Record<string, string> = {
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CRITICAL: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded border text-[8px] font-black tracking-widest ${colors[normalized] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
      {normalized}
    </span>
  );
}

function SummaryCard({ body }: { body: string }) {
  return (
    <div className="relative group overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="relative p-3 rounded-xl border border-primary/20 bg-black/40 shadow-[0_0_20px_rgba(0,242,255,0.03)] transition-all">
        <div className="flex gap-3">
          <div className="w-1 h-auto bg-primary/40 rounded-full" />
          <div className="flex-1">
            <StructuredMarkdown text={body} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityAlerts({ body }: { body: string }) {
  const items = body.split(/\n[-*]\s+/).filter(Boolean).map(item => {
    const match = item.match(/\[(CRITICAL|HIGH|MEDIUM|LOW)\]/i);
    const level = match ? match[1] : "MEDIUM";
    const text = item.replace(/\[.*?\]/g, "").trim();
    return { level, text };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg border border-white/5 bg-white/3 group hover:border-white/20 transition-all">
          <RiskBadge level={item.level} />
          <div className="flex-1 min-w-0">
            <StructuredMarkdown text={item.text} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PipelineView({ body }: { body: string }) {
  const steps = body.split(/\n\d+\.\s/).filter(Boolean);
  return (
    <div className="relative pl-7 space-y-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-secondary/50 before:to-transparent">
      {steps.map((step, i) => (
        <div key={i} className="relative group">
          <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-lg border border-secondary/30 bg-black flex items-center justify-center z-10 group-hover:border-secondary transition-colors">
            <span className="text-[9px] font-mono text-secondary">{i + 1}</span>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm group-hover:bg-secondary/5 transition-all">
            <StructuredMarkdown text={step} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalysisGrid({ body }: { body: string }) {
  const lines = body.split("\n").filter(l => l.includes(":")).map(l => {
    const [key, val] = l.split(":").map(s => s.trim());
    return { key, val };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {lines.map((line, i) => (
        <div key={i} className="p-2 rounded-lg border border-white/5 bg-black/20 text-center space-y-0.5">
          <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{line.key}</div>
          <div className="text-[10px] font-black text-primary tracking-tighter">{line.val}</div>
        </div>
      ))}
    </div>
  );
}

function StabilizationMetrics({ body }: { body: string }) {
  const metrics = body.split("\n").filter(l => l.includes(":")).reduce((acc: any, l) => {
    const [key, val] = l.split(":").map(s => s.trim());
    acc[key.toLowerCase()] = val;
    return acc;
  }, {});

  const items = [
    { label: "ETA", value: metrics["eta"] || "PENDING", icon: Clock },
    { label: "CONFIDENCE", value: metrics["confidence"] || "90%", icon: Target },
    { label: "MONITORING", value: metrics["monitoring"] || "ACTIVE", icon: Activity },
    { label: "AUTOMATION", value: metrics["automation"] || "STABLE", icon: Binary },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item, i) => (
        <div key={i} className="p-2 rounded-xl border border-primary/10 bg-primary/5 text-center">
          <item.icon className="w-3 h-3 text-primary/60 mx-auto mb-1" />
          <div className="text-[7px] font-mono text-gray-500 uppercase">{item.label}</div>
          <div className="text-[10px] font-black text-primary">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function OperationalFeed({ body }: { body: string }) {
  const updates = body.split("\n").filter(Boolean);
  return (
    <div className="rounded-xl border border-white/5 bg-black/60 p-3 font-mono text-[9px] space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
      {updates.map((update, i) => (
        <div key={i} className="flex gap-2 text-gray-500">
          <span className="text-primary/50 opacity-50">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
          <span className="text-gray-300">{update.replace(/^[-*]\s+/, "")}</span>
        </div>
      ))}
    </div>
  );
}

function IntelligencePanel({ title, body, icon: Icon = Info, color = "text-gray-500" }: { title: string, body: string, icon?: any, color?: string }) {
  return (
    <div className="space-y-1.5">
      <div className={`text-[9px] font-black ${color} uppercase tracking-[0.2em] flex items-center gap-2`}>
        <Icon className="w-3 h-3" /> {title}
      </div>
      <div className="p-3.5 rounded-xl border border-white/5 bg-white/2 group hover:border-white/10 transition-all">
        <StructuredMarkdown text={body} />
      </div>
    </div>
  );
}

function CommandCenterRenderer({ content }: { content: string }) {
  // Support ## headers OR numbered bold headers **1. Title**
  let sections = content.split(/#{1,2}\s+/).filter(Boolean).map(s => {
    const lines = s.split("\n");
    const title = lines[0].trim();
    const body = lines.slice(1).join("\n").trim();
    return { title, body };
  });

  // If no ## headers found, try to split by bold numbered sections **1. Title**
  if (sections.length <= 1) {
    const boldSections = content.split(/\*\*\d+\.\s+(.*?)\*\*/).filter(Boolean);
    if (boldSections.length > 1) {
      const newSections = [];
      // Handle potential intro text (text before the first **1. Title**)
      let startIndex = 0;
      if (!content.trim().startsWith("**1.")) {
        newSections.push({ title: "Strategic Overview", body: boldSections[0].trim() });
        startIndex = 1;
      }
      
      for (let i = startIndex; i < boldSections.length; i += 2) {
        if (i + 1 < boldSections.length) {
          newSections.push({ title: boldSections[i].trim(), body: boldSections[i+1].trim() });
        } else {
          // If odd number remains, append to last body or create final summary
          if (newSections.length > 0) {
            newSections[newSections.length - 1].body += "\n\n" + boldSections[i].trim();
          } else {
            newSections.push({ title: "Intelligence Summary", body: boldSections[i].trim() });
          }
        }
      }
      sections = newSections;
    }
  }

  if (sections.length === 0) return <SummaryCard body={content} />;

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const title = section.title.toLowerCase();
        
        // 1. SUMMARY / DIRECTIVES
        if (title.includes("summary") || title.includes("overview") || title.includes("directive") || title.includes("goal")) {
          return <SummaryCard key={idx} body={section.body} />;
        }
        
        // 2. PRIORITIES / RISKS / THREATS
        if (title.includes("priorit") || title.includes("risk") || title.includes("threat") || title.includes("alert") || title.includes("protocol")) {
          return (
            <div key={idx} className="space-y-1.5">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldAlert className="w-3 h-3" /> {section.title}
              </div>
              <PriorityAlerts body={section.body} />
            </div>
          );
        }
        
        // 3. PIPELINE / ACTIONS / STRATEGY
        if (title.includes("pipeline") || title.includes("action") || title.includes("step") || title.includes("strategy") || title.includes("roadmap") || title.includes("execution") || title.includes("recovery")) {
          return (
            <div key={idx} className="space-y-2">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Workflow className="w-3 h-3" /> {section.title}
              </div>
              <PipelineView body={section.body} />
            </div>
          );
        }
        
        // 4. ANALYSIS / TECHNICAL / INFRASTRUCTURE
        if (title.includes("analysis") || title.includes("technical") || title.includes("health") || title.includes("infra") || title.includes("data") || title.includes("gateway") || title.includes("database") || title.includes("specs")) {
          return (
            <div key={idx} className="space-y-1.5">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Server className="w-3 h-3" /> {section.title}
              </div>
              <AnalysisGrid body={section.body} />
            </div>
          );
        }
        
        // 5. STABILIZATION / METRICS / STATUS
        if (title.includes("stabiliz") || title.includes("metrics") || title.includes("eta") || title.includes("status") || title.includes("confidence")) {
          return (
            <div key={idx} className="space-y-1.5">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-3 h-3" /> {section.title}
              </div>
              <StabilizationMetrics body={section.body} />
            </div>
          );
        }
        
        // 6. OPERATIONAL FEED / LOGS
        if (title.includes("feed") || title.includes("update") || title.includes("live") || title.includes("log") || title.includes("transmission")) {
          return (
            <div key={idx} className="space-y-1.5">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-3 h-3" /> {section.title}
              </div>
              <OperationalFeed body={section.body} />
            </div>
          );
        }

        // 7. INTELLIGENCE PANEL (Fallback for CEO, Security specific headers)
        return (
          <IntelligencePanel 
            key={idx} 
            title={section.title} 
            body={section.body} 
            icon={title.includes("ceo") ? Target : title.includes("security") ? Shield : title.includes("cto") ? Binary : Info}
            color={title.includes("ceo") ? "text-white" : title.includes("security") ? "text-destructive" : "text-gray-500"}
          />
        );
      })}
    </div>
  );
}

function ExecutiveResponseCard({ response }: {
  response: { id: string; name: string; role: string; icon: string; color: string; content: string; arrivedAt: number };
}) {
  const timestamp = new Date(response.arrivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  
  // Try to detect severity from content
  const severity = response.content.toLowerCase().includes("critical") ? "CRITICAL" 
                 : response.content.toLowerCase().includes("high") ? "HIGH" 
                 : response.content.toLowerCase().includes("medium") ? "MEDIUM" 
                 : "LOW";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative p-0.5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl group overflow-hidden">
        {/* Animated Glow */}
        <div className="absolute -inset-40 bg-[radial-gradient(circle_at_center,var(--glow-color)_0%,transparent_60%)] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none"
             style={{ '--glow-color': response.color.includes('primary') ? '#00f2ff' : response.color.includes('secondary') ? '#7000ff' : '#ffffff' } as any} />

        <div className="relative p-4 space-y-4">
          {/* Executive Intelligence Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-xl transition-all duration-500">
                {response.icon}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                </motion.div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-black tracking-tighter ${response.color}`}>{response.name}</h3>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 tracking-tight uppercase">
                  <Terminal className="w-3 h-3" /> {response.role}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-mono text-gray-600 uppercase">Severity</span>
                <RiskBadge level={severity} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[7px] font-mono text-gray-600 uppercase">Sync</span>
                <div className="text-[10px] font-black text-white/50 tracking-tight flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {timestamp}
                </div>
              </div>
            </div>
          </div>

          {/* Premium Panel Content */}
          <CommandCenterRenderer content={response.content} />

          {/* Environment Metadata Footer */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[7px] font-mono text-gray-700 uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Database className="w-2.5 h-2.5" /> ID: {ENTERPRISE_CONFIG.enterpriseId}</span>
              <span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> REGION: {ENTERPRISE_CONFIG.region}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>INFRA: {ENTERPRISE_CONFIG.infrastructure}</span>
              <span className="text-emerald-500/50">AUTONOMOUS_COORD_ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Live elapsed timer hook */
function useElapsedTimer(active: boolean, startedAt: number | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active || !startedAt) { setElapsed(0); return; }
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(interval);
  }, [active, startedAt]);
  return elapsed;
}

/** Shows n8n pipeline steps ticking through while waiting */
function N8nPipelineProgress({ elapsedMs }: { elapsedMs: number }) {
  const currentStep = N8N_STEPS.filter(s => elapsedMs >= s.ms).length - 1;

  return (
    <div className="space-y-1.5">
      {N8N_STEPS.map((step, i) => {
        const isComplete = elapsedMs >= step.ms;
        const isActive = i === currentStep;
        return (
          <div key={i} className={`flex items-center gap-2.5 transition-all duration-500 ${isComplete ? "opacity-100" : "opacity-25"}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? "bg-primary/20 border border-primary/50" : "border border-white/10"
              }`}>
              {isComplete ? (
                isActive
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 className="w-2.5 h-2.5 text-primary" />
                  </motion.div>
                  : <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ) : null}
            </div>
            <span className={`text-[10px] font-mono ${isActive ? "text-primary" : isComplete ? "text-emerald-500" : "text-gray-600"}`}>
              {step.label}
            </span>
            {isActive && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-[9px] font-mono text-primary/50 ml-auto"
              >
                processing…
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CrisisOrchestrationPanel() {
  const { state, orchestrate, reset } = useOrchestration();

  const [crisisType, setCrisisType] = useState(CRISIS_TYPES[0].value);
  const [severity, setSeverity] = useState("critical");
  const [sentiment, setSentiment] = useState("extremely negative");
  const [sysStatus, setSysStatus] = useState("unstable");

  const isWaiting = state.phase === "connecting" || state.phase === "waiting_n8n";
  const isActive = isWaiting || state.phase === "streaming_responses";
  const isDone = state.phase === "complete";
  const isError = state.phase === "error";
  const showConfig = state.phase === "idle" || isDone || isError;

  const elapsed = useElapsedTimer(isWaiting, state.startedAt);
  const elapsedMs = state.startedAt ? Date.now() - state.startedAt : 0;

  const handleAction = (mode: string) => {
    orchestrate({
      crisis_type: crisisType,
      severity,
      customer_sentiment: sentiment,
      system_status: sysStatus,
      action_mode: mode,
    } as CrisisPayload);
  };

  return (
    <GlassCard className="relative overflow-hidden border-primary/20">
      {/* Scanning line */}
      {isActive && (
        <motion.div
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10 pointer-events-none"
        />
      )}

      <div className="p-4 sm:p-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-black tracking-widest uppercase text-white">{ENTERPRISE_CONFIG.companyName} // Crisis Orchestration</h2>
            <span className="text-[8px] font-mono text-primary/50 px-1.5 py-0.5 border border-primary/20 rounded">
              ENTERPRISE SIM
            </span>
            {/* Endpoint label */}
            <span className="hidden md:inline text-[8px] font-mono text-gray-700 px-1.5 py-0.5 border border-white/5 rounded">
              POST localhost:5678/webhook/ghost-board-crisis
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Elapsed timer while waiting */}
            {isWaiting && (
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-primary/70">
                <Clock className="w-3 h-3" />
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  {elapsed}s
                </motion.span>
              </div>
            )}
            {(isDone || isError) && (
              <button onClick={reset} className="p-1.5 rounded-lg border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all cursor-pointer" title="Reset">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {isActive && (
              <button onClick={reset} className="p-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all cursor-pointer" title="Abort">
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Config panel ── */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Crisis Type */}
              <div>
                <div className="text-[9px] font-mono text-gray-600 tracking-widest mb-2">CRISIS_TYPE</div>
                <div className="flex flex-wrap gap-2">
                  {CRISIS_TYPES.map(ct => (
                    <OptionButton key={ct.value} active={crisisType === ct.value} onClick={() => setCrisisType(ct.value)}>
                      {ct.icon} {ct.label}
                    </OptionButton>
                  ))}
                </div>
              </div>

              {/* 3-column options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[9px] font-mono text-gray-600 tracking-widest mb-2">SEVERITY</div>
                  <div className="flex flex-col gap-1.5">
                    {SEVERITIES.map(s => (
                      <button key={s.value} onClick={() => setSeverity(s.value)}
                        className={`px-2 py-1 rounded border text-[9px] font-black tracking-widest uppercase transition-all cursor-pointer text-left ${severity === s.value ? s.color : "border-white/10 text-gray-600 hover:text-gray-400"
                          }`}>{s.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-600 tracking-widest mb-2">CUSTOMER_SENTIMENT</div>
                  <div className="flex flex-col gap-1.5">
                    {SENTIMENTS.map(s => (
                      <OptionButton key={s.value} active={sentiment === s.value} onClick={() => setSentiment(s.value)}>
                        {s.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-mono text-gray-600 tracking-widest mb-2">SYSTEM_STATUS</div>
                  <div className="flex flex-col gap-1.5">
                    {SYSTEM_STATUSES.map(s => (
                      <OptionButton key={s.value} active={sysStatus === s.value} onClick={() => setSysStatus(s.value)}>
                        {s.label}
                      </OptionButton>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payload preview */}
              <div className="rounded-lg border border-white/5 bg-black/30 p-3">
                <div className="text-[8px] font-mono text-gray-600 mb-1.5">
                  PAYLOAD → POST /webhook/ghost-board-crisis
                </div>
                <pre className="text-[10px] font-mono text-gray-400 whitespace-pre-wrap">
                  {JSON.stringify({ crisis_type: crisisType, severity, customer_sentiment: sentiment, system_status: sysStatus }, null, 2)}
                </pre>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                {ACTION_BUTTONS.map(btn => (
                  <button
                    key={btn.mode}
                    onClick={() => handleAction(btn.mode)}
                    disabled={isActive}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-black text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer ${btn.color} disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {btn.icon}{btn.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Waiting for n8n ── */}
        {isWaiting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Status box */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-10 h-10 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center flex-shrink-0"
                >
                  <Cpu className="w-4 h-4 text-primary" />
                </motion.div>
                <div>
                  <div className="text-xs font-black text-primary tracking-widest">
                    {state.phase === "connecting" ? "CONNECTING TO n8n" : "AGENTIC WORKFLOW RUNNING"}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                    {state.phase === "connecting"
                      ? "Establishing connection to ghost-board-crisis webhook…"
                      : `Processing: ${CRISIS_TYPES.find(c => c.value === crisisType)?.label} — Severity: ${severity.toUpperCase()}`
                    }
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-black text-primary tabular-nums">{elapsed}s</div>
                  <div className="text-[8px] font-mono text-gray-600">elapsed</div>
                </div>
              </div>

              {/* n8n pipeline steps */}
              {state.phase === "waiting_n8n" && (
                <N8nPipelineProgress elapsedMs={elapsedMs} />
              )}

              {/* Note about agentic timing */}
              <div className="flex items-start gap-2 text-[9px] font-mono text-gray-600 border border-white/5 rounded-lg p-2.5 bg-white/3">
                <span className="text-yellow-600 flex-shrink-0">⏳</span>
                <span>
                  LLM-powered agentic workflows typically take <span className="text-yellow-600">30–120 seconds</span>.
                  Ghost Board will wait up to 3 minutes. You can abort anytime using ✕ above.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Streaming executive responses ── */}
        <AnimatePresence>
          {state.responses.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[8px] font-mono text-gray-600 tracking-widest">EXECUTIVE RESPONSES</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              {state.responses.map((response, i) => (
                <ExecutiveResponseCard key={response.id} response={response} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Intelligence report ── */}
        <AnimatePresence>
          {isDone && state.report && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Shield className="w-24 h-24 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em]">FINAL EXECUTIVE INTELLIGENCE REPORT</span>
                  {state.latencyMs && (
                    <span className="ml-auto text-[8px] font-mono text-gray-600">{(state.latencyMs / 1000).toFixed(1)}s</span>
                  )}
                </div>
                <div className="relative z-10 border-t border-white/5 pt-3">
                  <CommandCenterRenderer content={state.report} />
                </div>
                
                {/* Simulation Metadata Footer */}
                <div className="relative z-10 pt-4 mt-2 border-t border-white/5 flex items-center justify-between text-[7px] font-mono text-gray-700 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-4">
                    <span>Org: {ENTERPRISE_CONFIG.companyName}</span>
                    <span>Session: {ENTERPRISE_CONFIG.activeSession}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Cluster: {ENTERPRISE_CONFIG.region}</span>
                    <span>Status: Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Complete banner ── */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-emerald-500 tracking-widest">ORCHESTRATION COMPLETE</span>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-mono text-gray-600">
                <span>{state.responses.length} executives responded</span>
                {state.latencyMs && <span>Total: {(state.latencyMs / 1000).toFixed(1)}s</span>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error state ── */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                <span className="text-xs font-black text-destructive tracking-widest">ORCHESTRATION FAILED</span>
                {state.latencyMs && (
                  <span className="ml-auto text-[8px] font-mono text-gray-600">after {(state.latencyMs / 1000).toFixed(0)}s</span>
                )}
              </div>
              <p className="text-sm text-gray-400">{state.error}</p>

              {/* Expression error — specific n8n fix */}
              {state.error?.includes("{{") && (
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 space-y-2 text-[9px] font-mono">
                  <div className="text-orange-500 font-black tracking-widest mb-1">⚠ UNRESOLVED n8n EXPRESSIONS DETECTED</div>
                  <div className="text-gray-400 leading-relaxed">
                    Your n8n <span className="text-primary">Respond to Webhook</span> node is sending template strings instead of resolved values.
                  </div>
                  <div className="space-y-1 text-gray-500">
                    <div className="text-gray-400 font-black mb-1">FIX IN n8n:</div>
                    <div>1. Open your workflow → select the <span className="text-primary">Respond to Webhook</span> node</div>
                    <div>2. For each field value (marketing_ai, cto_ai etc.), click the field</div>
                    <div>3. Switch from <span className="text-orange-400">Fixed Value</span> → <span className="text-primary">Expression</span> mode</div>
                    <div>4. The value should be an expression like <code className="text-emerald-400">{"{{ $('Marketing AI').item.json.text }}"}</code></div>
                    <div>5. Save, re-activate the workflow, then click Execute Workflow and retry</div>
                  </div>
                  <div className="text-gray-600 pt-1">
                    Your n8n field names should be: <span className="text-primary">marketing_ai, cto_ai, hr_ai, ceo_ai, operations_ai, executive_report</span>
                  </div>
                </div>
              )}

              {/* Generic connection/timeout error */}
              {!state.error?.includes("{{") && (
                <div className="rounded-lg border border-white/5 bg-black/30 p-3 space-y-1.5 text-[9px] font-mono text-gray-600">
                  <div className="text-gray-500 font-black tracking-widest mb-1">TROUBLESHOOTING</div>
                  <div>1. Open n8n → click <span className="text-primary">Execute Workflow</span> to activate the test webhook</div>
                  <div>2. The test webhook only accepts one call per click — re-click Execute before each retry</div>
                  <div>3. Ensure the workflow <span className="text-primary">Webhook</span> trigger path is <code className="text-emerald-400">ghost-board-crisis</code></div>
                  <div>4. For production: activate as <span className="text-yellow-600">Production</span> to get a permanent URL</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </GlassCard>
  );
}
