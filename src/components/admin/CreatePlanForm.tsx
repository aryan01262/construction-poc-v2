import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SixWeekPlan, WeeklyPlan, DailyTarget } from '@/types/planner';
import { CalendarDays, Plus } from 'lucide-react';

const SAMPLE_TASKS = [
  { desc: 'Foundation excavation', qty: 120, unit: 'cu.m' },
  { desc: 'Rebar placement', qty: 800, unit: 'kg' },
  { desc: 'Concrete pouring', qty: 50, unit: 'cu.m' },
  { desc: 'Formwork assembly', qty: 30, unit: 'sq.m' },
  { desc: 'Steel column erection', qty: 8, unit: 'pcs' },
  { desc: 'Beam casting', qty: 12, unit: 'pcs' },
  { desc: 'Slab preparation', qty: 60, unit: 'sq.m' },
  { desc: 'Brick masonry work', qty: 200, unit: 'sq.ft' },
  { desc: 'Plumbing rough-in', qty: 15, unit: 'points' },
  { desc: 'Electrical conduit laying', qty: 100, unit: 'meters' },
];

export const CreatePlanForm = () => {
  const { createPlan } = useAppContext();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleCreate = () => {
    if (!name || !startDate) return;
    
    const start = new Date(startDate);
    const weeks: WeeklyPlan[] = [];

    for (let w = 0; w < 6; w++) {
      const targets: DailyTarget[] = [];
      for (let d = 0; d < 7; d++) {
        const dayNum = w * 7 + d + 1;
        const date = new Date(start);
        date.setDate(date.getDate() + dayNum - 1);
        const sample = SAMPLE_TASKS[(dayNum - 1) % SAMPLE_TASKS.length];
        targets.push({
          id: `day-${dayNum}`,
          dayNumber: dayNum,
          date: date.toISOString().split('T')[0],
          description: sample.desc,
          targetQuantity: sample.qty,
          unit: sample.unit,
          status: 'pending',
        });
      }
      weeks.push({
        weekNumber: w + 1,
        targets,
        weeklyGoal: `Week ${w + 1} construction milestone`,
      });
    }

    const plan: SixWeekPlan = {
      id: crypto.randomUUID(),
      name,
      startDate,
      weeks,
      createdAt: new Date().toISOString(),
    };
    createPlan(plan);
  };

  const handleQuickCreate = () => {
    setName('Site Alpha — Phase 1');
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    setStartDate(monday.toISOString().split('T')[0]);
  };

  return (
    <div className="max-w-lg">
      <div className="bg-card rounded-lg border p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">New 6-Week Plan</h2>
            <p className="text-sm text-muted-foreground">42 days of structured targets</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="planName">Plan Name</Label>
            <Input id="planName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Site Alpha — Phase 1" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCreate} disabled={!name || !startDate} className="flex-1">
            <Plus className="w-4 h-4" /> Create Plan
          </Button>
          <Button variant="outline" onClick={handleQuickCreate}>Quick Fill</Button>
        </div>
      </div>
    </div>
  );
};
