'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Navbar from '@/components/Navbar';   

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinkStyle = (path: string) => {
    const active = isActive(path);
    return {
      background: active 
        ? 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' 
        : 'transparent',
      color: active ? '#ffffff' : '#453227',
      boxShadow: active ? '0 4px 14px 0 rgba(180, 83, 9, 0.35)' : 'none',
    };
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#fffbeb' }}>
      
      {/* Navbar wrapper */}
      <Navbar />

      {/* 
        1. Added `pt-16` to offset a standard sticky navbar height. 
        2. Added `h-[calc(100vh-4rem)]` to keep it correctly bounded on the remaining screen.
      */}
      <div className="flex flex-1 pt-16 relative h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-[60] p-2 bg-white rounded-xl shadow border"
          style={{ borderColor: '#e6dfd5' }}
        >
          ☰
        </button>

        {/* Sidebar */}
        {/* 
          Changed `top-0` to `top-16` and adjusted height to `h-[calc(100vh-4rem)]` 
          so it anchors cleanly beneath the navigation bar instead of overlapping it.
        */}
        <div 
          className={`
            fixed md:static top-16 left-0 z-[50] h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 ease-in-out flex flex-col border-r
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{ 
            backgroundColor: '#fffbeb', 
            borderColor: '#e6dfd5' 
          }}
        >
          <div className="px-5 pb-4 pt-4">
            <p className="text-xs font-bold tracking-wider px-3" style={{ color: '#9f7a5f' }}>
              SUPER ADMIN
            </p>
          </div>

          <div className="flex-1 px-3 space-y-6 overflow-y-auto text-sm">
            
            {/* OVERVIEW */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#9f7a5f' }}>
                OVERVIEW
              </p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/dashboard" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]"
                  style={navLinkStyle('/admin/dashboard')}
                >
                  📊 Dashboard
                </Link>
              </nav>
            </div>

            {/* MANAGEMENT */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#9f7a5f' }}>
                MANAGEMENT
              </p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/users" 
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]"
                  style={navLinkStyle('/admin/users')}
                >
                  <span>👥 All Users</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#fef3c7] text-[#b45309]">6</span>
                </Link>

                <Link 
                  href="/admin/users/create" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]"
                  style={navLinkStyle('/admin/users/create')}
                >
                  ➕ Create Staff / Agent
                </Link>

                <Link 
                  href="/admin/repairs" 
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]"
                  style={navLinkStyle('/admin/repairs')}
                >
                  <span>🔧 Repair Requests</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#fef3c7] text-[#b45309]">6</span>
                </Link>
              </nav>
            </div>

            {/* SYSTEM */}
            <div>
              <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#9f7a5f' }}>
                SYSTEM
              </p>
              <nav className="space-y-1">
                <Link 
                  href="/admin/settings" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]"
                  style={navLinkStyle('/admin/settings')}
                >
                  ⚙️ Settings
                </Link>
                <Link 
                  href="/admin/activity" 
                  className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]"
                  style={navLinkStyle('/admin/activity')}
                >
                  📈 Activity Logs
                </Link>
              </nav>
            </div>
          </div>

          <div className="p-4 border-t" style={{ borderColor: '#e6dfd5' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-x-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all hover:bg-red-50"
              style={{ color: '#b45309' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Overlay (Mobile) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-[45] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Pushed over properly on desktop view */}
        {/* 
          Added `overflow-y-auto` to allow content scrolling independent of the nav layout structure.
        */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}