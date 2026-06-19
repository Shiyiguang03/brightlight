'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ textAlign: 'center', paddingTop: '100px', color: '#64748b' }}>
          Loading your repair requests...
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '48px 16px' }}>
        <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
              My Repairs
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Click on any card to view full details of your repair request.
            </p>
          </div>

          {/* Repair List */}
          {repairs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '15px', color: '#64748b', margin: '0 0 16px' }}>
                You haven't submitted any repair requests yet.
              </p>
              <Link 
                href="/request-repair" 
                style={{ 
                  display: 'inline-block', 
                  backgroundColor: '#2563eb', 
                  color: '#ffffff', 
                  padding: '10px 24px', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  textDecoration: 'none' 
                }}
              >
                Request a Repair
              </Link>
            </div>
          ) : (
            repairs.map((repair) => (
              <div
                key={repair.id}
                onClick={() => setSelectedRepair(repair)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
                      {repair.brand} {repair.model}
                    </h3>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 10px', 
                      borderRadius: '9999px', 
                      backgroundColor: repair.status === 'Completed' ? '#dcfce7' : '#fef9c3',
                      color: repair.status === 'Completed' ? '#166534' : '#854d0e',
                      fontWeight: '600'
                    }}>
                      {repair.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#64748b' }}>
                    {new Date(repair.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#475569', marginTop: '12px', marginBottom: 0 }}>
                  {repair.problemDescription.length > 80 
                    ? repair.problemDescription.substring(0, 80) + '...' 
                    : repair.problemDescription}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==================== IMPROVED MODAL ==================== */}
      {selectedRepair && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 8px', color: '#0f172a' }}>
                  Repair Details
                </h2>
                <span style={{ 
                  fontSize: '12px', 
                  padding: '4px 12px', 
                  borderRadius: '9999px', 
                  backgroundColor: selectedRepair.status === 'Completed' ? '#dcfce7' : '#fef9c3', 
                  color: selectedRepair.status === 'Completed' ? '#166534' : '#854d0e',
                  fontWeight: '600'
                }}>
                  {selectedRepair.status}
                </span>
              </div>
              <button onClick={() => setSelectedRepair(null)} style={{ fontSize: '26px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>

            {/* Device Information */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>DEVICE INFORMATION</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <p style={{ margin: '6px 0', fontSize: '14px', color: '#1e293b' }}><strong>Device:</strong> {selectedRepair.deviceType}</p>
                <p style={{ margin: '6px 0', fontSize: '14px', color: '#1e293b' }}><strong>Brand & Model:</strong> {selectedRepair.brand} {selectedRepair.model}</p>
                <p style={{ margin: '6px 0', fontSize: '14px', color: '#1e293b' }}><strong>Serial Number:</strong> {selectedRepair.serialNumber || 'Not provided'}</p>
              </div>
            </div>

            {/* Problem Description */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>PROBLEM DESCRIPTION</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <p style={{ fontSize: '14px', color: '#1e293b', whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selectedRepair.problemDescription}
                </p>
              </div>
            </div>

            {/* Accessories */}
            {(selectedRepair.hasCharger || selectedRepair.hasPowerCord || selectedRepair.hasMouse || selectedRepair.hasBag || selectedRepair.otherItems) && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>ACCESSORIES INCLUDED</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedRepair.hasCharger && <span style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>Charger</span>}
                  {selectedRepair.hasPowerCord && <span style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>Power Cord</span>}
                  {selectedRepair.hasMouse && <span style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>Mouse</span>}
                  {selectedRepair.hasBag && <span style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>Bag</span>}
                  {selectedRepair.otherItems && <span style={{ backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>{selectedRepair.otherItems}</span>}
                </div>
              </div>
            )}

            {/* Images */}
            {selectedRepair.images && selectedRepair.images.length > 0 ? (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>UPLOADED PHOTOS ({selectedRepair.images.length})</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
                  {selectedRepair.images.map((url: string, index: number) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt="Repair photo" 
                      style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                      onClick={() => window.open(url, '_blank')}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>UPLOADED PHOTOS</p>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>No photos uploaded</p>
              </div>
            )}

            {/* Preferred Dates */}
            {(selectedRepair.preferredStartDate || selectedRepair.preferredEndDate) && (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '10px' }}>PREFERRED REPAIR WINDOW</p>
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                  {selectedRepair.preferredStartDate && (
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#1e293b' }}>
                      <strong>Start Date:</strong> {new Date(selectedRepair.preferredStartDate).toLocaleDateString()}
                    </p>
                  )}
                  {selectedRepair.preferredEndDate && (
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#1e293b' }}>
                      <strong>End Date:</strong> {new Date(selectedRepair.preferredEndDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <button 
                onClick={() => setSelectedRepair(null)} 
                style={{ padding: '10px 24px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', color: '#334155' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================== END OF MODAL ==================== */}
    </div>
  );
}