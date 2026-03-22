import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

export const AdminPlanView = () => {
  const { plan, confirmTarget, createPlan } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState(0);

  if (!plan) return null;

  const week = plan.weeks[selectedWeek];
  const validatedTargets = week.targets.filter(t => t.status === 'validated');
  const confirmedTargets = week.targets.filter(t => t.status === 'confirmed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{plan.name}</h2>
          <p className="text-sm text-muted-foreground">Started {new Date(plan.startDate).toLocaleDateString()}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { localStorage.removeItem('sixweek-planner'); createPlan(null as any); window.location.reload(); }}>
          <Trash2 className="w-4 h-4" /> Reset
        </Button>
      </div>

      {/* Week tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {plan.weeks.map((w, i) => (
          <button
            key={i}
            onClick={() => setSelectedWeek(i)}
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all active:scale-[0.97] ${
              selectedWeek === i ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Week {w.weekNumber}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Total Tasks</p>
          <p className="text-xl font-bold text-foreground">{week.targets.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Awaiting Confirm</p>
          <p className="text-xl font-bold text-secondary">{validatedTargets.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Confirmed</p>
          <p className="text-xl font-bold text-success">{confirmedTargets.length}</p>
        </div>
      </div>

      {/* Daily targets */}
      <div className="space-y-2">
        {week.targets.map(t => (
          <div key={t.id} className="bg-card rounded-lg border p-4 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">Day {t.dayNumber}</span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-sm text-foreground">{t.description}</p>
              <p className="text-xs text-muted-foreground">Target: {t.targetQuantity} {t.unit}</p>
              {t.status === 'validated' && (
                <div className="mt-2 text-xs space-y-1">
                  <p className="text-muted-foreground">Completed: <span className="font-medium text-foreground">{t.completedQuantity} {t.unit}</span> {t.isDone ? <Check className="inline w-3 h-3 text-success" /> : <X className="inline w-3 h-3 text-destructive" />}</p>
                  {t.constraintLog && <p className="text-muted-foreground">Constraint: <span className="text-foreground">{t.constraintLog}</span></p>}
                </div>
              )}
            </div>
            {t.status === 'validated' && (
              <Button size="sm" onClick={() => confirmTarget(t.id)} className="shrink-0">
                <Check className="w-4 h-4" /> Confirm
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
