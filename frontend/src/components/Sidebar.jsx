import { NavLink } from 'react-router-dom';
import { Home, Heart, DollarSign, Users, Smile, User } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard', neon: 'hover:text-neon-fitness text-neon-fitness' },
  { to: '/health', icon: Heart, label: 'Health', neon: 'hover:text-neon-health text-neon-health' },
  { to: '/wealth', icon: DollarSign, label: 'Wealth', neon: 'hover:text-neon-wealth text-neon-wealth' },
  { to: '/love', icon: Users, label: 'Love', neon: 'hover:text-neon-love text-neon-love' },
  { to: '/happiness', icon: Smile, label: 'Happiness', neon: 'hover:text-neon-happy text-neon-happy' },
  { to: '/profile', icon: User, label: 'Profile', neon: 'hover:text-primary text-primary' }
];

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-64 border-r border-subtle bg-primary h-[calc(100vh-4rem)] flex flex-col py-6 sticky top-16 overflow-y-auto">
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => clsx(
              "flex items-center justify-center lg:justify-start gap-4 p-3 rounded-xl transition duration-200",
              isActive ? "bg-bg-elevated" : "hover:bg-bg-elevated",
              isActive ? item.neon.split(' ')[1] : "text-secondary hover:text-primary"
            )}
          >
            <item.icon size={24} />
            <span className="hidden lg:block font-body text-lg font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
