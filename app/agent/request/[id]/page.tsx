'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface RepairRequest {
  id: number;
  user?: { fullName: string; phone: string };
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  problemDescription: string;
  urgency: string;
  preferredStartDate?: string;
  internalNotes?: string;
  status: string;
  createdAt: string;
  images?: string[];
  deliveryOption?: string;
  pickupAddress?: string;
}

export default function AgentRequestDetail() {
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to format date + time
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

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/repair-requests/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRequest(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p style={{ color: '#5c4436' }}>Loading request details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!request) {
    return (
      <AdminLayout>
        <div className="text-center py-10">
          <p style={{ color: '#b45309' }}>Repair request not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1f130b' }}>
              Request #{request.id}
            </h1>
            <p style={{ color: '#7c6251', marginTop: '4px' }}>
              Submitted on <span style={{ color: '#453227', fontWeight: '600' }}>{formatDateTime(request.createdAt)}</span>
            </p>
          </div>
          <span 
            className="px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: request.status === 'Pending' ? '#fef3c7' : 
                             request.status === 'In Progress' ? '#dbeafe' : '#dcfce7',
              color: request.status === 'Pending' ? '#92400e' : 
                     request.status === 'In Progress' ? '#1e40af' : '#166534'
            }}
          >
            {request.status}
          </span>
        </div>

        <div className="bg-white border rounded-2xl p-8" style={{ borderColor: '#e6dfd5' }}>

          {/* Submission Info */}
          <div className="mb-8 pb-6 border-b" style={{ borderColor: '#e6dfd5' }}>
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Request Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>SUBMITTED ON</p>
                <p style={{ color: '#1f130b', fontWeight: '500' }}>{formatDateTime(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>URGENCY</p>
                <p style={{ color: '#1f130b' }}>{request.urgency}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>FULL NAME</p>
                <p style={{ color: '#1f130b' }}>{request.user?.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>PHONE</p>
                <p style={{ color: '#1f130b' }}>{request.user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Device Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>DEVICE TYPE</p>
                <p style={{ color: '#1f130b' }}>{request.deviceType}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>BRAND & MODEL</p>
                <p style={{ color: '#1f130b' }}>{request.brand} {request.model}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>SERIAL NUMBER</p>
                <p style={{ color: '#1f130b' }}>{request.serialNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1f130b' }}>Problem Description</h3>
            <p className="whitespace-pre-wrap" style={{ color: '#1f130b' }}>{request.problemDescription}</p>
          </div>

          {/* Delivery Option */}
          {request.deliveryOption && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#1f130b' }}>Delivery Option</h3>
              <p style={{ color: '#1f130b' }}>
                {request.deliveryOption === 'pickup' ? 'We pick up from customer' : 'Customer drops off at shop'}
              </p>
              {request.deliveryOption === 'pickup' && request.pickupAddress && (
                <p className="mt-1 text-sm" style={{ color: '#5c4436' }}>
                  Pickup Address: {request.pickupAddress}
                </p>
              )}
            </div>
          )}

          {/* Internal Notes */}
          {request.internalNotes && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#1f130b' }}>Internal Notes</h3>
              <p className="whitespace-pre-wrap bg-[#fefce8] p-4 rounded-xl" style={{ color: '#1f130b' }}>
                {request.internalNotes}
              </p>
            </div>
          )}

          {/* Photos */}
          {request.images && request.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Uploaded Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {request.images.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={url} 
                      alt={`Photo ${index + 1}`} 
                      className="w-full h-40 object-cover rounded-xl border hover:opacity-90 transition" 
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}