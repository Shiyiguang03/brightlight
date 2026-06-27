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
  customerName?: string;
}

export default function StaffRepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all repairs
  useEffect(() => {
    fetch('/api/admin/repairs?limit=100')
      .then(res => res.json())
      .then(result => {
        if (result.data && Array.isArray(result.data)) {
          setRepairs(result.data);
          setFilteredRepairs(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter repairs when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRepairs(repairs);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = repairs.filter(repair =>
      repair.brand?.toLowerCase().includes(term) ||
      repair.model?.toLowerCase().includes(term) ||
      repair.deviceType?.toLowerCase().includes(term) ||
      repair.problemDescription?.toLowerCase().includes(term) ||
      repair.customerName?.toLowerCase().includes(term) ||
      repair.status?.toLowerCase().includes(term)
    );
    setFilteredRepairs(filtered);
  }, [searchTerm, repairs]);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>
            All Repair Requests
          </h1>
          <p className="mt-1" style={{ color: '#7c6251' }}>
            Manage and track all customer repair requests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by brand, model, device, problem, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border text-sm placeholder:text-[#5c4436] placeholder:font-medium"
            style={{ 
              borderColor: '#e6dfd5', 
              backgroundColor: '#ffffff' 
            }}
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-2xl p-4" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-bold" style={{ color: '#9f7a5f' }}>TOTAL</p>
            <p className="text-2xl font-bold" style={{ color: '#453227' }}>{repairs.length}</p>
          </div>
          <div className="bg-white border rounded-2xl p-4" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-bold" style={{ color: '#9f7a5f' }}>PENDING</p>
            <p className="text-2xl font-bold" style={{ color: '#d97706' }}>
              {repairs.filter(r => r.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white border rounded-2xl p-4" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-bold" style={{ color: '#9f7a5f' }}>IN PROGRESS</p>
            <p className="text-2xl font-bold" style={{ color: '#2563eb' }}>
              {repairs.filter(r => r.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-white border rounded-2xl p-4" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-bold" style={{ color: '#9f7a5f' }}>COMPLETED</p>
            <p className="text-2xl font-bold" style={{ color: '#16a34a' }}>
              {repairs.filter(r => r.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Repairs List */}
        {loading ? (
          <div className="text-center py-12">Loading repairs...</div>
        ) : filteredRepairs.length === 0 ? (
          <div className="bg-white border rounded-3xl p-8 text-center" style={{ borderColor: '#e6dfd5' }}>
            <p style={{ color: '#7c6251' }}>No repair requests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepairs.map((repair) => (
              <div key={repair.id} className="bg-white border rounded-2xl p-5" style={{ borderColor: '#e6dfd5' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-sm" style={{ color: '#9f7a5f' }}>
                      WO-{String(repair.id).padStart(3, '0')}
                    </p>
                    <p className="font-semibold mt-1 text-lg" style={{ color: '#453227' }}>
                      {repair.brand} {repair.model}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#fef3c7] text-[#b45309]">
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
                    className="px-5 py-1.5 text-sm font-semibold rounded-xl text-white transition hover:opacity-90"
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
    </AdminLayout>
  );
}