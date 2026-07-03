'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import QRCode from 'qrcode';

const STATUS_OPTIONS = [
  'Pending', 'Received', 'Diagnosed', 'In Progress',
  'Awaiting Parts', 'Ready for Collection', 'Completed', 'Cancelled'
];

export default function StaffRepairDetail() {
  const params = useParams();
  const id = params.id as string;

  const [repair, setRepair] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');

  const [accessories, setAccessories] = useState({
    hasCharger: false,
    hasPowerCord: false,
    hasMouse: false,
    hasBag: false,
    otherItems: '',
  });

  // ==================== GET WORK ORDER NUMBER ====================
  const getWorkOrderNumber = (repairData: any): string => {
    if (!repairData) return '';
    if (repairData.workOrderNumber) return repairData.workOrderNumber;

    const isAgentCreated = repairData.user?.role === 'AGENT' || repairData.user?.role === 'SUPER ADMIN';
    const source = isAgentCreated ? 'A-BL' : 'WEB';
    const datePart = new Date().toLocaleDateString('en-GB').replace(/\//g, '');
    const sequence = String(repairData.id).padStart(3, '0');

    return `WO-${source}-${datePart}-${sequence}`;
  };

  useEffect(() => {
    fetchRepair();
  }, [id]);

  // Generate QR Code
  useEffect(() => {
    if (repair) {
      const generateQR = async () => {
        const workOrderNumber = getWorkOrderNumber(repair);
        const dataUrl = await QRCode.toDataURL(workOrderNumber, { width: 200, margin: 2 });
        setQrCodeUrl(dataUrl);
      };
      generateQR();
    }
  }, [repair]);

  const fetchRepair = async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      const result = await res.json();
      const data = result.data || result;

      if (Array.isArray(data)) {
        const found = data.find((r: any) => r.id === parseInt(id));
        if (found) {
          setRepair(found);
          setStatus(found.status || 'Pending');
          setAccessories({
            hasCharger: found.hasCharger || false,
            hasPowerCord: found.hasPowerCord || false,
            hasMouse: found.hasMouse || false,
            hasBag: found.hasBag || false,
            otherItems: found.otherItems || '',
          });

          const notesRes = await fetch(`/api/admin/repairs/${id}/notes`);
          const notesData = await notesRes.json();
          setNotes(Array.isArray(notesData) ? notesData : []);
        }
      }
    } catch (error) {
      console.error(error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/repairs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...accessories }),
      });
      setSaveMessage('Status updated!');
      await fetchRepair();
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      setSaveMessage('Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  // ==================== CONTACT CUSTOMER (Open Chat Directly) ====================
  const handleContactCustomer = () => {
    if (!repair?.user?.phone) {
      alert('Customer phone number not available.');
      return;
    }

    const workOrderNumber = getWorkOrderNumber(repair);
    const customerName = repair.user?.fullName || 'Customer';

    // Open WhatsApp chat directly with short greeting
    const whatsappUrl = `https://wa.me/${repair.user.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(customerName)},%20this%20is%20regarding%20your%20repair%20work%20order%20${workOrderNumber}.`;

    window.open(whatsappUrl, '_blank');
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await fetch(`/api/admin/repairs/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });

      if (res.ok) {
        setNewNote('');
        await fetchRepair();
      }
    } catch (error) {
      console.error('Failed to add note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Delete this note?')) return;

    try {
      await fetch(`/api/admin/repairs/${id}/notes/${noteId}`, {
        method: 'DELETE',
      });
      await fetchRepair();
    } catch (error) {
      console.error('Failed to delete note');
    }
  };

  // ==================== PRINT WORK ORDER ====================
  const handlePrintWorkOrder = () => {
    if (!repair || !qrCodeUrl) return;

    const workOrderNumber = getWorkOrderNumber(repair);

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <html>
        <head>
          <title>Work Order - ${workOrderNumber}</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 0; padding: 40px; color: #1f2937; background: white; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #d97706; padding-bottom: 20px; margin-bottom: 30px; }
            .company-info h1 { font-size: 28px; font-weight: 700; color: #453227; margin: 0; }
            .company-info .reg { font-size: 13px; color: #6b5c4f; }
            .contact { font-size: 13px; color: #6b5c4f; line-height: 1.6; }
            .wo-number { text-align: right; }
            .wo-number .label { font-size: 12px; color: #6b5c4f; }
            .wo-number .number { font-size: 22px; font-weight: 700; color: #d97706; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 13px; font-weight: 600; color: #78350f; background: #fef3c7; padding: 6px 12px; border-radius: 6px; display: inline-block; margin-bottom: 12px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 40px; }
            .info-item label { font-size: 12px; color: #6b5c4f; display: block; margin-bottom: 4px; }
            .info-item .value { font-size: 15px; font-weight: 500; color: #1f2937; }
            .problem-box { background: #fffbeb; border: 1px solid #e6dfd5; border-radius: 10px; padding: 16px; font-size: 15px; line-height: 1.6; }
            .accessories { display: flex; flex-wrap: wrap; gap: 12px; }
            .accessory-item { background: #fef3c7; color: #92400e; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 500; }
            .qr-section { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #d1d5db; }
            .footer-note { font-size: 11px; color: #6b5c4f; margin-top: 40px; text-align: center; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <img src="/images/logo.jpg" alt="Logo" style="height: 48px; width: auto;" />
                <div>
                  <h1>Bright Light</h1>
                  <div class="reg">Technology Services • Reg No: XXXXXXX-X (To be updated)</div>
                </div>
              </div>
              <div class="contact">
                WhatsApp: +60 11-6319 9899 &nbsp;|&nbsp; Phone: +60 11-6319 9899<br>
                Email: bright.lightservices@gmail.com
              </div>
            </div>
            <div class="wo-number">
              <div class="label">WORK ORDER</div>
              <div class="number">${workOrderNumber}</div>
              <div style="font-size: 12px; color: #6b5c4f; margin-top: 4px;">
                Date: ${new Date().toLocaleDateString('en-MY')}
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">CUSTOMER INFORMATION</div>
            <div class="info-grid">
              <div class="info-item"><label>Customer Name</label><div class="value">${repair.user?.fullName || 'N/A'}</div></div>
              <div class="info-item"><label>Contact Number</label><div class="value">${repair.user?.phone || 'N/A'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DEVICE INFORMATION</div>
            <div class="info-grid">
              <div class="info-item"><label>Device Type</label><div class="value">${repair.deviceType}</div></div>
              <div class="info-item"><label>Brand &amp; Model</label><div class="value">${repair.brand} ${repair.model}</div></div>
              <div class="info-item"><label>Serial Number</label><div class="value">${repair.serialNumber || '-'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">PROBLEM DESCRIPTION</div>
            <div class="problem-box">${repair.problemDescription}</div>
          </div>

          <div class="section">
            <div class="section-title">ACCESSORIES RECEIVED</div>
            <div class="accessories">
              ${repair.hasCharger ? '<div class="accessory-item">Charger</div>' : ''}
              ${repair.hasPowerCord ? '<div class="accessory-item">Power Cord</div>' : ''}
              ${repair.hasMouse ? '<div class="accessory-item">Mouse</div>' : ''}
              ${repair.hasBag ? '<div class="accessory-item">Laptop Bag</div>' : ''}
              ${repair.otherItems ? `<div class="accessory-item">${repair.otherItems}</div>` : ''}
            </div>
          </div>

          <div class="qr-section">
            <img src="${qrCodeUrl}" style="width: 140px; height: 140px; margin: 0 auto 10px;" />
            <div style="font-weight: 600; color: #453227;">${workOrderNumber}</div>
          </div>

          <div class="footer-note">
            This is a computer-generated Work Order. Please keep this for your reference.<br>
            Bright Light Technology Services • All rights reserved.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 300);
  };

  if (loading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (!repair) return <AdminLayout><div className="p-8">Repair not found.</div></AdminLayout>;

  const currentWorkOrderNumber = getWorkOrderNumber(repair);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#453227' }}>
              {currentWorkOrderNumber}
            </h1>
            <p style={{ color: '#5c4436' }}>{repair.user?.fullName || 'Unknown Customer'}</p>
          </div>

          <div className="flex gap-3">
            {/* Contact Customer Button - Opens free chat */}
            <button
              onClick={handleContactCustomer}
              className="flex items-center gap-x-2 px-5 py-3 rounded-2xl font-semibold border active:scale-[0.985]"
              style={{ borderColor: '#d97706', color: '#d97706' }}
            >
              💬 Contact Customer
            </button>

            <button
              onClick={handlePrintWorkOrder}
              className="flex items-center gap-x-2 px-6 py-3 rounded-2xl font-semibold text-white shadow-sm active:scale-[0.985]"
              style={{ backgroundColor: '#d97706' }}
            >
              🖨️ Print Work Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Device Information */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Device Information</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div><span style={{ color: '#7c6251' }}>Device Type:</span> <span style={{ color: '#453227' }}>{repair.deviceType}</span></div>
                <div><span style={{ color: '#7c6251' }}>Brand & Model:</span> <span style={{ color: '#453227' }}>{repair.brand} ${repair.model}</span></div>
                <div className="col-span-2">
                  <span style={{ color: '#7c6251' }}>Problem:</span><br />
                  <span style={{ color: '#453227' }}>{repair.problemDescription}</span>
                </div>
              </div>
            </div>

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

            {/* Internal Notes */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Internal Notes / Activity Log</h3>

              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                  placeholder="Add a new note..."
                  className="flex-1 border rounded-xl px-4 py-2 text-sm bg-[#fdfbf7] placeholder:text-[#5c4436] text-[#453227]"
                  style={{ borderColor: '#d4c3b0' }}
                />
                <button onClick={handleAddNote} className="px-6 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#d97706', color: 'white' }}>
                  Add Note
                </button>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                {!Array.isArray(notes) || notes.length === 0 ? (
                  <p className="text-sm text-[#7c6251]">No notes yet.</p>
                ) : (
                  notes.map((note: any) => (
                    <div key={note.id} className="flex justify-between items-start bg-[#fdfbf7] border rounded-xl p-4" style={{ borderColor: '#e6dfd5' }}>
                      <div>
                        <p className="text-sm" style={{ color: '#453227' }}>{note.content}</p>
                        <p className="text-xs mt-1" style={{ color: '#9f7a5f' }}>{new Date(note.createdAt).toLocaleString('en-MY')}</p>
                      </div>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-600 text-lg leading-none">×</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Update Status */}
            <div className="bg-white border rounded-2xl p-6" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Update Status</h3>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded-xl px-4 py-3 mb-4 text-lg bg-[#fdfbf7] text-[#453227]" style={{ borderColor: '#d4c3b0' }}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {saveMessage && <p className="text-sm mb-3 text-green-600">{saveMessage}</p>}
              <button onClick={handleUpdateStatus} disabled={saving} className="w-full py-3 rounded-xl font-bold text-white text-lg" style={{ backgroundColor: '#d97706' }}>
                {saving ? 'Saving...' : 'Save Status'}
              </button>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="bg-white border rounded-2xl p-6 text-center" style={{ borderColor: '#e6dfd5' }}>
                <h3 className="font-bold mb-4" style={{ color: '#453227' }}>Work Order QR Code</h3>
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-44 h-44 border-8 border-white rounded-2xl mb-4" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <p className="font-semibold mb-4" style={{ color: '#453227' }}>{currentWorkOrderNumber}</p>
                <button onClick={() => {
                  const printWindow = window.open('', '_blank');
                  if (!printWindow) return;
                  printWindow.document.write(`<html><body style="text-align:center; padding:40px"><h2>${currentWorkOrderNumber}</h2><img src="${qrCodeUrl}" style="width:220px"/><p>${repair.brand} ${repair.model}</p></body></html>`);
                  printWindow.document.close();
                  printWindow.focus();
                  setTimeout(() => printWindow.print(), 300);
                }} className="w-full py-2.5 rounded-xl font-semibold text-sm" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                  Print QR Code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}