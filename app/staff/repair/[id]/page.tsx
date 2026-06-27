'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

const STATUS_OPTIONS = [
  'Pending', 'Received', 'Diagnosed', 'In Progress', 
  'Awaiting Parts', 'Ready for Collection', 'Completed', 'Cancelled'
];

export default function StaffRepairDetail() {
  const params = useParams();
  const id = params.id as string;

  const [repair, setRepair] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [accessories, setAccessories] = useState({
    hasCharger: false,
    hasPowerCord: false,
    hasMouse: false,
    hasBag: false,
    otherItems: '',
  });

  useEffect(() => {
    fetchRepair();
  }, [id]);

  const fetchRepair = async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      const data = await res.json();

      if (Array.isArray(data)) {
        const found = data.find((r: any) => r.id === parseInt(id));
        if (found) {
          setRepair(found);
          setStatus(found.status || 'Pending');
          setNotes(found.notes || '');

          setAccessories({
            hasCharger: found.hasCharger || false,
            hasPowerCord: found.hasPowerCord || false,
            hasMouse: found.hasMouse || false,
            hasBag: found.hasBag || false,
            otherItems: found.otherItems || '',
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const res = await fetch(`/api/admin/repairs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          ...accessories,
        }),
      });

      if (res.ok) {
        setSaveMessage('Saved successfully!');
        // Refresh data from database
        await fetchRepair();
        
        // Clear message after 2 seconds
        setTimeout(() => setSaveMessage(''), 2000);
      } else {
        setSaveMessage('Failed to save. Please try again.');
      }
    } catch (error) {
      setSaveMessage('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleAccessoryChange = (key: string, value: boolean | string) => {
    setAccessories(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (!repair) return <AdminLayout><div className="p-8">Repair not found.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#453227' }}>
          Work Order #WO-{String(repair.id).padStart(3, '0')}
        </h1>
        <p className="mb-6" style={{ color: '#7c6251' }}>
          {repair.user?.fullName || 'Unknown Customer'} 
          {repair.user?.phone && ` • ${repair.user.phone}`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Device Information */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Device Information</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div><span style={{ color: '#9f7a5f' }}>Device Type:</span> <span style={{ color: '#453227' }}>{repair.deviceType}</span></div>
                <div><span style={{ color: '#9f7a5f' }}>Brand & Model:</span> <span style={{ color: '#453227' }}>{repair.brand} {repair.model}</span></div>
                <div><span style={{ color: '#9f7a5f' }}>Serial Number:</span> <span style={{ color: '#453227' }}>{repair.serialNumber || '—'}</span></div>
                <div className="col-span-2">
                  <span style={{ color: '#9f7a5f' }}>Problem Description:</span><br />
                  <span style={{ color: '#453227' }}>{repair.problemDescription}</span>
                </div>
              </div>
            </div>

            {/* Password */}
            {repair.password && (
              <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
                <h3 className="font-bold mb-2" style={{ color: '#453227' }}>Device Password</h3>
                <p className="text-lg font-mono px-4 py-2 rounded-xl inline-block" style={{ backgroundColor: '#fef3c7', color: '#78350f' }}>
                  {repair.password}
                </p>
              </div>
            )}

            {/* Uploaded Photos */}
            {repair.images && repair.images.length > 0 && (
              <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
                <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Uploaded Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {repair.images.map((url: string, index: number) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt={`Photo ${index + 1}`} className="w-full h-40 object-cover rounded-xl border hover:opacity-90 transition" style={{ borderColor: '#e6dfd5' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Update Status + Notes */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Update Status</h3>
              
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 mb-4 text-lg"
                style={{ borderColor: '#e6dfd5', color: '#453227' }}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Repair Notes */}
              <div className="mb-4">
                <label className="block font-bold mb-2" style={{ color: '#453227' }}>Repair Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 h-32"
                  style={{ borderColor: '#e6dfd5', color: '#453227' }}
                  placeholder="Write notes here..."
                />
              </div>

              {saveMessage && (
                <p className="text-sm mb-3" style={{ color: saveMessage.includes('success') ? '#16a34a' : '#dc2626' }}>
                  {saveMessage}
                </p>
              )}

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full py-3 rounded-xl font-bold text-white text-lg"
                style={{ backgroundColor: '#d97706' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Accessories */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Accessories Included</h3>
              <div className="space-y-3 text-sm">
                {[
                  { key: 'hasCharger', label: 'Charger' },
                  { key: 'hasPowerCord', label: 'Power Cord' },
                  { key: 'hasMouse', label: 'Mouse' },
                  { key: 'hasBag', label: 'Laptop Bag' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-x-3 cursor-pointer" style={{ color: '#453227' }}>
                    <input
                      type="checkbox"
                      checked={accessories[item.key as keyof typeof accessories] as boolean}
                      onChange={(e) => handleAccessoryChange(item.key, e.target.checked)}
                      className="w-5 h-5 accent-[#d97706]"
                    />
                    {item.label}
                  </label>
                ))}

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#9f7a5f' }}>Other Items</label>
                  <input
                    type="text"
                    value={accessories.otherItems}
                    onChange={(e) => handleAccessoryChange('otherItems', e.target.value)}
                    className="w-full border rounded-xl px-4 py-2"
                    style={{ borderColor: '#e6dfd5', color: '#453227' }}
                    placeholder="e.g. External HDD"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}