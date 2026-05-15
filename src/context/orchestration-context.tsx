"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useCrisisOrchestration } from '@/hooks/use-crisis-orchestration';

const OrchestrationContext = createContext<ReturnType<typeof useCrisisOrchestration> | undefined>(undefined);

export function OrchestrationProvider({ children }: { children: ReactNode }) {
  const orchestration = useCrisisOrchestration();
  return (
    <OrchestrationContext.Provider value={orchestration}>
      {children}
    </OrchestrationContext.Provider>
  );
}

export function useOrchestration() {
  const context = useContext(OrchestrationContext);
  if (context === undefined) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
}
