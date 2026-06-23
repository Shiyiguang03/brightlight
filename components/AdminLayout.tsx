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

  const navLinkStyle = (path: string) => {
    const active = isActive(path);
    return {
      backgroundColor: active ? '#78350f' : 'transparent', // Solid deep terra-amber
      color: active ? '#ffffff' : '#d97706', // Bright amber text for inactive
      border: active ? '1px solid #b45309' : '1px solid transparent',
    };
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#fffbeb' }}>
      
      {/* Universal Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        
        {/* Solid Terra-Amber Sidebar */}
        <div 
          className="w-64 flex flex-col shrink-0 select-none pt-4" 
          style={{ backgroundColor: '#451a03', color: '#ffffff' }}
        >
          {/* Navigation Items */}
          <div className="flex-1 p-4 overflow-y-auto space-y-6 text-sm">
            
            {/* OVERVIEW SECTION */}
            <div>
              <p className="px-4 text-xs font-bold tracking-wider text-[#d97706]/70 uppercase mb-2">Overview</p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
                  style={navLinkStyle('/admin/dashboard')}
                >
                  <span>📊</span> Dashboard
                </Link>
              </nav>
            </div>

            {/* MANAGEMENT SECTION */}
            <div>
              <p className="px-4 text-xs font-bold tracking-wider text-[#d97706]/70 uppercase mb-2">Management</p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/users" 
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
                  style={navLinkStyle('/admin/users')}
                >
                  <div className="flex items-center gap-x-3">
                    <span>👥</span> All Users
                  </div>
                  <span className="text-xs bg-[#78350f] px-2 py-0.5 rounded-full text-[#fcd34d]">6</span>
                </Link>
                <Link 
                  href="/admin/users/create" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
                  style={navLinkStyle('/admin/users/create')}
                >
                  <span>👤+</span> Create Staff / Agent
                </Link>
                <Link 
                  href="/admin/repairs" 
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
                  style={navLinkStyle('/admin/repairs')}
                >
                  <div className="flex items-center gap-x-3">
                    <span>🔧</span> Repair Requests
                  </div>
                  <span className="text-xs bg-[#78350f] px-2 py-0.5 rounded-full text-[#fcd34d]">6</span>
                </Link>
              </nav>
            </div>

            {/* SYSTEM SECTION */}
            <div>
              <p className="px-4 text-xs font-bold tracking-wider text-[#d97706]/70 uppercase mb-2">System</p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/settings" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
                  style={navLinkStyle('/admin/settings')}
                >
                  <span>⚙️</span> Settings
                </Link>
                <Link 
                  href="/admin/logs" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200"
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
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-orange-300 hover:text-white hover:bg-[#78350f] rounded-xl transition-all duration-200"
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