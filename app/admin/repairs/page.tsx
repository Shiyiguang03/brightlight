'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface RepairRequest {
  id: number;
  user?: { fullName: string; phone: string };
  deviceType: string;
  brand: string;
  model: string;
  status: string;
  urgency: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminRepairsPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRepairs = async (page: number, status: string, search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        status: status,
        search: search,
      });

      const res = await fetch(`/api/admin/repairs?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setRequests(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchRepairs(currentPage, filterStatus, searchTerm);
  }, [currentPage, filterStatus, searchTerm]);

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // reset to first page
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page when searching
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Pending') return { bg: '#fef3c7', text: '#92400e' };
    if (status === 'In Progress') return { bg: '#dbeafe', text: '#1e40af' };
    if (status === 'Completed') return { bg: '#dcfce7', text: '#166534' };
    return { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1f130b' }}>All Repair Requests</h1>
            <p style={{ color: '#7c6251' }}>Manage and monitor all customer repair requests</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1">
            <input
  type="text"
  placeholder="Search by brand, model, device, or customer name..."
  value={searchTerm}
  onChange={handleSearch}
  className="w-full px-4 py-3 rounded-2xl border text-sm placeholder:text-[#6b5c4f]"
  style={{ 
    borderColor: '#e6dfd5', 
    backgroundColor: '#ffffff' 
  }}
/>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition whitespace-nowrap ${
                  filterStatus === status 
                    ? 'bg-[#d97706] text-white' 
                    : 'bg-white border text-[#5c4436] hover:bg-gray-50'
                }`}
                style={{ borderColor: '#e6dfd5' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12" style={{ color: '#7c6251' }}>
            Loading repair requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center" style={{ borderColor: '#e6dfd5' }}>
            <p style={{ color: '#5c4436' }}>No repair requests found.</p>
          </div>
        ) : (
          <>
            <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: '#e6dfd5' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#fdfbf7', borderBottom: '1px solid #e6dfd5' }}>
                    <th className="text-left px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>ID</th>
                    <th className="text-left px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>CUSTOMER</th>
                    <th className="text-left px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>DEVICE</th>
                    <th className="text-left px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>URGENCY</th>
                    <th className="text-left px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>STATUS</th>
                    <th className="text-left px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>SUBMITTED ON</th>
                    <th className="text-right px-6 py-4 text-xs font-bold tracking-wider" style={{ color: '#7c6251' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    const statusStyle = getStatusStyle(req.status);
                    return (
                      <tr key={req.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#f3f4f6' }}>
                        <td className="px-6 py-4 font-bold" style={{ color: '#1f130b' }}>#{req.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p style={{ color: '#1f130b', fontWeight: '500' }}>{req.user?.fullName || 'N/A'}</p>
                            <p className="text-xs" style={{ color: '#7c6251' }}>{req.user?.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p style={{ color: '#1f130b', fontWeight: '500' }}>{req.brand} {req.model}</p>
                          <p className="text-xs" style={{ color: '#7c6251' }}>{req.deviceType}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-3 py-1 rounded-full bg-gray-100" style={{ color: '#5c4436' }}>
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: '#453227' }}>
                          {new Date(req.createdAt).toLocaleString('en-MY', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: 'numeric', minute: '2-digit', hour12: true
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/admin/repairs/${req.id}`}
                            className="inline-block px-4 py-2 text-sm font-semibold rounded-xl border hover:bg-gray-50"
                            style={{ borderColor: '#e6dfd5', color: '#453227' }}
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm" style={{ color: '#7c6251' }}>
                  Showing page {pagination.page} of {pagination.totalPages} 
                  {' '}({pagination.total} total requests)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-50"
                    style={{ borderColor: '#e6dfd5' }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="px-4 py-2 rounded-xl border text-sm font-semibold disabled:opacity-50"
                    style={{ borderColor: '#e6dfd5' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}