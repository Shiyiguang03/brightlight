'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface RepairRequest {
  id: number;
  workOrderNumber?: string;
  customerName?: string;
  user?: { fullName: string; phone: string };
  deviceType: string;
  brand: string;
  model: string;
  status: string;
  urgency: string;
  createdAt: string;
}

export default function AgentMyRequests() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Generate standard format: WO-A-BL-DDMMYY-XXX
  const getWorkOrderNumber = (req: RepairRequest) => {
    if (req.workOrderNumber) {
      return req.workOrderNumber;
    }

    // Fallback: Generate from createdAt date + ID
    const date = new Date(req.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const datePart = `${day}${month}${year}`;
    const numberPart = String(req.id).padStart(3, '0');

    return `WO-A-BL-${datePart}-${numberPart}`;
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
          console.error('No user found in sessionStorage');
          setLoading(false);
          return;
        }

        const currentUser = JSON.parse(storedUser);
        const res = await fetch(`/api/agent/my-requests?agentId=${currentUser.id}`);

        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else {
          const error = await res.json();
          console.error('API Error:', error);
        }
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusStyle = (status: string) => {
    if (status === 'Pending') return { bg: '#fef3c7', text: '#92400e' };
    if (status === 'In Progress') return { bg: '#dbeafe', text: '#1e40af' };
    if (status === 'Completed') return { bg: '#dcfce7', text: '#166534' };
    return { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1f130b' }}>My Repair Requests</h1>
            <p style={{ color: '#7c6251' }}>All repair requests you have submitted</p>
          </div>
          <Link
            href="/agent/request-repair"
            className="px-6 py-3 rounded-2xl font-semibold text-white text-sm"
            style={{ backgroundColor: '#d97706' }}
          >
            + New Repair Request
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12" style={{ color: '#7c6251' }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center" style={{ borderColor: '#e6dfd5' }}>
            <p style={{ color: '#5c4436' }}>You have not submitted any repair requests yet.</p>
            <Link
              href="/agent/request-repair"
              className="inline-block mt-4 px-6 py-3 rounded-2xl font-semibold text-white text-sm"
              style={{ backgroundColor: '#d97706' }}
            >
              Submit New Request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const statusStyle = getStatusStyle(req.status);
              const workOrderNumber = getWorkOrderNumber(req);
              const customerDisplay = req.customerName || req.user?.fullName || 'Walk-in Customer';

              return (
                <Link
                  key={req.id}
                  href={`/agent/request/${req.id}`}
                  className="block bg-white border rounded-2xl p-6 hover:shadow-md transition"
                  style={{ borderColor: '#e6dfd5' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-bold text-xl" style={{ color: '#1f130b' }}>
                          {workOrderNumber}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {req.status}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-100" style={{ color: '#7c6251' }}>
                          {req.urgency}
                        </span>
                      </div>

                      <h3 className="font-semibold text-lg" style={{ color: '#1f130b' }}>
                        {req.brand} {req.model} ({req.deviceType})
                      </h3>

                      <p className="text-sm mt-1" style={{ color: '#5c4436' }}>
                        Customer: {customerDisplay}
                        {req.user?.phone && ` (${req.user.phone})`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs" style={{ color: '#7c6251' }}>Submitted on</p>
                      <p className="font-semibold" style={{ color: '#453227' }}>
                        {formatDateTime(req.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}