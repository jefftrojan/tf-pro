// components/dashboard/Header.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Bell, 
  User,
  LogOut,
  Settings,
  ChevronDown 
} from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
            <Bell className="h-6 w-6 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-medium">John Doe</span>
              <ChevronDown className="h-4 w-4 text-white opacity-60" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl overflow-hidden">
                <div className="py-2">
                  <button 
                    onClick={() => router.push('/dashboard/settings')}
                    className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    <Settings className="h-4 w-4 opacity-60" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4 opacity-60" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}