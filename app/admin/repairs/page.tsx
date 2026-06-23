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
  user: {
    fullName: string;
  };
}

export default function RepairRequestsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      const data = await res.json();
      setRepairs(data);
    } catch (error) {
      console.error('Failed to fetch repairs');
    } finally {
      setLoading(false);
    }
  };

  const filteredRepairs = activeTab === 'ALL' 
    ? repairs 
    : repairs.filter(r => r.status.toLowerCase().includes(activeTab.toLowerCase()));

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return '#fef3c7';
    if (status === 'In Progress') return '#dbeafe';
    if (status === 'Completed') return '#dcfce7';
    return '#f3e8ff';
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#453227' }}>Repair requests</h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>All customer work orders, sorted by most recent.</p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', 'Pending', 'In Progress', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-[#d97706] text-white' : 'bg-white border hover:bg-[#fef3c7]'}`}
              style={{ borderColor: '#e6dfd5', color: activeTab === tab ? 'white' : '#453227' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Repair Cards */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredRepairs.length === 0 ? (
          <div className="text-center py-12 text-[#7c6251]">No repair requests found.</div>
        ) : (
          <div className="space-y-4">
            {filteredRepairs.map((repair) => (
              <div key={repair.id} className="bg-white border rounded-2xl p-5" style={{ borderColor: '#e6dfd5' }}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-x-3">
                      <span className="font-mono text-sm px-3 py-1 rounded-lg" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
                        WO-{String(repair.id).padStart(3, '0')}
                      </span>
                      <span className="font-semibold text-lg" style={{ color: '#453227' }}>
                        {repair.brand} {repair.model} — {repair.problemDescription}
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: '#7c6251' }}>
                      {repair.user.fullName} • {new Date(repair.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: getStatusColor(repair.status), color: '#453227' }}
                    >
                      {repair.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: repair.status === 'Completed' ? '100%' : repair.status === 'In Progress' ? '60%' : '30%',
                      backgroundColor: '#d97706'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}