import { NavLink } from 'react-router-dom';
import { GraduationCap, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export const Sidebar = () => {
  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r bg-card/60 p-6 lg:flex">
      <div className="flex items-center gap-3 text-lg font-semibold text-primary">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <GraduationCap className="h-5 w-5" />
        </div>
        EdTech Tasks
      </div>
      <nav className="mt-10 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-primary">Teacher tips</p>
        <p className="mt-1">Monitor learner progress, celebrate wins, and unblock faster.</p>
      </div>
    </aside>
  );
};

