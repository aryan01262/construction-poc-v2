import { RoleSwitcher } from './RoleSwitcher';
import { useAppContext } from '@/context/AppContext';
import { AdminPanel } from './admin/AdminPanel';
import { EngineerPanel } from './engineer/EngineerPanel';
import { SupervisorPanel } from './supervisor/SupervisorPanel';
import { HardHat } from 'lucide-react';

export const AppShell = () => {
  const { role } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <HardHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground hidden sm:block">SitePlan</span>
          </div>
          <RoleSwitcher />
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <div className="animate-fade-in">
          {role === 'admin' && <AdminPanel />}
          {role === 'engineer' && <EngineerPanel />}
          {role === 'supervisor' && <SupervisorPanel />}
        </div>
      </main>
    </div>
  );
};
