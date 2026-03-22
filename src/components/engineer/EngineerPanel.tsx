import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Send, ClipboardCheck, AlertCircle } from 'lucide-react';

export const EngineerPanel = () => {
  const { plan, forwardTarget, validateTarget } = useAppContext();
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [constraintLogs, setConstraintLogs] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'forward' | 'validate'>('forward');

  if (!plan) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-foreground">No Plan Available</h2>
        <p className="text-muted-foreground">Switch to Admin to create a 6-week plan first.</p>
      </div>
    );
  }

  const week = plan.weeks[selectedWeek];
  const today = new Date();
  const dayOfMonth = today.getDate();
  const isEvenDay = dayOfMonth % 2 === 0;

  const forwardableTargets = week.targets.filter(t => t.status === 'pending');
  const loggedTargets = week.targets.filter(t => t.status === 'logged');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Engineer Portal</h1>
        <p className="text-muted-foreground">Forward targets & validate supervisor logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        <button onClick={() => setTab('forward')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.97] ${tab === 'forward' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
          <Send className="w-4 h-4 inline mr-1" /> Forward ({forwardableTargets.length})
        </button>
        <button onClick={() => setTab('validate')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-[0.97] ${tab === 'validate' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
          <ClipboardCheck className="w-4 h-4 inline mr-1" /> Validate ({loggedTargets.length})
        </button>
      </div>

      {/* Week selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {plan.weeks.map((w, i) => (
          <button key={i} onClick={() => setSelectedWeek(i)}
            className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all active:scale-[0.97] ${selectedWeek === i ? 'bg-accent text-accent-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}>
            Week {w.weekNumber}
          </button>
        ))}
      </div>

      {tab === 'forward' && (
        <div className="space-y-2">
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            Today is day <strong className="text-foreground">{dayOfMonth}</strong> ({isEvenDay ? 'even' : 'odd'}). You can forward targets on {isEvenDay ? 'even' : 'odd'} days.
          </div>
          {forwardableTargets.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No pending targets to forward this week.</p>}
          {forwardableTargets.map(t => {
            const targetDay = new Date(t.date).getDate();
            const canForward = (targetDay % 2 === 0) === isEvenDay;
            return (
              <div key={t.id} className="bg-card rounded-lg border p-4 flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">Day {t.dayNumber}</span>
                    <span className="text-xs text-muted-foreground">{t.date}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-sm text-foreground">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{t.targetQuantity} {t.unit}</p>
                </div>
                <Button size="sm" onClick={() => forwardTarget(t.id)} disabled={!canForward} variant={canForward ? 'default' : 'outline'}>
                  <Send className="w-4 h-4" /> Forward
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'validate' && (
        <div className="space-y-2">
          {loggedTargets.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No supervisor logs to validate.</p>}
          {loggedTargets.map(t => (
            <div key={t.id} className="bg-card rounded-lg border p-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Day {t.dayNumber}</span>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-sm text-foreground">{t.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Target:</span> <span className="font-medium">{t.targetQuantity} {t.unit}</span></div>
                <div><span className="text-muted-foreground">Completed:</span> <span className="font-medium">{t.completedQuantity} {t.unit}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className={`font-medium ${t.isDone ? 'text-success' : 'text-destructive'}`}>{t.isDone ? 'Done' : 'Not Done'}</span></div>
                {t.supervisorNote && <div><span className="text-muted-foreground">Note:</span> {t.supervisorNote}</div>}
              </div>
              <Textarea
                placeholder="Enter constraint log..."
                value={constraintLogs[t.id] || ''}
                onChange={e => setConstraintLogs(prev => ({ ...prev, [t.id]: e.target.value }))}
                className="text-sm"
                rows={2}
              />
              <Button size="sm" onClick={() => { validateTarget(t.id, constraintLogs[t.id] || 'No constraints'); setConstraintLogs(prev => { const n = { ...prev }; delete n[t.id]; return n; }); }}>
                <ClipboardCheck className="w-4 h-4" /> Validate & Punch Log
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
