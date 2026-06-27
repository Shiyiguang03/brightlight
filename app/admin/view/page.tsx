'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default function ViewSwitcher() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('SUPER ADMIN');

  useEffect(() => {
    const savedView = localStorage.getItem('viewMode') || 'SUPER ADMIN';
    setCurrentView(savedView);
  }, []);

  const switchView = (view: string) => {
    localStorage.setItem('viewMode', view);
    setCurrentView(view);

    // Redirect based on view
    if (view === 'SUPER ADMIN') {
      router.push('/admin/dashboard');
    } else if (view === 'STAFF') {
      router.push('/staff');
    } else if (view === 'AGENT') {
      router.push('/agent');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f130b' }}>Switch View</h1>
        <p className="mb-8" style={{ color: '#5c4436' }}>
          As Super Admin, you can temporarily view the system as different roles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Super Admin View */}
          <button
            onClick={() => switchView('SUPER ADMIN')}
            className={`p-6 rounded-2xl border text-left transition-all ${
              currentView === 'SUPER ADMIN' 
                ? 'border-[#d97706] bg-[#fef3c7]' 
                : 'border-[#e6dfd5] hover:bg-[#fefce8]'
            }`}
          >
            <div className="text-3xl mb-3">🛡️</div>
            <p className="font-bold text-xl" style={{ color: '#1f130b' }}>Super Admin</p>
            <p className="text-sm mt-1" style={{ color: '#5c4436' }}>
              Full access to manage users, staff, and all repairs.
            </p>
          </button>

          {/* Staff View */}
          <button
            onClick={() => switchView('STAFF')}
            className={`p-6 rounded-2xl border text-left transition-all ${
              currentView === 'STAFF' 
                ? 'border-[#d97706] bg-[#fef3c7]' 
                : 'border-[#e6dfd5] hover:bg-[#fefce8]'
            }`}
          >
            <div className="text-3xl mb-3">🛠️</div>
            <p className="font-bold text-xl" style={{ color: '#1f130b' }}>Staff</p>
            <p className="text-sm mt-1" style={{ color: '#5c4436' }}>
              View and manage all repair requests.
            </p>
          </button>

          {/* Agent View */}
          <button
            onClick={() => switchView('AGENT')}
            className={`p-6 rounded-2xl border text-left transition-all ${
              currentView === 'AGENT' 
                ? 'border-[#d97706] bg-[#fef3c7]' 
                : 'border-[#e6dfd5] hover:bg-[#fefce8]'
            }`}
          >
            <div className="text-3xl mb-3">🎧</div>
            <p className="font-bold text-xl" style={{ color: '#1f130b' }}>Agent</p>
            <p className="text-sm mt-1" style={{ color: '#5c4436' }}>
              Submit repair requests on behalf of customers.
            </p>
          </button>
        </div>

        <div className="mt-8 p-4 rounded-2xl text-sm" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
          Note: Switching view only changes what you see. Your actual role remains <strong>Super Admin</strong>.
        </div>
      </div>
    </AdminLayout>
  );
}