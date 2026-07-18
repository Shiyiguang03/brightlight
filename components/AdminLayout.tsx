'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('SUPER ADMIN');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user.role);
    }

    const savedView = localStorage.getItem('viewMode') || 'SUPER ADMIN';
    setViewMode(savedView);
  }, []);

  const isSuperAdmin = userRole === 'SUPER ADMIN';
  const isStaffView = viewMode === 'STAFF';
  const isAgentView = viewMode === 'AGENT';

  const headerTitle = isAgentView 
    ? 'AGENT' 
    : isStaffView 
      ? 'STAFF' 
      : 'SUPER ADMIN';

  const headerSubtitle = isAgentView 
    ? 'Agent View' 
    : isStaffView 
      ? 'Staff View' 
      : 'Super Admin View';

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
      
      {/* Navbar */}
      <div className="sticky top-0 z-[60]">
        <Navbar />
      </div>

      <div className="flex flex-1 relative">
        
        {/* Mobile Menu Button - Only show when sidebar is closed */}
{!sidebarOpen && (
  <button 
    onClick={() => setSidebarOpen(true)}
    className="md:hidden fixed top-20 left-4 z-[70] p-3 bg-white rounded-2xl shadow-lg border flex items-center justify-center"
    style={{ borderColor: '#e6dfd5' }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
)}

        {/* Sidebar */}
        <div 
          className={`
            fixed md:static top-16 md:top-0 left-0 z-[50] h-[calc(100vh-4rem)] md:h-full w-64 transform transition-transform duration-300 ease-in-out flex flex-col overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
          style={{ backgroundColor: '#fffbeb', borderColor: '#e6dfd5' }}
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: '#e6dfd5' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#78350f' }}>
                  {headerTitle}
                </p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: '#d97706' }}>
                  {headerSubtitle}
                </p>
              </div>

              {isSuperAdmin && (
                <Link 
                  href="/admin/view" 
                  className="text-xs px-3 py-1.5 rounded-lg font-medium border transition hover:bg-[#fef3c7]"
                  style={{ borderColor: '#d97706', color: '#d97706' }}
                >
                  Switch View
                </Link>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 px-3 space-y-6 text-sm pt-3">
            
            {/* SUPER ADMIN MENU */}
            {!isStaffView && !isAgentView && (
              <>
                <div>
                  <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#78350f' }}>OVERVIEW</p>
                  <nav className="space-y-1">
                    <Link href="/admin/dashboard" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/admin/dashboard')}>
                      📊 Dashboard
                    </Link>
                  </nav>
                </div>

                <div>
                  <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#78350f' }}>MANAGEMENT</p>
                  <nav className="space-y-1">
                    <Link href="/admin/users" className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/admin/users')}>
                      <span>👥 All Users</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#fef3c7] text-[#b45309]">6</span>
                    </Link>
                    <Link href="/admin/users/create" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/admin/users/create')}>
                      ➕ Create Staff / Agent
                    </Link>
                    <Link href="/admin/repairs" className="flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/admin/repairs')}>
                      <span>🔧 Repair Requests</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#fef3c7] text-[#b45309]">6</span>
                    </Link>
                  </nav>
                </div>
              </>
            )}

            {/* ==================== STAFF MENU ==================== */}
            {isStaffView && (
              <div>
                <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#78350f' }}>REPAIRS</p>
                <nav className="space-y-1">
                  <Link href="/staff" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/staff')}>
                    🛠️ Dashboard
                  </Link>
                  <Link href="/staff/repairs" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/staff/repairs')}>
                    📋 All Repair Requests
                  </Link>

                  {/* ✅ NEW: Scan QR Link */}
                  <Link 
                    href="/staff/scan-qr" 
                    className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" 
                    style={navLinkStyle('/staff/scan-qr')}
                  >
                    📷 Scan QR Code
                  </Link>
                </nav>
              </div>
            )}

            {/* AGENT MENU */}
            {isAgentView && (
              <div>
                <p className="px-3 mb-2 text-[10px] font-bold tracking-wider" style={{ color: '#78350f' }}>AGENT</p>
                <nav className="space-y-1">
                  <Link href="/agent" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/agent')}>
                    📊 Dashboard
                  </Link>
                  <Link href="/agent/request-repair" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/agent/request-repair')}>
                    📝 New Repair Request
                  </Link>
                  <Link href="/agent/my-requests" className="flex items-center gap-x-3 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-[#fef3c7]" style={navLinkStyle('/agent/my-requests')}>
                    📋 My Requests
                  </Link>
                </nav>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="p-4 border-t mt-auto" style={{ borderColor: '#e6dfd5' }}>
            <button 
              onClick={() => {
                sessionStorage.removeItem('user');
                localStorage.removeItem('viewMode');
                window.location.href = '/login';
              }}
              className="w-full flex items-center gap-x-2 px-4 py-2.5 text-sm font-bold rounded-xl transition-all hover:bg-red-50"
              style={{ color: '#b45309' }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-[45] md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
{/* Main Content - Fixed for full background coverage */}
<div className="flex-1 flex flex-col w-full">
  <div className="flex-1 p-4 md:p-6 w-full">
    <div className="w-full max-w-7xl mx-auto">
      {children}
    </div>
  </div>
</div>
      </div>
    </div>
  );
}