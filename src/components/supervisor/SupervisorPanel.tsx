import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AlertCircle, Check, X } from 'lucide-react';

export const SupervisorPanel = () => {
  const { plan, logTarget } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [formData, setFormData] = useState<Record<string, { qty: string; done: boolean; note: string }>>({});

  if (!plan) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-foreground">No Plan Available</h2>
        <p className="text-muted-foreground">Waiting for Admin to create a plan.</p>
      </div>
    );
  }

  const week = plan.weeks[selectedWeek];
  const forwardedTargets = week.targets.filter(t => t.status === 'forwarded');
  const loggedTargets = week.targets.filter(t => ['logged', 'validated', 'confirmed'].includes(t.status));

  const getForm = (id: string) => formData[id] || { qty: '', done: false, note: '' };
  const setForm = (id: string, data: Partial<{ qty: string; done: boolean; note: string }>) => {
    setFormData(prev => ({ ...prev, [id]: { ...getForm(id), ...data } }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Supervisor Portal</h1>
        <p className="text-muted-foreground">Log daily task completion and quantities</p>
      </div>

      {/* Week selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {plan.weeks.map((w, i) => (
          <button key={i} onClick={() => setSelectedWeek(i)}
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all active:scale-[0.97] ${selectedWeek === i ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
            Week {w.weekNumber}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Pending Review</p>
          <p className="text-xl font-bold text-secondary">{forwardedTargets.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-3">
          <p className="text-xs text-muted-foreground">Logged</p>
          <p className="text-xl font-bold text-success">{loggedTargets.length}</p>
        </div>
      </div>

      {/* Forwarded targets to log */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Tasks to Review</h3>
        {forwardedTargets.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks forwarded yet. Engineer needs to forward daily targets.</p>}
        {forwardedTargets.map(t => {
          const form = getForm(t.id);
          return (
            <div key={t.id} className="bg-card rounded-lg border p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Day {t.dayNumber}</span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-sm text-foreground">{t.description}</p>
              <p className="text-xs text-muted-foreground">Target: {t.targetQuantity} {t.unit}</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Completed Qty</label>
                  <Input type="number" value={form.qty} onChange={e => setForm(t.id, { qty: e.target.value })} placeholder={`${t.targetQuantity}`} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <div className="flex gap-2 mt-1">
                    <Button size="sm" variant={form.done ? 'default' : 'outline'} onClick={() => setForm(t.id, { done: true })} className={form.done ? 'bg-success hover:bg-success/90' : ''}>
                      <Check className="w-4 h-4" /> Done
                    </Button>
                    <Button size="sm" variant={!form.done ? 'destructive' : 'outline'} onClick={() => setForm(t.id, { done: false })}>
                      <X className="w-4 h-4" /> Not Done
                    </Button>
                  </div>
                </div>
              </div>

              <Textarea placeholder="Add note (optional)..." value={form.note} onChange={e => setForm(t.id, { note: e.target.value })} rows={2} className="text-sm" />

              <Button size="sm" onClick={() => { logTarget(t.id, Number(form.qty) || 0, form.done, form.note); }} disabled={!form.qty}>
                Log Task
              </Button>
            </div>
          );
        })}
      </div>

      {/* Already logged */}
      {loggedTargets.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Logged Tasks</h3>
          {loggedTargets.map(t => (
            <div key={t.id} className="bg-card rounded-lg border p-3 flex items-center gap-3 opacity-80 animate-fade-in">
              <div className={`w-2 h-2 rounded-full ${t.isDone ? 'bg-success' : 'bg-destructive'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{t.description}</p>
                <p className="text-xs text-muted-foreground">{t.completedQuantity}/{t.targetQuantity} {t.unit}</p>
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
