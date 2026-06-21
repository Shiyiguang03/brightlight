'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const STATUS_STEPS = [
  { name: 'Received', icon: 'package' },
  { name: 'Diagnosed', icon: 'magnifier' },
  { name: 'Repairing', icon: 'wrench' },
  { name: 'Ready', icon: 'box' },
  { name: 'Collected', icon: 'check' },
];

function getStepIndex(status: string): number {
  const stepNames = STATUS_STEPS.map(s => s.name);
  switch (status) {
    case 'Pending':      return 0;
    case 'Diagnosed':    return stepNames.indexOf('Diagnosed');
    case 'In Progress':  return stepNames.indexOf('Repairing');
    case 'Ready':        return stepNames.indexOf('Ready');
    case 'Completed':
    case 'Done':         return stepNames.length - 1;
    default:             return 0;
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bgColor: string; textColor: string; borderColor: string }> = {
    Pending: { label: 'Pending', bgColor: 'bg-amber-50', textColor: 'text-amber-800', borderColor: 'border-amber-200' },
    'In Progress': { label: 'In Progress', bgColor: 'bg-yellow-50', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' },
    Completed: { label: 'Done', bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
    Done: { label: 'Done', bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
  };

  const cfg = config[status] ?? config['Pending'];

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold ${cfg.bgColor} ${cfg.textColor} border ${cfg.borderColor}`}>
      {cfg.label}
    </span>
  );
}

function StepIcon({ type }: { type: string; isActive: boolean; isDone: boolean }) {
  const iconProps = {
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {
    case 'package':
      return <svg {...iconProps}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
    case 'magnifier':
      return <svg {...iconProps}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
    case 'wrench':
      return <svg {...iconProps}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>;
    case 'box':
      return <svg {...iconProps}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>;
    case 'check':
      return <svg {...iconProps}><polyline points="20 6 9 17 4 12" /></svg>;
    default:
      return null;
  }
}

function ProgressTracker({ status }: { status: string }) {
  const activeIndex = getStepIndex(status);
  const isDone = status === 'Completed' || status === 'Done';

  return (
    <div className="mt-6 pt-4">
      {/* Circles Row */}
      <div className="flex items-start justify-between">
        {STATUS_STEPS.map((step, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;

          let dotClass = '';
          let textColor = '';

          if (isDone) {
            dotClass = 'bg-[#d97706] border-[#d97706] text-white';
            textColor = 'text-[#453227]';
          } else if (isCompleted) {
            dotClass = 'bg-[#d97706] border-[#d97706] text-white';
            textColor = 'text-[#453227]';
          } else if (isActive) {
            dotClass = 'bg-[#fef3c7] border-[#d97706] text-[#d97706]';
            textColor = 'text-[#453227]';
          } else {
            dotClass = 'bg-white border-[#e6dfd5] text-[#e6dfd5]';
            textColor = 'text-[#9f7a5f]';
          }

          return (
            <div key={step.name} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${dotClass}`}>
                <StepIcon type={step.icon} isActive={isActive} isDone={isDone} />
              </div>
              <span className={`text-[10px] font-medium mt-1.5 text-center ${textColor}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Lines Row - 5 Lines for 5 Circles */}
      <div className="flex mt-2">
        {Array.from({ length: 5 }).map((_, i) => {
          // Determine if this line should be active/completed
          const isLineActive = i < activeIndex; // Lines before active step are filled

          const lineColor = isDone 
            ? '#d97706' 
            : isLineActive 
              ? '#d97706' 
              : '#e6dfd5';

          return (
            <div key={i} className="flex-1 px-1">
              <div 
                className="h-[3px] rounded-full" 
                style={{ backgroundColor: lineColor }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(storedUser);

    fetch(`/api/my-repairs?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setRepairs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: '#fcfbf7', minHeight: '100vh', color: '#453227' }}>
      <Navbar />

      <div style={{ padding: '48px 16px' }}>
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>

          {/* Fully separated flex header layout */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4" style={{ marginBottom: '36px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#453227', margin: '0 0 4px' }}>
                My Repairs
              </h1>
              <p style={{ fontSize: '14px', color: '#7c6251', margin: 0 }}>
                Click on any card to view full details of your repair request.
              </p>
            </div>
            
            <Link 
              href="/request-repair" 
              className="mt-2 sm:mt-0 w-full sm:w-auto text-center inline-block"
              style={{ 
                backgroundColor: '#d97706', 
                color: '#ffffff', 
                padding: '10px 20px', 
                borderRadius: '10px', 
                fontSize: '13px', 
                fontWeight: '700', 
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(217, 119, 6, 0.15)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b45309')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#d97706')}
            >
              Request New Repair
            </Link>
          </div>

          {/* List Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#7c6251', fontSize: '14px' }}>
              Loading your repair requests…
            </div>
          ) : repairs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e6dfd5' }}>
              <p style={{ fontSize: '15px', color: '#7c6251', margin: '0 0 16px' }}>You haven&apos;t submitted any repair requests yet.</p>
              <Link href="/request-repair" style={{ display: 'inline-block', backgroundColor: '#d97706', color: '#ffffff', padding: '12px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                Request a Repair
              </Link>
            </div>
          ) : (
            repairs.map((repair) => {
              const currentStatus = repair.status || 'Pending';

              return (
                <div
                  key={repair.id}
                  onClick={() => setSelectedRepair(repair)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid #e6dfd5',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(69, 50, 39, 0.04), 0 4px 6px -2px rgba(69, 50, 39, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Item Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#453227', margin: '0 0 8px' }}>
                        {repair.brand} {repair.model}
                      </h2>
                      <StatusBadge status={currentStatus} />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#7c6251', lineHeight: '1.4' }}>
                      Submitted on<br />
                      <span style={{ color: '#453227', fontWeight: '700' }}>
                        {new Date(repair.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#5c4436', margin: '4px 0' }}>
                      <strong style={{ color: '#453227' }}>Device:</strong> {repair.deviceType}
                    </p>
                    <p style={{ fontSize: '14px', color: '#5c4436', margin: '4px 0' }}>
                      <strong style={{ color: '#453227' }}>Problem:</strong> {repair.problemDescription}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #e6dfd5', margin: '16px 0' }} />

                  {/* Progress Tracker */}
                  <ProgressTracker status={currentStatus} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedRepair && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(69, 50, 39, 0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', color: '#453227' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #e6dfd5' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#453227', margin: 0 }}>Repair Details</h2>
                <p style={{ fontSize: '13px', color: '#7c6251', margin: '4px 0 0' }}>
                  Submitted on {new Date(selectedRepair.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRepair(null)} 
                style={{ fontSize: '24px', color: '#7c6251', background: '#fdfbf7', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.color = '#b45309'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fdfbf7'; e.currentTarget.style.color = '#7c6251'; }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#5c4436' }}>Current Status:</span>
                <StatusBadge status={selectedRepair.status || 'Pending'} />
              </div>

              <div style={{ backgroundColor: '#fdfbf7', borderRadius: '16px', padding: '20px', border: '1px solid #e6dfd5' }}>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7c6251', fontWeight: '700', margin: '0 0 14px 0' }}>Device Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#7c6251' }}>Device Type</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#453227' }}>{selectedRepair.deviceType}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#7c6251' }}>Brand & Model</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#453227' }}>{selectedRepair.brand} {selectedRepair.model}</span>
                  </div>
                  {selectedRepair.serialNumber && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: '#7c6251' }}>Serial Number</span>
                      <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '600', color: '#5c4436' }}>{selectedRepair.serialNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#7c6251', fontWeight: '700', margin: '0 0 8px 0' }}>Issue Description</h4>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e6dfd5', borderRadius: '12px', padding: '16px', minHeight: '60px', color: '#5c4436', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedRepair.problemDescription}
                </div>
              </div>

              {(selectedRepair.hasCharger || selectedRepair.hasPowerCord || selectedRepair.hasMouse || selectedRepair.hasBag || selectedRepair.otherItems) && (
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#7c6251', fontWeight: '700', margin: '0 0 10px 0' }}>Accessories Included</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedRepair.hasCharger && <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>🔌 Charger</span>}
                    {selectedRepair.hasPowerCord && <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>🔌 Power Cord</span>}
                    {selectedRepair.hasMouse && <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>🖱️ Mouse</span>}
                    {selectedRepair.hasBag && <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>💼 Bag</span>}
                    {selectedRepair.otherItems && <span style={{ backgroundColor: '#fdfbf7', color: '#5c4436', border: '1px solid #e6dfd5', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>📦 {selectedRepair.otherItems}</span>}
                  </div>
                </div>
              )}

              {selectedRepair.images && selectedRepair.images.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#7c6251', fontWeight: '700', margin: '0 0 12px 0' }}>Uploaded Images ({selectedRepair.images.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {selectedRepair.images.map((url: string, index: number) => (
                      <a 
                        key={index} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'block', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6dfd5', transition: 'transform 0.2s', position: 'relative' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                      >
                        <img src={url} alt="Repair Attachment" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid #e6dfd5', backgroundColor: '#fdfbf7', textAlign: 'right', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <button 
                onClick={() => setSelectedRepair(null)} 
                style={{ padding: '12px 28px', backgroundColor: '#ffffff', color: '#5c4436', border: '1px solid #e6dfd5', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fdfbf7'; e.currentTarget.style.borderColor = '#d97706'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e6dfd5'; }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}