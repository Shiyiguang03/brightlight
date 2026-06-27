'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

interface Repair {
  id: number;
  deviceType: string;
  brand: string;
  model: string;
  problemDescription: string;
  status: string;
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const [recentActivity, setRecentActivity] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/repairs?limit=4')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch repairs');
        }
        const result = await res.json();

        // ✅ Handle new API response format { data: [...], pagination: {...} }
        if (result.data && Array.isArray(result.data)) {
          setRecentActivity(result.data);
        } else {
          setRecentActivity([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load recent activity');
        setRecentActivity([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>
            Welcome back, Super 👋
          </h1>
          <p className="mt-1" style={{ color: '#7c6251' }}>
            Here's what's happening across your platform today.
          </p>
        </div>

        {/* Stats Cards (Hardcoded for now) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold tracking-wider" style={{ color: '#9f7a5f' }}>TOTAL CUSTOMERS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>6</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold tracking-wider" style={{ color: '#9f7a5f' }}>TOTAL STAFF</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>0</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold tracking-wider" style={{ color: '#9f7a5f' }}>TOTAL AGENTS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>0</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold tracking-wider" style={{ color: '#9f7a5f' }}>WORK ORDERS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#453227' }}>6</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border rounded-3xl p-6" style={{ borderColor: '#e6dfd5' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#453227' }}>Recent Activity</h2>

          {loading ? (
            <p className="text-center py-8" style={{ color: '#7c6251' }}>Loading recent repairs...</p>
          ) : error ? (
            <p className="text-center py-8 text-red-600">{error}</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-center py-8" style={{ color: '#7c6251' }}>No recent repair requests.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((repair) => (
                <div 
                  key={repair.id} 
                  className="flex items-start gap-4 p-4 rounded-2xl border"
                  style={{ borderColor: '#f1e9df' }}
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#d97706]"></div>
                  <div className="flex-1">
                    <p style={{ color: '#453227' }}>
                      <span className="font-semibold">WO-{String(repair.id).padStart(3, '0')}</span> — {repair.brand} {repair.model}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#7c6251' }}>
                      {repair.problemDescription}
                    </p>
                    <p className="text-xs mt-2" style={{ color: '#9f7a5f' }}>
                      {new Date(repair.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#fef3c7] text-[#b45309]">
                    {repair.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}