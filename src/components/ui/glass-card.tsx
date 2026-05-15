"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "violet" | "blue" | "red";
  hoverEffect?: boolean;
}

export function GlassCard({ children, className, glowColor = "cyan", hoverEffect = true }: GlassCardProps) {
  const glowStyles = {
    cyan: "hover:shadow-[0_0_30px_rgba(0,242,255,0.15)] hover:border-primary/50",
    violet: "hover:shadow-[0_0_30px_rgba(112,0,255,0.15)] hover:border-secondary/50",
    blue: "hover:shadow-[0_0_30px_rgba(0,102,255,0.15)] hover:border-accent/50",
    red: "hover:shadow-[0_0_30px_rgba(255,0,0,0.15)] hover:border-destructive/50",
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.01, translateY: -2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={cn(
        "glass-panel rounded-xl p-6 transition-all duration-300",
        glowStyles[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
