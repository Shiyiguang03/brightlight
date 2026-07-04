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
  customerName?: string;
}

type FilterType = 'urgent' | 'recent' | 'forgotten';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Pending': { bg: '#fef3c7', text: '#92400e' },
  'Received': { bg: '#dbeafe', text: '#1e40af' },
  'Diagnosed': { bg: '#e0e7ff', text: '#3730a3' },
  'In Progress': { bg: '#fefce8', text: '#854d0e' },
  'Awaiting Parts': { bg: '#fce7f3', text: '#9d174d' },
  'Ready for Collection': { bg: '#dcfce7', text: '#166534' },
  'Completed': { bg: '#dcfce7', text: '#166534' },
  'Cancelled': { bg: '#fee2e2', text: '#991b1b' },
};

export default function StaffRepairsDashboard() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('urgent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/repairs?limit=150')
      .then(res => res.json())
      .then(result => {
        if (result.data && Array.isArray(result.data)) {
          setRepairs(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Generate proper Work Order Number
  const getWorkOrderNumber = (repair: Repair): string => {
    if (repair.workOrderNumber) return repair.workOrderNumber;

    // Fallback generation
    const isAgent = false; // You can improve this logic later
    const source = isAgent ? 'A-BL' : 'WEB';
    const date = new Date(repair.createdAt);
    const datePart = date.toLocaleDateString('en-GB').replace(/\//g, '');
    return `WO-${source}-${datePart}-${String(repair.id).padStart(3, '0')}`;
  };

  // Calculate days since created
  const getDaysSince = (dateString: string): number => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filter logic
  const getFilteredRepairs = (): Repair[] => {
    const now = new Date();

    if (activeFilter === 'urgent') {
      // Urgent = Pending or Received + older than 3 days
      return repairs
        .filter(r =>
          (r.status === 'Pending' || r.status === 'Received') &&
          getDaysSince(r.createdAt) >= 3
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(0, 6); // Show max 6 urgent
    }

    if (activeFilter === 'forgotten') {
      // Forgotten = Pending/Received/Diagnosed + older than 7 days
      return repairs
        .filter(r =>
          ['Pending', 'Received', 'Diagnosed'].includes(r.status) &&
          getDaysSince(r.createdAt) >= 7
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    // Recent = Last 7 days
    return repairs
      .filter(r => getDaysSince(r.createdAt) <= 7)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredRepairs = getFilteredRepairs();
  const urgentCount = repairs.filter(r =>
    (r.status === 'Pending' || r.status === 'Received') && getDaysSince(r.createdAt) >= 3
  ).length;

  const getStatusStyle = (status: string) => STATUS_COLORS[status] || { bg: '#f3e8ff', text: '#6b21a8' };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#453227' }}>
              Repair Dashboard
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#7c6251' }}>
              Overview of all repair requests
            </p>
          </div>
          <Link
            href="/staff/new-repair"
            className="px-5 py-2.5 rounded-2xl font-semibold text-sm flex items-center gap-2"
            style={{ backgroundColor: '#d97706', color: 'white' }}
          >
            + New Repair
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-3xl p-5" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-medium tracking-wider" style={{ color: '#9f7a5f' }}>TOTAL</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#453227' }}>{repairs.length}</p>
          </div>
          <div className="bg-white border rounded-3xl p-5 border-red-200" style={{ backgroundColor: '#fef2f2' }}>
            <p className="text-xs font-medium tracking-wider text-red-600">URGENT</p>
            <p className="text-3xl font-bold mt-1 text-red-600">{urgentCount}</p>
          </div>
          <div className="bg-white border rounded-3xl p-5" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-medium tracking-wider" style={{ color: '#9f7a5f' }}>IN PROGRESS</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#2563eb' }}>
              {repairs.filter(r => r.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-white border rounded-3xl p-5" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-xs font-medium tracking-wider" style={{ color: '#9f7a5f' }}>COMPLETED</p>
            <p className="text-3xl font-bold mt-1" style={{ color: '#16a34a' }}>
              {repairs.filter(r => r.status === 'Completed').length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-1" style={{ borderColor: '#e6dfd5' }}>
          {[
            { key: 'urgent', label: 'Urgent', count: urgentCount },
            { key: 'recent', label: 'Recent (7 days)' },
            { key: 'forgotten', label: 'Forgotten (>7 days)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as FilterType)}
              className={`px-5 py-2 text-sm font-semibold rounded-t-2xl transition-all ${activeFilter === tab.key
                  ? 'border-b-2'
                  : 'text-[#7c6251] hover:text-[#453227]'
                }`}
              style={{
                borderColor: activeFilter === tab.key ? '#d97706' : 'transparent',
                color: activeFilter === tab.key ? '#d97706' : undefined
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Urgent Warning Banner */}
        {activeFilter === 'urgent' && urgentCount > 0 && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 flex items-center gap-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <p className="text-sm text-red-700">
              <span className="font-semibold">{urgentCount} order(s)</span> have been pending for more than 3 days. Please follow up.
            </p>
          </div>
        )}

        {/* Repairs List */}
        {loading ? (
          <div className="text-center py-12 text-[#7c6251]">Loading...</div>
        ) : filteredRepairs.length === 0 ? (
          <div className="bg-white border rounded-3xl p-10 text-center" style={{ borderColor: '#e6dfd5' }}>
            <p style={{ color: '#7c6251' }}>No orders in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRepairs.map((repair) => {
              const days = getDaysSince(repair.createdAt);
              const isUrgent = (repair.status === 'Pending' || repair.status === 'Received') && days >= 3;
              const statusStyle = getStatusStyle(repair.status);

              return (
                <div
                  key={repair.id}
                  className={`bg-white border rounded-3xl p-6 transition-all ${isUrgent ? 'border-red-300 shadow-sm' : ''}`}
                  style={{ borderColor: isUrgent ? '#fecaca' : '#e6dfd5' }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-mono text-xs tracking-[2px]" style={{ color: '#9f7a5f' }}>
                        {getWorkOrderNumber(repair)}
                      </div>
                      <h3 className="font-semibold text-xl mt-1 leading-tight" style={{ color: '#453227' }}>
                        {repair.brand} {repair.model}
                      </h3>
                    </div>

                    <span
                      className="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {repair.status}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-2 mb-4" style={{ color: '#5c4436' }}>
                    {repair.problemDescription}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#f5f0e9' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: '#9f7a5f' }}>
                        {days} day{days > 1 ? 's' : ''} ago
                      </span>
                      {isUrgent && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-600">
                          URGENT
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/staff/repair/${repair.id}`}
                      className="px-5 py-2 text-sm font-semibold rounded-2xl transition active:scale-[0.985]"
                      style={{ backgroundColor: isUrgent ? '#dc2626' : '#d97706', color: 'white' }}
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}