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

export default function StaffRepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setRepairs(data);
        setFilteredRepairs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Search + Filter
  useEffect(() => {
    let result = repairs;

    // Search
    if (searchTerm) {
      result = result.filter(r =>
        r.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.problemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `WO-${String(r.id).padStart(3, '0')}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }

    setFilteredRepairs(result);
  }, [searchTerm, statusFilter, repairs]);

  const statusOptions = ['All', 'Pending', 'Received', 'Diagnosed', 'In Progress', 'Awaiting Parts', 'Ready for Collection', 'Completed'];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>All Repair Requests</h1>
            <p style={{ color: '#7c6251' }}>Search and manage repair work orders</p>
          </div>
          <Link 
            href="/staff" 
            className="text-sm font-semibold px-4 py-2 rounded-xl border"
            style={{ borderColor: '#e6dfd5', color: '#453227' }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by WO number, brand, model, or problem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded-2xl px-5 py-3"
            style={{ borderColor: '#e6dfd5' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-2xl px-5 py-3 w-full md:w-64"
            style={{ borderColor: '#e6dfd5' }}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white border rounded-3xl overflow-hidden" style={{ borderColor: '#e6dfd5' }}>
          <table className="w-full">
            <thead>
              <tr className="bg-[#fef3c7]">
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#78350f' }}>WO #</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#78350f' }}>Device</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#78350f' }}>Problem</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#78350f' }}>Status</th>
                <th className="text-left px-6 py-4 font-semibold" style={{ color: '#78350f' }}>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
              ) : filteredRepairs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">No results found.</td></tr>
              ) : (
                filteredRepairs.map((repair) => (
                  <tr key={repair.id} className="border-t hover:bg-[#fefce8]">
                    <td className="px-6 py-4 font-mono text-[#453227]">WO-{String(repair.id).padStart(3, '0')}</td>
                    <td className="px-6 py-4 text-[#453227]">{repair.brand} {repair.model}</td>
                    <td className="px-6 py-4 text-[#453227]">{repair.problemDescription}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#fef3c7] text-[#b45309]">
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7c6251]">
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