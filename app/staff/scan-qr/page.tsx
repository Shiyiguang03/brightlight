'use client';

import { useState, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Html5Qrcode } from 'html5-qrcode';

const STATUS_OPTIONS = [
  'Pending', 'Received', 'Diagnosed', 'In Progress', 
  'Awaiting Parts', 'Ready for Collection', 'Completed', 'Cancelled'
];

interface Repair {
  id: number;
  brand: string;
  model: string;
  status: string;
  problemDescription: string;
  hasCharger?: boolean;
  hasPowerCord?: boolean;
  hasMouse?: boolean;
  hasBag?: boolean;
  otherItems?: string;
}

export default function StaffScanQRPage() {
  const [repair, setRepair] = useState<Repair | null>(null);
  const [manualWO, setManualWO] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const [condition, setCondition] = useState({
    hasDent: false,
    hasScratch: false,
    hasSticker: false,
    hasStain: false,
    otherConditions: [] as string[],
    newOther: '',
  });

  const [returnedAccessories, setReturnedAccessories] = useState({
    hasCharger: false,
    hasPowerCord: false,
    hasMouse: false,
    hasBag: false,
    otherItems: '',
  });

  const [status, setStatus] = useState('');

  // Quick action buttons
  const quickActions = [
    { label: 'Mark as Received', status: 'Received' },
    { label: 'Mark as Diagnosed', status: 'Diagnosed' },
    { label: 'Mark as In Progress', status: 'In Progress' },
    { label: 'Ready for Collection', status: 'Ready for Collection' },
    { label: 'Completed / Picked Up', status: 'Completed' },
  ];

  const toggleScanner = async () => {
    const qrCodeId = "qr-reader";

    if (!isScanning) {
      try {
        const html5QrCode = new Html5Qrcode(qrCodeId);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 280, height: 280 } },
          async (decodedText) => {
            await html5QrCode.stop();
            setIsScanning(false);
            await fetchRepairById(decodedText);
          },
          () => {}
        );

        setIsScanning(true);
      } catch (err) {
        setMessage("Could not access camera");
        setMessageType('error');
      }
    } else {
      if (html5QrCodeRef.current) {
        try { await html5QrCodeRef.current.stop(); } catch {}
        html5QrCodeRef.current = null;
      }
      setIsScanning(false);
    }
  };

  const fetchRepairById = async (idOrUrl: string) => {
    setLoading(true);
    setMessage('');

    try {
      let id = idOrUrl;
      if (idOrUrl.includes('/')) id = idOrUrl.split('/').pop() || idOrUrl;
      if (id.toUpperCase().startsWith('WO-')) id = id.replace(/WO-/i, '');
      id = id.replace(/^0+/, '');

      if (!id || isNaN(Number(id))) {
        setMessage('This is not a valid Work Order QR code.');
        setMessageType('error');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/repairs/${id}`);
      const data = await res.json();

      if (data && data.id) {
        setRepair(data);
        setStatus(data.status);

        setReturnedAccessories({
          hasCharger: data.hasCharger || false,
          hasPowerCord: data.hasPowerCord || false,
          hasMouse: data.hasMouse || false,
          hasBag: data.hasBag || false,
          otherItems: data.otherItems || '',
        });

        // ✅ Auto update status if quick action was selected
        if (selectedAction) {
          await updateStatusAutomatically(data.id, selectedAction);
        }
      } else {
        setMessage('Work Order not found.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error loading repair');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Auto update status after scanning
  const updateStatusAutomatically = async (repairId: number, newStatus: string) => {
    try {
      await fetch(`/api/admin/repairs/${repairId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setStatus(newStatus);
      setMessage(`Status updated to: ${newStatus}`);
      setMessageType('success');

      // If it's "Received", keep the form open for accessories & condition
      if (newStatus !== 'Received') {
        // For other statuses, close after 2 seconds
        setTimeout(() => {
          setRepair(null);
          setSelectedAction('');
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      setMessage('Failed to update status');
      setMessageType('error');
    }
  };

  const handleQuickAction = (actionStatus: string) => {
    setSelectedAction(actionStatus);
    setMessage(`Scan QR to mark as "${actionStatus}"`);
    setMessageType('success');
    
    // Auto start scanner if not already scanning
    if (!isScanning) {
      toggleScanner();
    }
  };

  const handleManualSearch = () => {
    if (!manualWO) return;
    const id = manualWO.replace('WO-', '').replace(/^0+/, '');
    fetchRepairById(id);
  };

  // Your existing functions (addOtherCondition, removeOtherCondition, handleSave) stay the same
  const addOtherCondition = () => { /* ... keep your code ... */ };
  const removeOtherCondition = (index: number) => { /* ... keep your code ... */ };

  const handleSave = async () => {
    if (!repair) return;
    setSaving(true);

    try {
      await fetch(`/api/admin/repairs/${repair.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...returnedAccessories }),
      });

      await fetch(`/api/admin/repairs/${repair.id}/condition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hasDent: condition.hasDent,
          hasScratch: condition.hasScratch,
          hasSticker: condition.hasSticker,
          hasStain: condition.hasStain,
          otherConditions: condition.otherConditions,
          returnedAccessories,
          notes: '',
        }),
      });

      setMessage('Changes saved successfully!');
      setMessageType('success');

      // Reset after saving
      setTimeout(() => {
        setRepair(null);
        setSelectedAction('');
        setMessage('');
      }, 1500);
    } catch (error) {
      setMessage('Failed to save');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

return (
  <AdminLayout>
    {/* ✅ Fixed: Full width on mobile, centered on desktop */}
    <div className="w-full px-4 py-6 md:max-w-4xl md:mx-auto md:py-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>
          Scan QR / Collection
        </h1>
        <p className="text-sm mt-1" style={{ color: '#7c6251' }}>
          Quick status update via QR scan
        </p>
      </div>

      {/* Quick Action Buttons - Mobile Friendly */}
      {!repair && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-3 px-1" style={{ color: '#5c4436' }}>
            Quick Actions (Tap then Scan)
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.status)}
                className="px-4 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.985] text-center"
                style={{ 
                  backgroundColor: selectedAction === action.status ? '#d97706' : '#fef3c7',
                  color: selectedAction === action.status ? '#ffffff' : '#92400e',
                  minHeight: '52px'
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

        {/* Scanner Section */}
        {!repair && (
          <div className="bg-white border rounded-2xl p-8 mb-8" style={{ borderColor: '#e6dfd5' }}>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#453227' }}>
                {selectedAction ? `Scan to mark as "${selectedAction}"` : 'Scan Work Order QR Code'}
              </h3>
            </div>

            <div id="qr-reader" className="mb-6 rounded-2xl overflow-hidden border bg-[#f8f1e9]" style={{ borderColor: '#e6dfd5', minHeight: '320px' }}></div>

            <button
              onClick={toggleScanner}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-lg"
              style={{ backgroundColor: isScanning ? '#b45309' : '#d97706' }}
            >
              {isScanning ? 'Stop Camera' : 'Start Camera Scanner'}
            </button>

            {message && (
              <div className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium text-center ${
                messageType === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {message}
              </div>
            )}

            {/* Manual Input */}
            <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e6dfd5' }}>
              <p className="text-sm font-medium mb-3" style={{ color: '#5c4436' }}>Or enter WO number manually</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="WO-001 or 1"
                  value={manualWO}
                  onChange={(e) => setManualWO(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                  className="flex-1 border rounded-xl px-5 py-3 text-lg placeholder:text-[#7c6251] text-[#453227]"
                  style={{ borderColor: '#d4c3b0' }}
                />
                <button onClick={handleManualSearch} className="px-8 rounded-xl font-semibold" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Repair Details + Form */}
        {repair && (
          <div className="space-y-6">
            {/* Repair Summary */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm" style={{ color: '#7c6251' }}>Work Order</p>
                  <p className="text-2xl font-bold" style={{ color: '#453227' }}>WO-{String(repair.id).padStart(3, '0')}</p>
                </div>
                <button onClick={() => { setRepair(null); setSelectedAction(''); setMessage(''); }} className="text-sm px-4 py-2 rounded-lg" style={{ color: '#7c6251' }}>
                  Cancel
                </button>
              </div>
              <p className="text-lg font-semibold" style={{ color: '#453227' }}>{repair.brand} {repair.model}</p>
            </div>

            {/* Show full form only if action is "Received" or no quick action was used */}
            {(selectedAction === 'Received' || !selectedAction) && (
              <>
                {/* Accessories */}
                <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
                  <h3 className="font-semibold text-lg mb-4" style={{ color: '#453227' }}>Accessories at Collection</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      { key: 'hasCharger', label: 'Charger' },
                      { key: 'hasPowerCord', label: 'Power Cord' },
                      { key: 'hasMouse', label: 'Mouse' },
                      { key: 'hasBag', label: 'Laptop Bag' },
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={returnedAccessories[item.key as keyof typeof returnedAccessories] as boolean}
                          onChange={(e) => setReturnedAccessories(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="w-5 h-5 accent-[#d97706]" />
                        <span style={{ color: '#453227' }}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1" style={{ color: '#5c4436' }}>Other Items</label>
                    <input type="text" value={returnedAccessories.otherItems} onChange={(e) => setReturnedAccessories(prev => ({ ...prev, otherItems: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-2 text-sm" style={{ borderColor: '#d4c3b0' }} placeholder="e.g. External HDD" />
                  </div>
                </div>

                {/* Physical Condition */}
                <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
                  <h3 className="font-semibold text-lg mb-4" style={{ color: '#453227' }}>Physical Condition</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                    {[
                      { key: 'hasDent', label: 'Dented' }, { key: 'hasScratch', label: 'Scratches' },
                      { key: 'hasSticker', label: 'Stickers' }, { key: 'hasStain', label: 'Stains' },
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={condition[item.key as keyof typeof condition] as boolean}
                          onChange={(e) => setCondition(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="w-5 h-5 accent-[#d97706]" />
                        <span style={{ color: '#453227' }}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Status & Save */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-semibold text-lg mb-4" style={{ color: '#453227' }}>Update Status</h3>
              
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-lg mb-5" style={{ borderColor: '#d4c3b0' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {message && <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}

              <button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-xl font-semibold text-white text-lg" style={{ backgroundColor: '#d97706' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}