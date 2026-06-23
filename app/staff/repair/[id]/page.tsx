'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

const STATUS_OPTIONS = [
  'Pending',
  'Received',
  'Diagnosed',
  'In Progress',
  'Awaiting Parts',
  'Ready for Collection',
  'Completed',
  'Cancelled',
];

export default function StaffRepairDetail() {
  const params = useParams();
  const id = params.id as string;

  const [repair, setRepair] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRepair();
  }, [id]);

  const fetchRepair = async () => {
    const res = await fetch(`/api/admin/repairs`);
    const data = await res.json();
    const found = data.find((r: any) => r.id === parseInt(id));
    if (found) {
      setRepair(found);
      setStatus(found.status);
      setNotes(found.notes || '');
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/repairs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      alert('Updated successfully!');
      fetchRepair();
    } catch (error) {
      alert('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!repair) return <div className="p-8">Repair not found.</div>;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>
          Work Order #WO-{String(repair.id).padStart(3, '0')}
        </h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>
          {repair.user.fullName} • {repair.user.phone}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Repair Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4">Device Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Device:</strong> {repair.deviceType}</div>
                <div><strong>Brand & Model:</strong> {repair.brand} {repair.model}</div>
                <div><strong>Serial Number:</strong> {repair.serialNumber || '-'}</div>
                <div><strong>Problem:</strong> {repair.problemDescription}</div>
              </div>
            </div>

            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4">Additional Info</h3>
              <p className="text-sm whitespace-pre-wrap">{repair.notes || 'No notes yet.'}</p>
            </div>
          </div>

          {/* Right: Status & Notes */}
          <div className="space-y-6">
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4">Update Status</h3>
              
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 mb-4"
                style={{ borderColor: '#e6dfd5' }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <textarea
                placeholder="Add repair notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 h-32 mb-4"
                style={{ borderColor: '#e6dfd5' }}
              />

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full py-3 rounded-xl font-bold text-white"
                style={{ backgroundColor: '#d97706' }}
              >
                {saving ? 'Saving...' : 'Update Repair'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}