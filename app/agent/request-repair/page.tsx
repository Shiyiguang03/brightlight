'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function AgentRequestRepair() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    deviceType: 'Laptop',
    brand: '',
    model: '',
    serialNumber: '',
    problemDescription: '',
    urgency: 'Normal',
    preferredDate: '',
    preferredTime: '',
    internalNotes: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `repair-images/${fileName}`;

      const { error } = await supabase.storage
        .from('repair-images') // ← Make sure this bucket exists in Supabase
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data } = supabase.storage
        .from('repair-images')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      // Upload images first
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImagesToSupabase(images);
      }

      const payload = {
        ...formData,
        submittedByAgentId: currentUser?.id || null,
        images: imageUrls,
      };

      const res = await fetch('/api/agent/submit-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Repair request submitted successfully! ID: ${data.requestId}`);
        
        // Reset form
        setFormData({
          customerName: '', customerPhone: '', customerAddress: '',
          deviceType: 'Laptop', brand: '', model: '', serialNumber: '',
          problemDescription: '', urgency: 'Normal', preferredDate: '', preferredTime: '', internalNotes: '',
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        alert(data.message || 'Failed to submit');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f130b' }}>Submit Repair Request</h1>
        <p className="mb-8" style={{ color: '#5c4436' }}>Helping customer create a repair request</p>

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-8" style={{ borderColor: '#e6dfd5' }}>

          {/* Customer Information */}
          <div className="mb-8">
            <p className="font-semibold mb-4" style={{ color: '#1f130b' }}>Customer Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Customer Full Name</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Customer Phone</label>
                <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Customer Address / Location</label>
              <input type="text" name="customerAddress" value={formData.customerAddress} onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
            </div>
          </div>

          {/* Device Information */}
          <div className="mb-8">
            <p className="font-semibold mb-4" style={{ color: '#1f130b' }}>Device Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Device Type</label>
                <select name="deviceType" value={formData.deviceType} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }}>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop / PC</option>
                  <option value="Printer">Printer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Serial Number</label>
                <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Problem Description</label>
            <textarea name="problemDescription" value={formData.problemDescription} onChange={handleChange} required rows={4}
              className="w-full border rounded-2xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
          </div>

          {/* Photo Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Upload Photos (Optional)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#fef3c7] file:text-[#b45309]" />
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img src={preview} alt="preview" className="w-full h-24 object-cover rounded-xl border" />
                    <button type="button" onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgency & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Urgency</label>
              <select name="urgency" value={formData.urgency} onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }}>
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Preferred Date</label>
              <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Preferred Time</label>
              <input type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
            </div>
          </div>

          {/* Internal Notes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1f130b' }}>Internal Notes (For Staff)</label>
            <textarea name="internalNotes" value={formData.internalNotes} onChange={handleChange} rows={3}
              className="w-full border rounded-2xl px-4 py-3 text-sm" style={{ borderColor: '#d1c4b8', color: '#1f130b' }} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-white text-lg transition hover:opacity-90 disabled:opacity-70"
            style={{ backgroundColor: '#d97706' }}>
            {loading ? 'Submitting...' : 'Submit Repair Request'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}