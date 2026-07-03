'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Repair {
  id: number;
  workOrderNumber?: string;
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
      const res = await fetch('/api/admin/repairs?limit=100');
      const result = await res.json();

      if (result.data && Array.isArray(result.data)) {
        setRepairs(result.data);
        setFilteredRepairs(result.data);
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

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => {
        const woNumber = r.workOrderNumber?.toLowerCase() || '';
        const fallbackWo = `wo-${String(r.id).padStart(3, '0')}`;

        return (
          woNumber.includes(term) ||
          fallbackWo.includes(term) ||
          r.brand?.toLowerCase().includes(term) ||
          r.model?.toLowerCase().includes(term) ||
          r.problemDescription?.toLowerCase().includes(term)
        );
      });
    }

    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }

    setFilteredRepairs(result);
  }, [searchTerm, statusFilter, repairs]);

  const statusOptions = ['All', 'Pending', 'Received', 'Diagnosed', 'In Progress', 'Awaiting Parts', 'Ready for Collection', 'Completed'];

  // Get display Work Order Number
  const getWorkOrderDisplay = (repair: Repair) => {
    return repair.workOrderNumber || `WO-${String(repair.id).padStart(3, '0')}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>All Repair Requests</h1>
            <p style={{ color: '#5c4436' }}>Search and manage repair work orders</p>
          </div>
          <Link
            href="/staff"
            className="text-sm font-semibold px-4 py-2 rounded-xl border hover:bg-[#fef3c7] transition"
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
            className="flex-1 border rounded-2xl px-5 py-3 text-sm placeholder:text-[#5c4436] placeholder:font-medium"
            style={{ borderColor: '#d4c3b0', backgroundColor: '#ffffff' }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-2xl px-5 py-3 text-sm w-full md:w-64"
            style={{ borderColor: '#d4c3b0', backgroundColor: '#ffffff', color: '#453227' }}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Table / Cards */}
        <div className="bg-white border rounded-3xl overflow-hidden" style={{ borderColor: '#e6dfd5' }}>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#f8f1e3' }}>
                  <th className="text-left px-6 py-4 font-semibold" style={{ color: '#5c4436' }}>WO #</th>
                  <th className="text-left px-6 py-4 font-semibold" style={{ color: '#5c4436' }}>Device</th>
                  <th className="text-left px-6 py-4 font-semibold" style={{ color: '#5c4436' }}>Problem</th>
                  <th className="text-left px-6 py-4 font-semibold" style={{ color: '#5c4436' }}>Status</th>
                  <th className="text-left px-6 py-4 font-semibold" style={{ color: '#5c4436' }}>Date</th>
                  <th className="w-32"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10" style={{ color: '#7c6251' }}>
                      Loading repairs...
                    </td>
                  </tr>
                ) : filteredRepairs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10" style={{ color: '#7c6251' }}>
                      No repair requests found.
                    </td>
                  </tr>
                ) : (
                  filteredRepairs.map((repair) => (
                    <tr key={repair.id} className="border-t hover:bg-[#fefce8] transition" style={{ borderColor: '#f1e9df' }}>
                      <td className="px-6 py-4 font-mono font-semibold" style={{ color: '#453227' }}>
                        {getWorkOrderDisplay(repair)}
                      </td>
                      <td className="px-6 py-4 font-medium" style={{ color: '#453227' }}>
                        {repair.brand} {repair.model}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#5c4436' }}>
                        {repair.problemDescription?.length > 60
                          ? repair.problemDescription.substring(0, 60) + '...'
                          : repair.problemDescription}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e]">
                          {repair.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#7c6251' }}>
                        {new Date(repair.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/staff/repair/${repair.id}`}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-white transition active:scale-95"
                          style={{ backgroundColor: '#d97706' }}
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y" style={{ borderColor: '#f1e9df' }}>
            {loading ? (
              <div className="text-center py-10" style={{ color: '#7c6251' }}>
                Loading repairs...
              </div>
            ) : filteredRepairs.length === 0 ? (
              <div className="text-center py-10" style={{ color: '#7c6251' }}>
                No repair requests found.
              </div>
            ) : (
              filteredRepairs.map((repair) => (
                <div key={repair.id} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-mono font-bold text-lg" style={{ color: '#453227' }}>
                        {getWorkOrderDisplay(repair)}
                      </div>
                      <div className="font-medium mt-1" style={{ color: '#453227' }}>
                        {repair.brand} {repair.model}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e] whitespace-nowrap">
                      {repair.status}
                    </span>
                  </div>

                  <p className="text-sm mb-4" style={{ color: '#5c4436' }}>
                    {repair.problemDescription?.length > 80
                      ? repair.problemDescription.substring(0, 80) + '...'
                      : repair.problemDescription}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#7c6251' }}>
                      {new Date(repair.createdAt).toLocaleDateString()}
                    </span>

                    <Link
                      href={`/staff/repair/${repair.id}`}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl text-sm font-semibold text-white active:scale-95 transition"
                      style={{ backgroundColor: '#d97706' }}
                    >
                      Manage →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}