'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

export default function StaffDashboard() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/repairs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepairs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = repairs.length;
  const pending = repairs.filter(r => r.status === 'Pending').length;
  const inProgress = repairs.filter(r => r.status === 'In Progress').length;
  const completed = repairs.filter(r => r.status === 'Completed').length;

  const recentRepairs = [...repairs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>
          Welcome back, Staff 👋
        </h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>
          Here's an overview of all repair requests.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>TOTAL REPAIRS</p>
            <p className="text-4xl font-bold mt-1" style={{ color: '#453227' }}>{total}</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>PENDING</p>
            <p className="text-4xl font-bold mt-1" style={{ color: '#d97706' }}>{pending}</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>IN PROGRESS</p>
            <p className="text-4xl font-bold mt-1" style={{ color: '#2563eb' }}>{inProgress}</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-bold" style={{ color: '#9f7a5f' }}>COMPLETED</p>
            <p className="text-4xl font-bold mt-1" style={{ color: '#16a34a' }}>{completed}</p>
          </div>
        </div>

        {/* Recent Repairs */}
        <div className="bg-white border rounded-3xl p-6" style={{ borderColor: '#e6dfd5' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={{ color: '#453227' }}>Recent Repair Requests</h2>
            <Link href="/staff" className="text-sm font-semibold" style={{ color: '#d97706' }}>
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : recentRepairs.length === 0 ? (
            <p className="text-center py-10">No repair requests yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRepairs.map((repair) => (
                <div key={repair.id} className="border rounded-2xl p-5" style={{ borderColor: '#e6dfd5' }}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-mono text-sm" style={{ color: '#9f7a5f' }}>
                        WO-{String(repair.id).padStart(3, '0')}
                      </p>
                      <p className="font-semibold mt-1" style={{ color: '#453227' }}>
                        {repair.brand} {repair.model}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 h-fit rounded-full font-medium bg-[#fef3c7] text-[#b45309]">
                      {repair.status}
                    </span>
                  </div>

                  <p className="text-sm mt-3 line-clamp-2" style={{ color: '#7c6251' }}>
                    {repair.problemDescription}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs" style={{ color: '#9f7a5f' }}>
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </span>
                    <Link 
                      href={`/staff/repair/${repair.id}`}
                      className="px-5 py-1.5 text-sm font-semibold rounded-xl text-white"
                      style={{ backgroundColor: '#d97706' }}
                    >
                      Manage
                    </Link>
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