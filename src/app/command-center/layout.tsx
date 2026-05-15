"use client";

import { CommandSidebar } from "@/components/layout/command-sidebar";
import { GhostProvider } from "@/store/ghost-store";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <GhostProvider>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black overflow-x-hidden">
        {/* Persistent Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0" />
        <div className="fixed inset-0 hero-gradient opacity-30 pointer-events-none z-0" />
        <div className="scanline" />

        {/* Sidebar */}
        <CommandSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Mobile Nav Trigger */}
        <div className="fixed top-4 right-4 z-[60] lg:hidden">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-12 h-12 rounded-xl bg-black/80 backdrop-blur-xl border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(0,242,255,0.2)] active:scale-90 transition-all"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Animated Page Content */}
        <main className={`transition-all duration-500 min-h-screen relative z-10 ${isSidebarOpen ? "blur-sm lg:blur-0" : ""} lg:pl-20`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </GhostProvider>
  );
}
