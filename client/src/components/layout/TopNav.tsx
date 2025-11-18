import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'ED';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <p className="text-lg font-semibold">{user?.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="capitalize">
          {user?.role || 'student'}
        </Badge>
        <ThemeToggle />
        <Avatar className="hidden lg:flex">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

