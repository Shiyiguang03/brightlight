'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar'; // ← Your original Navbar

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  // Updated to support a smooth Amber to Terra gradient + glow effects
  const navLinkStyle = (path: string) => {
    const active = isActive(path);
    return {
      background: active ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' : 'transparent',
      color: active ? '#ffffff' : '#fcd34d', // Brighter, cleaner amber tone for unselected
      boxShadow: active ? '0 4px 14px 0 rgba(180, 83, 9, 0.4)' : 'none',
    };
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#fffbeb' }}>
      
      {/* Universal Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        
        {/* Softened Deep Terra-Chocolate Sidebar with subtle border separation */}
        <div 
          className="w-64 flex flex-col shrink-0 select-none pt-4 border-r border-[#78350f]/20" 
          style={{ backgroundColor: '#3f1702', color: '#ffffff' }}
        >
          {/* Navigation Items */}
          <div className="flex-1 p-4 overflow-y-auto space-y-6 text-sm">
            
            {/* OVERVIEW SECTION */}
            <div>
              <p className="px-4 text-xs font-bold tracking-wider text-[#fcd34d]/50 uppercase mb-2">Overview</p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  style={navLinkStyle('/admin/dashboard')}
                >
                  <span>📊</span> Dashboard
                </Link>
              </nav>
            </div>

            {/* MANAGEMENT SECTION */}
            <div>
              <p className="px-4 text-xs font-bold tracking-wider text-[#fcd34d]/50 uppercase mb-2">Management</p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/users" 
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  style={navLinkStyle('/admin/users')}
                >
                  <div className="flex items-center gap-x-3">
                    <span>👥</span> All Users
                  </div>
                  {/* Badge dynamically adapts context based on active state */}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive('/admin/users') ? 'bg-white/20 text-white' : 'bg-[#78350f] text-[#fcd34d]'
                  }`}>6</span>
                </Link>
                <Link 
                  href="/admin/users/create" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  style={navLinkStyle('/admin/users/create')}
                >
                  <span>👤+</span> Create Staff / Agent
                </Link>
                <Link 
                  href="/admin/repairs" 
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  style={navLinkStyle('/admin/repairs')}
                >
                  <div className="flex items-center gap-x-3">
                    <span>🔧</span> Repair Requests
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                    isActive('/admin/repairs') ? 'bg-white/20 text-white' : 'bg-[#78350f] text-[#fcd34d]'
                  }`}>6</span>
                </Link>
              </nav>
            </div>

            {/* SYSTEM SECTION */}
            <div>
              <p className="px-4 text-xs font-bold tracking-wider text-[#fcd34d]/50 uppercase mb-2">System</p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/settings" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  style={navLinkStyle('/admin/settings')}
                >
                  <span>⚙️</span> Settings
                </Link>
                <Link 
                  href="/admin/logs" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:bg-white/5 hover:text-white"
                  style={navLinkStyle('/admin/logs')}
                >
                  <span>📈</span> Activity Logs
                </Link>
              </nav>
            </div>
          </div>

          {/* Sidebar Footer / Logout */}
          <div className="p-4 border-t border-[#78350f]/30">
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-amber-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Main Dashboard Content Area */}
          <div className="flex-1 p-8 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}