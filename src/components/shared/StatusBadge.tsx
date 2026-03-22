import { Badge } from '@/components/ui/badge';
import type { DailyTarget } from '@/types/planner';

const statusConfig: Record<DailyTarget['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  forwarded: { label: 'Forwarded', className: 'bg-primary/10 text-primary border-primary/20' },
  logged: { label: 'Logged', className: 'bg-secondary/10 text-secondary border-secondary/20' },
  validated: { label: 'Validated', className: 'bg-accent/10 text-accent border-accent/20' },
  confirmed: { label: 'Confirmed', className: 'bg-success/10 text-success border-success/20' },
};

export const StatusBadge = ({ status }: { status: DailyTarget['status'] }) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
};
