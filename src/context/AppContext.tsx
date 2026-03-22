import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Role, SixWeekPlan, DailyTarget } from '@/types/planner';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  plan: SixWeekPlan | null;
  createPlan: (plan: SixWeekPlan) => void;
  forwardTarget: (targetId: string) => void;
  logTarget: (targetId: string, completedQty: number, isDone: boolean, note: string) => void;
  validateTarget: (targetId: string, constraintLog: string) => void;
  confirmTarget: (targetId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

const STORAGE_KEY = 'sixweek-planner';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('admin');
  const [plan, setPlan] = useState<SixWeekPlan | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (plan) localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  const updateTarget = useCallback((targetId: string, updater: (t: DailyTarget) => DailyTarget) => {
    setPlan(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        weeks: prev.weeks.map(w => ({
          ...w,
          targets: w.targets.map(t => t.id === targetId ? updater(t) : t),
        })),
      };
    });
  }, []);

  const createPlan = useCallback((p: SixWeekPlan) => setPlan(p), []);

  const forwardTarget = useCallback((targetId: string) => {
    updateTarget(targetId, t => ({ ...t, status: 'forwarded' }));
  }, [updateTarget]);

  const logTarget = useCallback((targetId: string, completedQuantity: number, isDone: boolean, supervisorNote: string) => {
    updateTarget(targetId, t => ({ ...t, status: 'logged', completedQuantity, isDone, supervisorNote }));
  }, [updateTarget]);

  const validateTarget = useCallback((targetId: string, constraintLog: string) => {
    updateTarget(targetId, t => ({ ...t, status: 'validated', constraintLog, validatedByEngineer: true }));
  }, [updateTarget]);

  const confirmTarget = useCallback((targetId: string) => {
    updateTarget(targetId, t => ({ ...t, status: 'confirmed', confirmedByAdmin: true }));
  }, [updateTarget]);

  return (
    <AppContext.Provider value={{ role, setRole, plan, createPlan, forwardTarget, logTarget, validateTarget, confirmTarget }}>
      {children}
    </AppContext.Provider>
  );
};
