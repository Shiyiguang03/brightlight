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
  const config: Record<string, { label: string; bgColor: string; textColor: string }> = {
    Pending: { label: 'Pending', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    'In Progress': { label: 'In Progress', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
    Completed: { label: 'Done', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    Done: { label: 'Done', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  };

  const cfg = config[status] ?? config['Pending'];

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold ${cfg.bgColor} ${cfg.textColor} border ${cfg.bgColor === 'bg-blue-100' ? 'border-blue-300' : cfg.bgColor === 'bg-amber-100' ? 'border-amber-300' : 'border-green-300'}`}>
      {cfg.label}
    </span>
  );
}

function StepIcon({ type, isActive, isDone }: { type: string; isActive: boolean; isDone: boolean }) {
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

  const getIcon = () => {
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
  };

  return getIcon();
}

function ProgressTracker({ status }: { status: string }) {
  const activeIndex = getStepIndex(status);
  const isDone = status === 'Completed' || status === 'Done';

  return (
    <div className="mt-6 pt-4">
      <div className="flex items-start justify-between">
        {STATUS_STEPS.map((step, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;

          let dotClass = '';
          let textColor = '';

          if (isDone) {
            dotClass = 'bg-green-600 border-2 border-green-600 text-white';
            textColor = 'text-slate-700';
          } else if (isCompleted) {
            dotClass = 'bg-blue-600 border-2 border-blue-600 text-white';
            textColor = 'text-slate-700';
          } else if (isActive) {
            dotClass = 'bg-blue-50 border-2 border-blue-600 text-blue-600';
            textColor = 'text-slate-700';
          } else {
            dotClass = 'bg-slate-100 border-2 border-slate-200 text-slate-300';
            textColor = 'text-slate-500';
          }

          return (
            <div key={step.name} className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${dotClass}`}>
                <StepIcon type={step.icon} isActive={isActive} isDone={isDone} />
              </div>
              <span className={`text-xs font-medium mt-2 text-center ${textColor}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex mt-2">
        {STATUS_STEPS.map((_, i) => {
          if (i >= STATUS_STEPS.length - 1) return null;
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const connectorClass = isDone ? 'bg-green-500' : (isCompleted || isActive) ? 'bg-blue-500' : 'bg-slate-200';
          return <div key={`connector-${i}`} className="flex-1 px-1"><div className={`h-1 rounded-full ${connectorClass}`} /></div>;
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
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '48px 16px' }}>
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                My Repairs
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                Click on any card to view full details of your repair request.
              </p>
            </div>
            <Link 
              href="/request-repair" 
              style={{ 
                backgroundColor: '#2563eb', 
                color: '#ffffff', 
                padding: '12px 20px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                fontWeight: '600', 
                textDecoration: 'none',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              Request New Repair
            </Link>
          </div>

          {/* List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '14px' }}>
              Loading your repair requests…
            </div>
          ) : repairs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 16px' }}>You haven&apos;t submitted any repair requests yet.</p>
              <a href="/request-repair" style={{ display: 'inline-block', backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                Request a Repair
              </a>
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
                    border: '1px solid #e2e8f0',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
                        {repair.brand} {repair.model}
                      </h2>
                      <StatusBadge status={currentStatus} />
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                      Submitted on<br />
                      <span style={{ color: '#0f172a', fontWeight: '600' }}>
                        {new Date(repair.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '14px', color: '#334155', margin: '4px 0' }}>
                      <strong style={{ color: '#0f172a' }}>Device:</strong> {repair.deviceType}
                    </p>
                    <p style={{ fontSize: '14px', color: '#334155', margin: '4px 0' }}>
                      <strong style={{ color: '#0f172a' }}>Problem:</strong> {repair.problemDescription}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />

                  {/* Progress Tracker */}
                  <ProgressTracker status={currentStatus} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modern Redesigned Modal */}
      {selectedRepair && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Repair Details</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                  Submitted on {new Date(selectedRepair.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedRepair(null)} 
                style={{ fontSize: '24px', color: '#94a3b8', background: '#f8fafc', border: 'none', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Status Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Current Status:</span>
                <StatusBadge status={selectedRepair.status || 'Pending'} />
              </div>

              {/* Device Info Fields Grid */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: '700', margin: '0 0 14px 0' }}>Device Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Device Type</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{selectedRepair.deviceType}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Brand & Model</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{selectedRepair.brand} {selectedRepair.model}</span>
                  </div>
                  {selectedRepair.serialNumber && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Serial Number</span>
                      <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '600', color: '#334155' }}>{selectedRepair.serialNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Description Block */}
              <div>
                <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', margin: '0 0 8px 0' }}>Issue Description</h4>
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', minHeight: '60px', color: '#334155', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedRepair.problemDescription}
                </div>
              </div>

              {/* Accessories Included */}
              {(selectedRepair.hasCharger || selectedRepair.hasPowerCord || selectedRepair.hasMouse || selectedRepair.hasBag || selectedRepair.otherItems) && (
                <div>
                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', margin: '0 0 10px 0' }}>Accessories Included</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedRepair.hasCharger && <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>🔌 Charger</span>}
                    {selectedRepair.hasPowerCord && <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>🔌 Power Cord</span>}
                    {selectedRepair.hasMouse && <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>🖱️ Mouse</span>}
                    {selectedRepair.hasBag && <span style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>💼 Bag</span>}
                    {selectedRepair.otherItems && <span style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '500' }}>📦 {selectedRepair.otherItems}</span>}
                  </div>
                </div>
              )}

              {/* Images Section with beautiful grids */}
              {selectedRepair.images && selectedRepair.images.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', margin: '0 0 12px 0' }}>Uploaded Images ({selectedRepair.images.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {selectedRepair.images.map((url: string, index: number) => (
                      <a 
                        key={index} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ display: 'block', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'transform 0.2s', position: 'relative' }}
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

            {/* Modal Footer Actions */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc', textAlign: 'right', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <button 
                onClick={() => setSelectedRepair(null)} 
                style={{ padding: '12px 28px', backgroundColor: '#ffffff', color: '#334155', border: '1px solid #d1d5db', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#9ca3af'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#d1d5db'; }}
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