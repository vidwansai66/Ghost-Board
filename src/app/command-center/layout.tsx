"use client";

import { CommandSidebar } from "@/components/layout/command-sidebar";
import { GhostProvider } from "@/store/ghost-store";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <GhostProvider>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black overflow-x-hidden">
        {/* Persistent Background */}
        <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0" />
        <div className="fixed inset-0 hero-gradient opacity-30 pointer-events-none z-0" />
        <div className="scanline" />

        {/* Sidebar — always visible */}
        <CommandSidebar />

        {/* Animated Page Content */}
        <main className="pl-20 min-h-screen relative z-10">
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
