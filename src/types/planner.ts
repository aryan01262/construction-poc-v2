export type Role = 'admin' | 'supervisor' | 'engineer';

export interface DailyTarget {
  id: string;
  dayNumber: number; // 1-42
  date: string; // ISO date
  description: string;
  targetQuantity: number;
  unit: string;
  status: 'pending' | 'forwarded' | 'logged' | 'validated' | 'confirmed';
  // Supervisor fields
  completedQuantity?: number;
  isDone?: boolean;
  supervisorNote?: string;
  // Engineer validation
  constraintLog?: string;
  validatedByEngineer?: boolean;
  // Admin confirmation
  confirmedByAdmin?: boolean;
}

export interface WeeklyPlan {
  weekNumber: number; // 1-6
  targets: DailyTarget[];
  weeklyGoal: string;
}

export interface SixWeekPlan {
  id: string;
  name: string;
  startDate: string;
  weeks: WeeklyPlan[];
  createdAt: string;
}
