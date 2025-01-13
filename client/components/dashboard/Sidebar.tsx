// components/dashboard/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  FileText,
  Settings,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    name: 'Accounts',
    icon: Wallet,
    path: '/dashboard/accounts'
  },
  {
    name: 'Transactions',
    icon: Receipt,
    path: '/dashboard/transactions'
  },
  {
    name: 'Budgets',
    icon: PieChart,
    path: '/dashboard/budgets'
  },
  {
    name: 'Reports',
    icon: FileText,
    path: '/dashboard/reports'
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/dashboard/settings'
  }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 backdrop-blur-lg bg-white/10 border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">WalletApp</span>
          </Link>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors mb-1
                ${isActive(item.path) 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-white text-sm mb-1">Logged in as</p>
            <p className="text-white font-medium">john.doe@example.com</p>
          </div>
        </div>
      </aside>
    </>
  );
}