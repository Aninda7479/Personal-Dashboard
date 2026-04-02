import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="h-16 border-b border-subtle bg-primary flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-neon-fitness flex items-center justify-center text-black font-display font-bold">
          L
        </div>
        <h1 className="font-display font-bold text-xl tracking-wide hidden sm:block">LIFE DASHBOARD</h1>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-black font-display font-bold"
              style={{ backgroundColor: user.avatar_color || '#00F5A0' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-secondary hidden sm:inline-block">{user.name}</span>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-secondary hover:text-primary transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </nav>
  );
}
