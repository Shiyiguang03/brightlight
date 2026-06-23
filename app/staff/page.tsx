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
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/repairs')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        if (Array.isArray(data)) {
          setRepairs(data);
        } else {
          setError('Data format is invalid');
        }
      })
      .catch(() => setError('Failed to load repair requests'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;
  }

  if (error) {
    return <AdminLayout><div className="p-8 text-center text-red-600">{error}</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>
          Staff Dashboard
        </h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>
          Manage all customer repair requests
        </p>

        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: '#e6dfd5' }}>
          <table className="w-full">
            <thead>
              <tr className="bg-[#fef3c7]">
                <th className="text-left px-6 py-4 font-semibold">WO #</th>
                <th className="text-left px-6 py-4 font-semibold">Device</th>
                <th className="text-left px-6 py-4 font-semibold">Problem</th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {repairs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#7c6251]">
                    No repair requests yet.
                  </td>
                </tr>
              ) : (
                repairs.map((repair) => (
                  <tr key={repair.id} className="border-t hover:bg-[#fefce8]">
                    <td className="px-6 py-4 font-mono">
                      WO-{String(repair.id).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">{repair.brand} {repair.model}</td>
                    <td className="px-6 py-4">{repair.problemDescription}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fef3c7] text-[#b45309]">
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/staff/repair/${repair.id}`} 
                        className="text-[#d97706] hover:underline font-medium"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}