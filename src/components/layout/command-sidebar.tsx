"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, Globe, LayoutGrid, LogOut, Settings, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: Globe,       href: "/command-center",                label: "CMD_CENTER",     desc: "Main Operations" },
  { icon: LayoutGrid,  href: "/command-center/executives",     label: "EXEC_BOARD",     desc: "AI Executive Board" },
  { icon: Activity,    href: "/command-center/infrastructure",  label: "LIVE_INFRA",     desc: "Infrastructure" },
  { icon: ShieldAlert, href: "/command-center/security",       label: "SEC_CENTER",     desc: "Security Center" },
  { icon: BarChart3,   href: "/command-center/analytics",      label: "ANALYTICS",      desc: "Intelligence" },
  { icon: Settings,    href: "/command-center/system",         label: "SYS_CORE",       desc: "System Core" },
];

export function CommandSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 bottom-0 z-50 bg-black/80 backdrop-blur-xl border-r border-white/10 transition-transform duration-500 ease-in-out flex flex-col items-center py-8 
        ${isOpen ? "translate-x-0 w-64 lg:w-20" : "-translate-x-full lg:translate-x-0 w-20"}
      `}>
        {/* Logo */}
        <Link href="/" onClick={onClose}>
          <div className="w-10 h-10 bg-primary/20 border border-primary/50 rounded-lg flex items-center justify-center mb-10 glow-border hover:bg-primary/40 transition-all cursor-pointer relative group">
            <Globe className="w-5 h-5 text-primary" />
            {!isOpen && (
              <div className="absolute left-14 bg-black border border-primary/20 rounded px-3 py-1 text-[9px] font-mono text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-lg">
                GHOST_BOARD_HOME
              </div>
            )}
          </div>
        </Link>

        <nav className="flex-1 flex flex-col gap-3 w-full px-4 lg:px-0 lg:items-center">
          {NAV_ITEMS.map(({ icon: Icon, href, label, desc }, i) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} onClick={onClose} className="w-full lg:w-auto">
                <div className={`relative flex items-center gap-4 lg:justify-center p-3 lg:p-0 lg:w-12 lg:h-12 rounded-xl transition-all duration-300 cursor-pointer group ${
                  isActive
                    ? "text-primary bg-primary/5 lg:bg-transparent"
                    : "text-gray-600 hover:text-gray-200 hover:bg-white/5 lg:hover:bg-transparent"
                }`}>
                  {/* Active pill background (Desktop) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/30 hidden lg:block"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}

                  {/* Left active bar (Desktop) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bar"
                      className="absolute -left-px top-2 bottom-2 w-0.5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(0,242,255,0.8)] hidden lg:block"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-5 h-5 relative z-10 flex-shrink-0"
                  >
                    <Icon strokeWidth={isActive ? 2 : 1.5} />
                  </motion.div>

                  {/* Label (Mobile only) */}
                  <div className={`lg:hidden flex flex-col ${isActive ? "opacity-100" : "opacity-60"}`}>
                    <span className="text-[10px] font-black tracking-widest">{label}</span>
                    <span className="text-[8px] text-gray-500 font-mono">{desc}</span>
                  </div>

                  {/* Tooltip (Desktop only) */}
                  {!isOpen && (
                    <div className="absolute left-14 hidden lg:flex flex-col bg-black/95 border border-white/10 rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-xl min-w-[120px]">
                      <span className="text-[8px] font-black text-primary tracking-widest">{label}</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">{desc}</span>
                    </div>
                  )}

                  {/* Ping for active */}
                  {isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none lg:hidden"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Disconnect */}
        <Link href="/" className="w-full px-4 lg:px-0 lg:w-auto" onClick={onClose}>
          <div className="flex items-center gap-4 p-3 lg:p-0 lg:w-10 lg:h-10 lg:justify-center text-gray-600 hover:text-destructive transition-colors cursor-pointer group relative">
            <LogOut className="w-5 h-5" />
            <span className="lg:hidden text-[10px] font-black tracking-widest uppercase">Disconnect</span>
            {!isOpen && (
              <div className="absolute left-12 hidden lg:block bg-black border border-destructive/20 rounded px-2 py-1 text-[9px] font-mono text-destructive whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                DISCONNECT
              </div>
            )}
          </div>
        </Link>
      </aside>
    </>
  );
}
