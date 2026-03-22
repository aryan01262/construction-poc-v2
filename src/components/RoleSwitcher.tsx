import { useAppContext } from '@/context/AppContext';
import type { Role } from '@/types/planner';
import { Shield, HardHat, Wrench } from 'lucide-react';

const roles: { value: Role; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4" />, color: 'bg-primary text-primary-foreground' },
  { value: 'supervisor', label: 'Supervisor', icon: <HardHat className="w-4 h-4" />, color: 'bg-secondary text-secondary-foreground' },
  { value: 'engineer', label: 'Engineer', icon: <Wrench className="w-4 h-4" />, color: 'bg-accent text-accent-foreground' },
];

export const RoleSwitcher = () => {
  const { role, setRole } = useAppContext();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {roles.map(r => (
        <button
          key={r.value}
          onClick={() => setRole(r.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
            role === r.value ? `${r.color} shadow-sm` : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {r.icon}
          <span className="hidden sm:inline">{r.label}</span>
        </button>
      ))}
    </div>
  );
};
