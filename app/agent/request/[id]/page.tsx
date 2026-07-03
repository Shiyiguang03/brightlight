'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';
import QRCode from 'qrcode';

interface RepairRequest {
  id: number;
  workOrderNumber?: string;
  customerName?: string;
  user?: { fullName: string; phone: string };
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string;
  problemDescription: string;
  urgency: string;
  status: string;
  createdAt: string;
  images?: string[];
  internalNotes?: string;
}

export default function AgentRequestDetail() {
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<RepairRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

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

  // ✅ Generate standard format: WO-A-BL-DDMMYY-XXX
  const getWorkOrderNumber = (req: RepairRequest) => {
    if (req.workOrderNumber) {
      return req.workOrderNumber;
    }
    const date = new Date(req.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const datePart = `${day}${month}${year}`;
    const numberPart = String(req.id).padStart(3, '0');

    return `WO-A-BL-${datePart}-${numberPart}`;
  };

  // Fetch request data
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        let res = await fetch(`/api/agent/repair-requests/${id}`);
        if (!res.ok) {
          res = await fetch(`/api/repair-requests/${id}`);
        }
        if (res.ok) {
          const data = await res.json();
          setRequest(data);
        } else {
          setRequest(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequest();
  }, [id]);

  // Generate QR Code
  useEffect(() => {
    if (request) {
      const generateQR = async () => {
        const workOrderNumber = getWorkOrderNumber(request);
        try {
          const dataUrl = await QRCode.toDataURL(workOrderNumber, {
            width: 220,
            margin: 2,
            color: { dark: '#453227', light: '#ffffff' },
          });
          setQrCodeUrl(dataUrl);
        } catch (err) {
          console.error('QR generation failed', err);
        }
      };
      generateQR();
    }
  }, [request]);

  // Print Work Order
  const handlePrintWorkOrder = () => {
    if (!request || !qrCodeUrl) return;

    const workOrderNumber = getWorkOrderNumber(request);

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
                  <div class="reg">Technology Services • Reg No: XXXXXXX-X</div>
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
                Date: ${new Date(request.createdAt).toLocaleDateString('en-MY')}
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">CUSTOMER INFORMATION</div>
            <div class="info-grid">
              <div class="info-item"><label>Customer Name</label><div class="value">${request.customerName || request.user?.fullName || 'Walk-in Customer'}</div></div>
              <div class="info-item"><label>Phone</label><div class="value">${request.user?.phone || 'Not provided'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">DEVICE INFORMATION</div>
            <div class="info-grid">
              <div class="info-item"><label>Device Type</label><div class="value">${request.deviceType}</div></div>
              <div class="info-item"><label>Brand & Model</label><div class="value">${request.brand} ${request.model}</div></div>
              <div class="info-item"><label>Serial Number</label><div class="value">${request.serialNumber || '-'}</div></div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">PROBLEM DESCRIPTION</div>
            <div class="problem-box">${request.problemDescription}</div>
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
          <Link href="/agent/my-request" className="text-[#d97706] underline mt-4 inline-block">
            ← Back to My Requests
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const workOrderNumber = getWorkOrderNumber(request);
  const customerName = request.customerName || request.user?.fullName || 'Walk-in Customer';

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link href="/agent/my-request" className="text-sm text-[#d97706] hover:underline">
              ← Back to My Requests
            </Link>
            <h1 className="text-3xl font-bold mt-2" style={{ color: '#1f130b' }}>
              {workOrderNumber}
            </h1>
            <p style={{ color: '#7c6251', marginTop: '4px' }}>
              Submitted on {formatDateTime(request.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: request.status === 'Pending' ? '#fef3c7' : '#dcfce7',
                color: request.status === 'Pending' ? '#92400e' : '#166534'
              }}
            >
              {request.status}
            </span>

            <button
              onClick={handlePrintWorkOrder}
              className="flex items-center gap-x-2 px-5 py-2 rounded-xl font-semibold text-white text-sm"
              style={{ backgroundColor: '#d97706' }}
            >
              🖨️ Print Work Order
            </button>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-8" style={{ borderColor: '#e6dfd5' }}>

          {/* Customer Info */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>CUSTOMER NAME</p>
                <p style={{ color: '#1f130b', fontWeight: '500' }}>{customerName}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>PHONE</p>
                <p style={{ color: '#1f130b' }}>{request.user?.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Device Info */}
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
              <div>
                <p className="text-xs font-bold tracking-wider" style={{ color: '#9f7a5f' }}>URGENCY</p>
                <p style={{ color: '#1f130b' }}>{request.urgency}</p>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#1f130b' }}>Problem Description</h3>
            <div className="bg-[#fdfbf7] p-4 rounded-xl border" style={{ borderColor: '#e6dfd5' }}>
              <p className="whitespace-pre-wrap" style={{ color: '#1f130b' }}>{request.problemDescription}</p>
            </div>
          </div>

          {/* Internal Notes */}
          {request.internalNotes && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-2" style={{ color: '#1f130b' }}>Internal Notes</h3>
              <div className="bg-[#fefce8] p-4 rounded-xl border" style={{ borderColor: '#fde047' }}>
                <p className="whitespace-pre-wrap" style={{ color: '#1f130b' }}>{request.internalNotes}</p>
              </div>
            </div>
          )}

          {/* Photos */}
          {request.images && request.images.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4" style={{ color: '#1f130b' }}>Uploaded Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {request.images.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Photo ${index + 1}`} className="w-full h-40 object-cover rounded-xl border hover:opacity-90 transition" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* QR Code Section */}
          {qrCodeUrl && (
            <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e6dfd5' }}>
              <h3 className="font-semibold text-lg mb-4 text-center" style={{ color: '#1f130b' }}>
                Work Order QR Code
              </h3>
              <div className="flex flex-col items-center">
                <img src={qrCodeUrl} alt="Work Order QR Code" className="w-48 h-48 border-8 border-white rounded-2xl shadow-lg mb-4" />
                <p className="font-bold text-xl mb-4" style={{ color: '#453227' }}>
                  {workOrderNumber}
                </p>
                <button
                  onClick={handlePrintWorkOrder}
                  className="px-6 py-3 rounded-2xl font-semibold text-white"
                  style={{ backgroundColor: '#d97706' }}
                >
                  🖨️ Print Work Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}