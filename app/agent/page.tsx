'use client';

import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function AgentDashboard() {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f130b' }}>Agent Dashboard</h1>
        <p className="mb-8" style={{ color: '#5c4436' }}>Welcome back! Here's your overview today.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-medium" style={{ color: '#5c4436' }}>TOTAL REQUESTS</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#1f130b' }}>12</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-medium" style={{ color: '#5c4436' }}>PENDING</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#b45309' }}>4</p>
          </div>
          <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
            <p className="text-sm font-medium" style={{ color: '#5c4436' }}>COMPLETED THIS WEEK</p>
            <p className="text-4xl font-bold mt-2" style={{ color: '#166534' }}>7</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/agent/request-repair" 
              className="block p-6 bg-white border rounded-2xl hover:shadow-md transition"
              style={{ borderColor: '#e6dfd5' }}
            >
              <div className="text-3xl mb-3">📝</div>
              <p className="font-bold text-lg" style={{ color: '#1f130b' }}>Submit New Repair Request</p>
              <p className="text-sm mt-1" style={{ color: '#5c4436' }}>Help customer fill in repair form</p>
            </Link>

            <Link 
              href="/agent/my-requests" 
              className="block p-6 bg-white border rounded-2xl hover:shadow-md transition"
              style={{ borderColor: '#e6dfd5' }}
            >
              <div className="text-3xl mb-3">📋</div>
              <p className="font-bold text-lg" style={{ color: '#1f130b' }}>My Submitted Requests</p>
              <p className="text-sm mt-1" style={{ color: '#5c4436' }}>View all requests you helped create</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}