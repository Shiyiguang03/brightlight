'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalCustomers: 0, totalStaff: 0, totalAgents: 0, totalRepairs: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // Fetch stats
    fetch('/api/admin/stats').then(res => res.json()).then(setStats);

    // Fetch recent repairs for activity
    fetch('/api/admin/repairs')
      .then(res => res.json())
      .then(data => setRecentActivity(data.slice(0, 4))); // show latest 4
  }, []);

  if (!user) return null;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#453227' }}>
          Welcome back, {user.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-lg mb-8" style={{ color: '#7c6251' }}>
          Here's what's happening across your platform today.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>TOTAL CUSTOMERS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>{stats.totalCustomers}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>TOTAL STAFF</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>{stats.totalStaff}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>TOTAL AGENTS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>{stats.totalAgents}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>WORK ORDERS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>{stats.totalRepairs}</p>
          </div>
        </div>

        {/* Recent Activity (Real Data) */}
        <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: '#453227' }}>Recent activity</h3>
          
          {recentActivity.length === 0 ? (
            <p className="text-sm" style={{ color: '#7c6251' }}>No recent activity yet.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((repair, index) => (
                <div key={index} className="flex gap-x-3 text-sm">
                  <div className="w-2 h-2 mt-2 rounded-full bg-orange-400"></div>
                  <div>
                    <p style={{ color: '#453227' }}>
                      {repair.user?.fullName} submitted repair for {repair.brand} {repair.model}
                    </p>
                    <p className="text-xs" style={{ color: '#9f7a5f' }}>
                      {new Date(repair.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}